import { readFileSync, writeFileSync } from 'node:fs';
import { ApkSigner, SigningKey } from 'apk_sign_ts';
const [,,inp,out]=process.argv;
const s=new ApkSigner({signingKey:SigningKey.fromPEM(readFileSync(process.env.SP_KEY||'keys/key.pem','utf8'),readFileSync(process.env.SP_CERT||'keys/cert.pem','utf8')),digestAlgorithm:'SHA-256'});
const {signedApk}=await s.sign(new Uint8Array(readFileSync(inp)));
writeFileSync(out,signedApk); console.log('signed',signedApk.length);
