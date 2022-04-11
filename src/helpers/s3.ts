import {
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { encryptData, decryptData } from 'typeorm-encrypted';
import { EnvironmentConfigurationError } from '../errors';

export async function readableToBuffer(stream: Readable): Promise<Buffer> {
  const chunks = [];
  /* eslint-disable-next-line no-restricted-syntax */
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function readableToString(stream: Readable): Promise<string> {
  const buffer = await readableToBuffer(stream);
  return buffer.toString('utf8');
}

export const bufferToReadable = (buffer: Buffer): Readable =>
  new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });

export function getClient(): S3Client {
  return new S3Client({
    endpoint: process.env.CREDIT_PLUS_S3_ENDPOINT,
    forcePathStyle: true,
  });
}

export async function putEncryptedObject(
  s3Client: S3Client,
  input: PutObjectCommandInput,
): Promise<PutObjectCommandOutput> {
  if (!process.env.ENCRYPTION_KEY) {
    throw new EnvironmentConfigurationError('Missing ENCRYPTION_KEY environment variable');
  }
  const body = encryptData(input.Body, {
    algorithm: 'aes-256-cbc',
    ivLength: 16,
    key: process.env.ENCRYPTION_KEY,
  }).toString('base64');
  return await s3Client.send(
    new PutObjectCommand({
      ...input,
      Body: body,
    }),
  );
}

export async function getEncryptedObject(
  s3Client: S3Client,
  input: GetObjectCommandInput,
): Promise<GetObjectCommandOutput> {
  if (!process.env.ENCRYPTION_KEY) {
    throw new EnvironmentConfigurationError('Missing ENCRYPTION_KEY environment variable');
  }
  const output = await s3Client.send(new GetObjectCommand(input));
  const body = await readableToString(output.Body);
  const decryptedData = decryptData(Buffer.from(body, 'base64'), {
    algorithm: 'aes-256-cbc',
    ivLength: 16,
    key: process.env.ENCRYPTION_KEY,
  });
  return {
    ...output,
    Body: bufferToReadable(decryptedData),
  };
}
