let cachedToken = null;
let tokenExpiresAt = 0;

async function getB2DownloadToken() {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60000) {
    return cachedToken;
  }
  
  const keyId = process.env.VITE_B2_KEY_ID || process.env.B2_KEY_ID || '00346a105e9413f0000000001';
  const appKey = process.env.VITE_B2_APP_KEY || process.env.B2_APP_KEY || 'K0039HvzOmhmjywlucI88zGdiFt4vRI';
  const credentials = Buffer.from(`${keyId}:${appKey}`).toString('base64');
  
  const authRes = await fetch('https://api.backblazeb2.com/b2api/v3/b2_authorize_account', {
    headers: { 'Authorization': `Basic ${credentials}` }
  });
  if (!authRes.ok) {
    throw new Error(`B2 authorize failed: ${authRes.statusText}`);
  }
  const authData = await authRes.json();
  const bucketId = authData.apiInfo.storageApi.bucketId;
  const apiUrl = authData.apiInfo.storageApi.apiUrl;

  const tokenRes = await fetch(`${apiUrl}/b2api/v3/b2_get_download_authorization`, {
    method: 'POST',
    headers: {
      'Authorization': authData.authorizationToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      bucketId: bucketId,
      fileNamePrefix: '',
      validDurationInSeconds: 604800 // 7 days (maximum allowed)
    })
  });
  if (!tokenRes.ok) {
    throw new Error(`B2 token failed: ${tokenRes.statusText}`);
  }
  const tokenData = await tokenRes.json();
  cachedToken = tokenData.authorizationToken;
  tokenExpiresAt = now + (600000 * 1000); // cache for ~6 days
  return cachedToken;
}

export default async function handler(req, res) {
  try {
    const { url, file } = req.query;
    let targetUrl = url;
    if (!targetUrl && file) {
      targetUrl = `https://f003.backblazeb2.com/file/Pdfstorage1/${file}`;
    }
    if (!targetUrl) {
      return res.status(400).json({ error: 'Missing url or file parameter' });
    }

    // Attach authorization token if it is a Backblaze URL
    if (targetUrl.includes('backblazeb2.com')) {
      const token = await getB2DownloadToken();
      const separator = targetUrl.includes('?') ? '&' : '?';
      targetUrl = `${targetUrl}${separator}Authorization=${token}`;
    }

    // Redirect directly to the authorized file
    res.writeHead(302, {
      Location: targetUrl,
      'Cache-Control': 'public, max-age=86400'
    });
    res.end();
  } catch (error) {
    console.error('API /pdf error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
