/**
 * OneDrive backup client using app-only (client credentials) auth.
 * Uploads files to hassan@skillwill.ae's OneDrive via Microsoft Graph API.
 *
 * Required env vars:
 *   ONEDRIVE_CLIENT_ID     — Azure app registration client ID
 *   ONEDRIVE_TENANT_ID     — Azure AD tenant ID
 *   ONEDRIVE_CLIENT_SECRET — Azure app registration client secret
 */

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0'
const ONEDRIVE_USER = 'hassan@skillwill.ae'

let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value
  }

  const tenantId = process.env.ONEDRIVE_TENANT_ID
  const clientId = process.env.ONEDRIVE_CLIENT_ID
  const clientSecret = process.env.ONEDRIVE_CLIENT_SECRET

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Missing OneDrive env vars: ONEDRIVE_TENANT_ID, ONEDRIVE_CLIENT_ID, ONEDRIVE_CLIENT_SECRET')
  }

  const res = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'https://graph.microsoft.com/.default',
      }),
    }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`OneDrive token request failed (${res.status}): ${body}`)
  }

  const json = await res.json() as { access_token: string; expires_in: number }
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  }
  return cachedToken.value
}

/**
 * Creates a folder and all intermediate parent folders if they don't exist.
 * Silently continues if any folder already exists (409 conflict).
 */
export async function ensureFolderExists(folderPath: string): Promise<void> {
  const token = await getAccessToken()
  const segments = folderPath.split('/').filter(Boolean)

  for (let i = 0; i < segments.length; i++) {
    const currentPath = segments.slice(0, i + 1).join('/')
    const parentPath  = segments.slice(0, i).join('/')

    // Check if this level already exists
    const checkRes = await fetch(
      `${GRAPH_BASE}/users/${ONEDRIVE_USER}/drive/root:/${currentPath}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (checkRes.ok) continue // Already exists — move to next segment

    // Create the folder under its parent
    const parentEndpoint = parentPath
      ? `${GRAPH_BASE}/users/${ONEDRIVE_USER}/drive/root:/${parentPath}:/children`
      : `${GRAPH_BASE}/users/${ONEDRIVE_USER}/drive/root/children`

    const createRes = await fetch(parentEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: segments[i],
        folder: {},
        '@microsoft.graph.conflictBehavior': 'fail',
      }),
    })

    // 409 = already exists (race condition) — safe to ignore
    if (!createRes.ok && createRes.status !== 409) {
      const body = await createRes.text()
      throw new Error(`Failed to create folder "${currentPath}" (${createRes.status}): ${body}`)
    }
  }
}

/**
 * Uploads a file buffer to OneDrive at the given path using an upload session.
 * Handles any file size. Creates intermediate folders automatically via
 * ensureFolderExists before uploading.
 *
 * @param fileBuffer   Raw file contents
 * @param onedrivePath Full path inside OneDrive, e.g. "PHA IGCSE Backups/Storage/file.pdf"
 * @param mimeType     MIME type of the file, e.g. "application/pdf"
 */
export async function uploadToOneDrive(
  fileBuffer: Buffer,
  onedrivePath: string,
  mimeType: string
): Promise<void> {
  const token = await getAccessToken()

  // Ensure the parent folder exists before uploading
  const parts = onedrivePath.split('/')
  if (parts.length > 1) {
    await ensureFolderExists(parts.slice(0, -1).join('/'))
  }

  // Create an upload session (works for any file size)
  const sessionRes = await fetch(
    `${GRAPH_BASE}/users/${ONEDRIVE_USER}/drive/root:/${onedrivePath}:/createUploadSession`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item: {
          '@microsoft.graph.conflictBehavior': 'replace',
          name: parts[parts.length - 1],
        },
      }),
    }
  )

  if (!sessionRes.ok) {
    const body = await sessionRes.text()
    throw new Error(`Failed to create upload session for "${onedrivePath}" (${sessionRes.status}): ${body}`)
  }

  const { uploadUrl } = await sessionRes.json() as { uploadUrl: string }
  const totalSize = fileBuffer.length

  // Upload in chunks of 4 MB (must be a multiple of 320 KiB)
  const CHUNK_SIZE = 4 * 1024 * 1024 // 4 MB
  let offset = 0

  while (offset < totalSize) {
    const end   = Math.min(offset + CHUNK_SIZE, totalSize)
    const chunk = fileBuffer.subarray(offset, end)

    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Length': String(chunk.length),
        'Content-Range': `bytes ${offset}-${end - 1}/${totalSize}`,
        'Content-Type': mimeType,
      },
      body: chunk,
    })

    // 200/201 = complete, 202 = accepted (more chunks expected)
    if (!uploadRes.ok && uploadRes.status !== 202) {
      const body = await uploadRes.text()
      throw new Error(`Upload chunk failed for "${onedrivePath}" at offset ${offset} (${uploadRes.status}): ${body}`)
    }

    offset = end
  }
}
