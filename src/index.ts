const cloudFrontSigningAlgorithm = "RSASSA-PKCS1-v1_5";

export type CloudFrontPolicy = {
    url: string;
    expireTimeEpochMs: number;
    ipRange?: string | undefined;
};

export type CloudFrontKey = {
    keyPairId: string;
    content: string;
    format: "pkcs8";
};

const normalizeBase64 = (str: string): string => {
    return str.replace(/\+/gu, "-").replace(/[=]/gu, "_").replace(/\//gu, "~");
};

/**
 * Convert an epoch time in milliseconds to seconds.
 *
 * @param expireTime - The epoch time in milliseconds.
 * @returns The epoch time in seconds.
 */
const parseExpireTime = (expireTime: number): number => {
    const parsed = Math.floor(expireTime / 1000);
    if (!parsed || isNaN(parsed)) {
        throw new Error("CloudFrontPolicy expireTime must be a valid number");
    }

    return parsed;
};

export const cloudFrontPolicyToJSON = (policy: CloudFrontPolicy) => {
    if (!policy.url) {
        throw new Error("CloudFrontPolicy must have a URL");
    }

    const fixedExpireTime = parseExpireTime(policy.expireTimeEpochMs);

    return {
        Statement: [
            {
                Resource: policy.url,
                Condition: {
                    DateLessThan: {
                        "AWS:EpochTime": fixedExpireTime,
                    },
                    ...(policy.ipRange
                        ? {
                              IpAddress: {
                                  "AWS:SourceIp": policy.ipRange,
                              },
                          }
                        : {}),
                },
            },
        ],
    };
};

export const importCloudFrontPrivateKey = (key: CloudFrontKey): Promise<CryptoKey> => {
    const base64Key = key.content.replace(/-----[^-]+-----/gu, "").replace(/\s+/gu, "");
    const keyBytes = new Uint8Array(Buffer.from(base64Key, "base64"));

    return crypto.subtle.importKey(
        "pkcs8",
        keyBytes,
        {
            name: cloudFrontSigningAlgorithm,
            hash: "SHA-1",
        },
        false,
        ["sign"]
    );
};

export const signCloudFrontPolicyData = async (opts: { key: CryptoKey; data: Uint8Array }): Promise<string> => {
    const signature = await crypto.subtle.sign(cloudFrontSigningAlgorithm, opts.key, opts.data);

    return Buffer.from(signature).toString("base64");
};

export const createCloudFrontPresignedUrl = async (opts: {
    policy: CloudFrontPolicy;
    key: CloudFrontKey;
    importedKey?: CryptoKey | undefined;
}): Promise<string> => {
    const policyJson = JSON.stringify(cloudFrontPolicyToJSON(opts.policy));
    const policyData = Buffer.from(policyJson);
    const policyBase64 = policyData.toString("base64");

    const key = opts.importedKey ?? (await importCloudFrontPrivateKey(opts.key));
    const signature = await signCloudFrontPolicyData({
        key,
        data: policyData,
    });

    const fixedExpireTime = parseExpireTime(opts.policy.expireTimeEpochMs);

    const url = new URL(opts.policy.url);
    url.searchParams.set("Expires", `${fixedExpireTime}`);
    url.searchParams.set("Policy", normalizeBase64(policyBase64));
    url.searchParams.set("Signature", normalizeBase64(signature));
    url.searchParams.set("Key-Pair-Id", opts.key.keyPairId);

    return url.toString();
};
