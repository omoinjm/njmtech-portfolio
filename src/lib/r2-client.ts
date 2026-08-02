import { S3Client } from "@aws-sdk/client-s3";
import { config } from "@/lib/config";

const DEFAULT_BUCKET = "njmtech-blob";
const DEFAULT_INVOICE_PREFIX = "njmtech-portfolio/invoices";

export function getR2AccountId(): string | undefined {
  return config.get("R2_ACCOUNT_ID") || config.get("D1_ACCOUNT_ID");
}

export function getR2BucketName(): string {
  return config.get("R2_BUCKET_NAME") || DEFAULT_BUCKET;
}

export function getInvoiceStoragePrefix(): string {
  const prefix =
    config.get("INVOICE_STORAGE_PREFIX") || DEFAULT_INVOICE_PREFIX;
  return prefix.replace(/^\/+|\/+$/g, "");
}

export function isR2Configured(): boolean {
  const accountId = getR2AccountId();
  const accessKeyId = config.get("R2_ACCESS_KEY_ID");
  const secretAccessKey = config.get("R2_SECRET_ACCESS_KEY");
  return Boolean(accountId && accessKeyId && secretAccessKey);
}

let cachedClient: S3Client | null = null;

export function getR2Client(): S3Client {
  if (cachedClient) return cachedClient;

  const accountId = getR2AccountId();
  const accessKeyId = config.get("R2_ACCESS_KEY_ID");
  const secretAccessKey = config.get("R2_SECRET_ACCESS_KEY");

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 is not configured. Set R2_ACCOUNT_ID (or D1_ACCOUNT_ID), R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY.",
    );
  }

  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return cachedClient;
}

export function invoiceObjectKey(id: string): string {
  return `${getInvoiceStoragePrefix()}/${id}.json`;
}
