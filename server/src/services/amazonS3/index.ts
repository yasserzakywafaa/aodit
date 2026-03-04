import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import CONFIG from "../../config";
import type { Readable } from "stream";

// Create an S3 client
const s3Client = new S3Client({
  region: CONFIG.HOST_AWS_REGION ?? "eu-west-2",
  credentials: {
    accessKeyId: CONFIG.HOST_AWS_ACCESS_KEY ?? "",
    secretAccessKey: CONFIG.HOST_AWS_SECRET_KEY ?? "",
  },
});

const getBucket = (): string => CONFIG.HOST_AWS_S3_BUCKET_NAME as string;

const getKeyPrefix = (): string => {
  const prefix = CONFIG.IS_DEV
    ? (CONFIG.HOST_AWS_S3_KEY_PREFIX_DEV as string)
    : (CONFIG.HOST_AWS_S3_KEY_PREFIX_PROD as string);
  return prefix.endsWith("/") ? prefix : `${prefix}/`;
};

const uploadFileToS3 = async (
  fileName: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> => {
  try {
    const bucket = getBucket();
    const keyPrefix = getKeyPrefix();
    const fullKey = keyPrefix + fileName;
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: fullKey,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(putObjectCommand);

    return `https://${bucket}.s3.${CONFIG.HOST_AWS_REGION}.amazonaws.com/${fullKey}`;
  } catch (error) {
    throw new Error("❌ Failed to upload file to AmazonS3!", {
      cause: error,
    });
  }
};

const listObjectKeys = async (prefix: string): Promise<string[]> => {
  const bucket = getBucket();
  const keyPrefix = getKeyPrefix();
  const fullPrefix = keyPrefix + prefix;
  const keys: string[] = [];
  let continuationToken: string | undefined;
  do {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: fullPrefix,
      ContinuationToken: continuationToken,
    });
    const response = await s3Client.send(command);
    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key && obj.Key.startsWith(keyPrefix)) {
          keys.push(obj.Key.slice(keyPrefix.length));
        }
      }
    }
    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken);
  return keys;
};

const deleteObject = async (key: string): Promise<void> => {
  try {
    const bucket = getBucket();
    const fullKey = getKeyPrefix() + key;
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: fullKey,
      }),
    );
  } catch (error) {
    throw new Error(`❌ Failed to delete object ${key} from S3`, {
      cause: error,
    });
  }
};

/**
 * Get a readable stream for an S3 object by key (relative to key prefix).
 * Useful to download files from S3.
 */
const getObjectStream = async (
  key: string,
): Promise<{ body: Readable; contentType?: string }> => {
  const bucket = getBucket();
  const fullKey = getKeyPrefix() + key;
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: fullKey,
    }),
  );
  if (!response.Body) {
    throw new Error(`❌ No body returned for S3 object: ${key}`);
  }
  return {
    body: response.Body as Readable,
    contentType: response.ContentType ?? undefined,
  };
};

export {
  deleteObject,
  getBucket,
  getObjectStream,
  listObjectKeys,
  uploadFileToS3,
};
