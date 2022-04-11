import { CreateBucketCommand } from '@aws-sdk/client-s3';
import { getClient } from '../../../src/helpers/s3';

export const setupBucket = async (): Promise<void> => {
  // Create bucket to add our test UDN (pdf)
  try {
    const s3Client = getClient();
    await s3Client.send(
      new CreateBucketCommand({
        Bucket: process.env.CREDIT_PLUS_S3_BUCKET,
      }),
    );
  } catch (err) {
    console.log('Could not create bucket… it most likely already exists');
  }
};
