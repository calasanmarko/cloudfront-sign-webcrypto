import { url, expireTime, cloudfrontKeyData } from "./data.js";
import { getSignedUrl } from "aws-cloudfront-sign";
import { createCloudFrontPresignedUrl, importCloudFrontPrivateKey } from "cloudfront-sign-webcrypto";

const iterations = 100;
const target = process.argv[2];
const parallel = process.argv.includes("--parallel");
const cached = process.argv.includes("--cache");

const runAwsCloudfrontSign = () => {
    return getSignedUrl(url, {
        keypairId: cloudfrontKeyData.id,
        privateKeyString: cloudfrontKeyData.content,
        expireTime,
    });
};

let importedKey;
const runCloudfrontSignWebcrypto = () => {
    return createCloudFrontPresignedUrl({
        policy: {
            url,
            expireTimeEpochMs: expireTime,
        },
        key: {
            id: cloudfrontKeyData.id,
            format: cloudfrontKeyData.format,
            content: cloudfrontKeyData.content,
        },
        importedKey,
    });
};

const runBatch = async (fn) => {
    if (parallel) {
        await Promise.all(Array.from({ length: iterations }, fn));
    } else {
        for (let i = 0; i < iterations; i++) {
            // Disabled ESLint rules for benchmarking purposes
            // eslint-disable-next-line no-await-in-loop
            await fn();
        }
    }
};

switch (target) {
    case "aws-cloudfront-sign":
        if (cached) {
            throw new Error("Cached mode is not supported for this target");
        }
        await runBatch(runAwsCloudfrontSign);
    case "cloudfront-sign-webcrypto":
        if (cached) {
            importedKey = await importCloudFrontPrivateKey(cloudfrontKeyData);
        }
        await runBatch(runCloudfrontSignWebcrypto);
        break;
    default:
        throw new Error(`Unknown target: ${target}`);
}
