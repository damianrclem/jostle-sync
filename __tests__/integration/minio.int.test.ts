import { describe, test, expect } from '@jest/globals';
import { CreateBucketCommand, GetObjectCommand, GetObjectCommandOutput, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { readableToString, getClient, putEncryptedObject, getEncryptedObject } from '../../src/helpers/s3';

/**
 * this is a somewhat strange test case.  i was just making sure we can connect to a local
 * minio acting like s3 for local development.  it serves as a place to look how to setup things
 * for now.
 */
describe('locally running minio', () => {
  test('should  work with aws sdk', async () => {
    const s3Client = getClient();

    const bucketName = Date.now().toString();

    await s3Client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
      }),
    );

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: 'asdf',
        Body: Buffer.from('asdf'),
        ContentType: 'application/text',
      }),
    );

    const response: GetObjectCommandOutput = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: 'asdf',
      }),
    );

    const bodyContents = await readableToString(response.Body as Readable);
    expect(bodyContents).toEqual('asdf');
  });

  test('it should encrypt and decrypt data', async () => {
    const s3Client = getClient();

    const bucketName = Date.now().toString();

    await s3Client.send(
      new CreateBucketCommand({
        Bucket: bucketName,
      }),
    );

    await putEncryptedObject(s3Client, {
      Bucket: bucketName,
      Key: 'asdf',
      Body: Buffer.from('asdf'),
      ContentType: 'application/text',
    });

    const encryptedResponse: GetObjectCommandOutput = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: 'asdf',
      }),
    );
    const encryptedBodyContents = await readableToString(encryptedResponse.Body as Readable);
    const decryptedResponse = await getEncryptedObject(s3Client, {
      Bucket: bucketName,
      Key: 'asdf',
    });

    const decryptedBodyContents = await readableToString(decryptedResponse.Body as Readable);

    // Ensures if we retrieve using getobject, the response is encrypted
    expect(encryptedBodyContents).not.toBe('asdf');
    // Ensures retrieving with getEncryptedObject returns decrypted object
    expect(decryptedBodyContents).toBe('asdf');
  }, 10000);
});
