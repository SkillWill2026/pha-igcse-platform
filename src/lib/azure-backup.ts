/**
 * Azure Blob Storage backup client.
 * Uploads files to the 'phaigscestore' storage account.
 *
 * Required env var:
 *   AZURE_STORAGE_CONNECTION_STRING — connection string from Azure portal
 *
 * Container names used:
 *   pha-backups-pdfs      — PDF upload batches
 *   pha-backups-images    — question images
 *   pha-backups-databank  — databank documents
 *   pha-backups-db        — database JSON snapshots
 */

import { BlobServiceClient } from '@azure/storage-blob'

function getBlobServiceClient(): BlobServiceClient {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connectionString) {
    throw new Error('Missing AZURE_STORAGE_CONNECTION_STRING env var')
  }
  return BlobServiceClient.fromConnectionString(connectionString)
}

/**
 * Creates the container if it does not already exist.
 * Safe to call repeatedly — no-ops if the container is already present.
 */
export async function ensureContainerExists(containerName: string): Promise<void> {
  const client = getBlobServiceClient()
  const containerClient = client.getContainerClient(containerName)
  await containerClient.createIfNotExists()
}

/**
 * Uploads a Buffer to Azure Blob Storage.
 *
 * @param buffer        File contents
 * @param blobPath      Path within the container, e.g. "batch-123/file.pdf"
 * @param mimeType      Content-Type, e.g. "application/pdf"
 * @param containerName Target container, e.g. "pha-backups-pdfs"
 */
export async function uploadToAzure(
  buffer: Buffer,
  blobPath: string,
  mimeType: string,
  containerName: string
): Promise<void> {
  const client = getBlobServiceClient()
  const containerClient = client.getContainerClient(containerName)

  // Create container if it doesn't exist yet
  await containerClient.createIfNotExists()

  const blockBlobClient = containerClient.getBlockBlobClient(blobPath)
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: mimeType },
  })
}
