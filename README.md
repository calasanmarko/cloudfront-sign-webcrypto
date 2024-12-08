# cloudfront-sign-webcrypto
*Presign CloudFront URLs in JS using Web Crypto*

## Installation
```bash
npm install cloudfront-sign-webcrypto
```

## Usage
```ts
const generateSignedUrl = (url: string) => {
    const now = new Date();
    const expiryDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const cloudFrontUrl = await createCloudFrontPresignedUrl({
        policy: {
            url,
            expireTimeEpochMs: expiryDate.getTime(),
        },
        key: {
            keyPairId: cloudFrontKeyData.keyPairId,
            content: cloudFrontKeyData.pemEncodedPrivateKey,
            format: "pkcs8"
        },
    });

    console.log(`Presigned URL generated: ${cloudFrontUrl}`);
    
    return cloudFrontUrl;
}
```

## Key caching
To avoid re-importing the key on each generation, you can do this once, and then pass it into `createCloudFrontPresignedUrl` using the `importedKey` parameter.

```ts
const cloudFrontKey = {
    keyPairId: cloudFrontKeyData.keyPairId,
    content: cloudFrontKeyData.pemEncodedPrivateKey,
    format: "pkcs8"
}

const importedCloudFrontKey = await importCloudFrontPrivateKey(cloudFrontKey);

const generateSignedUrl = (url: string) => {
    const now = new Date();
    const expiryDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const cloudFrontUrl = await createCloudFrontPresignedUrl({
        policy: {
            url,
            expireTimeEpochMs: expiryDate.getTime(),
        },
        key: cloudFrontKey,
        importedKey: importedCloudFrontKey
    });

    console.log(`Presigned URL generated: ${cloudFrontUrl}`);
    
    return cloudFrontUrl;
}
```

This should improve performance, as they key is not re-imported on every URL generation.