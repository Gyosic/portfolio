import crypto from "crypto";

export function hmacEncrypt(
  data: string,
  salt: string,
  algorithm: string = "sha512",
  digest: crypto.BinaryToTextEncoding = "base64",
) {
  return crypto.createHmac(algorithm, salt).update(data).digest(digest);
}

export function generateSalt(length = 64) {
  return crypto.randomBytes(length).toString("base64");
}
