# cloudfront-sign-webcrypto
*Presign CloudFront URLs in JS using Web Crypto*

## Performance
The [aws-cloudfront-sign](https://github.com/jasonsims/aws-cloudfront-sign) package that this package was based on uses `node:crypto` to sign CloudFront pre-signed URLs.

This package uses WebCrypto to sign URLs for the following reasons:
1. `crypto.subtle.sign` is an async function, allowing large numbers of pre-signed URLs to be generated concurrently.
2. Bun's implementation of `node:crypto` is significantly slower, making [aws-cloudfront-sign](https://github.com/jasonsims/aws-cloudfront-sign) practically unusable on Bun

This package also allows for a WebCrpyto key to be imported once, and then reused, unlike [aws-cloudfront-sign](https://github.com/jasonsims/aws-cloudfront-sign), which re-imports the PEM string passed as an argument on each execution. See **Key caching** below for more details.

## Benchmarks
The below benchmarks were run using [hyperfine](https://github.com/sharkdp/hyperfine) on a Macbook M2 Max. You can run these benchmarks yourself by running `bench.sh` inside the `benchmark` workspace package linked to [here](https://github.com/calasanmarko/cloudfront-sign-webcrypto/blob/main/packages/benchmark/bench.sh).

### Node.js
Node has the most straightforward benchmark results. Using this package without parallel execution or key caching incurs a 2x improvement over [aws-cloudfront-sign](https://github.com/jasonsims/aws-cloudfront-sign), with further improvements incurred by parallelization and key caching.

| Sign Type                  | Parallel | Cache | Mean (ms) |
|----------------------------|----------|-------|-----------|
| aws-cloudfront-sign        | No       | No    | 240.9     |
| cloudfront-sign-webcrypto  | No       | No    | 142.6     |
| cloudfront-sign-webcrypto  | No       | Yes   | 93.1      |
| cloudfront-sign-webcrypto  | Yes      | No    | 84.9      |
| cloudfront-sign-webcrypto  | Yes      | Yes   | 51.7      |

### Bun
Bun's implementation of `node:crypto` is incredibly slow, which was actually the motivation for the creation of this package. Moving to WebCrypto incurs a massive performance improvement. Bun, however, appears not to enjoy the parallelization benefits visible in both Node and Deno.

| Sign Type                  | Parallel | Cache | Mean (ms) |
|----------------------------|----------|-------|-----------|
| aws-cloudfront-sign        | No       | No    | 2310.0    |
| cloudfront-sign-webcrypto  | No       | No    | 100.6     |
| cloudfront-sign-webcrypto  | No       | Yes   | 77.2      |
| cloudfront-sign-webcrypto  | Yes      | No    | 95.5      |
| cloudfront-sign-webcrypto  | Yes      | Yes   | 73.0      |

### Deno
Deno is similar to Node in regard to the difference between this package and [aws-cloudfront-sign](https://github.com/jasonsims/aws-cloudfront-sign), but in Deno's cae we don't see any significant improvement from key caching. Deno seems to be the best performer overall when using parallelization.

| Sign Type                  | Parallel | Cache | Mean (ms) |
|----------------------------|----------|-------|-----------|
| aws-cloudfront-sign        | No       | No    | 269.5     |
| cloudfront-sign-webcrypto  | No       | No    | 136.2     |
| cloudfront-sign-webcrypto  | No       | Yes   | 135.9     |
| cloudfront-sign-webcrypto  | Yes      | No    | 37.0      |
| cloudfront-sign-webcrypto  | Yes      | Yes   | 35.1      |

### Summary
```
deno ./src/run.js cloudfront-sign-webcrypto --parallel --cache ran
    1.05 ± 0.04 times faster than deno ./src/run.js cloudfront-sign-webcrypto --parallel
    1.47 ± 0.04 times faster than node ./src/run.js cloudfront-sign-webcrypto --parallel --cache
    2.08 ± 0.05 times faster than bun ./src/run.js cloudfront-sign-webcrypto --parallel --cache
    2.20 ± 0.05 times faster than bun ./src/run.js cloudfront-sign-webcrypto --cache
    2.42 ± 0.06 times faster than node ./src/run.js cloudfront-sign-webcrypto --parallel
    2.65 ± 0.06 times faster than node ./src/run.js cloudfront-sign-webcrypto --cache
    2.72 ± 0.07 times faster than bun ./src/run.js cloudfront-sign-webcrypto --parallel
    2.86 ± 0.07 times faster than bun ./src/run.js cloudfront-sign-webcrypto
    3.87 ± 0.14 times faster than deno ./src/run.js cloudfront-sign-webcrypto --cache
    3.88 ± 0.09 times faster than deno ./src/run.js cloudfront-sign-webcrypto
    4.06 ± 0.09 times faster than node ./src/run.js cloudfront-sign-webcrypto
    6.86 ± 0.16 times faster than node ./src/run.js aws-cloudfront-sign
    7.67 ± 0.17 times faster than deno ./src/run.js aws-cloudfront-sign
   65.74 ± 1.62 times faster than bun ./src/run.js aws-cloudfront-sign
```

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

## Author
Initially developed by Marko Calasan in 2024. Contributions are welcome. Licensed under the MIT License.
