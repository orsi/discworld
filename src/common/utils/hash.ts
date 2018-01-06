import * as crypto from 'crypto';

export function sha256 (message: string) {
    const hash = crypto.createHash('sha256');
    hash.update(message);
    let digest = hash.digest('hex');
    return digest;
}