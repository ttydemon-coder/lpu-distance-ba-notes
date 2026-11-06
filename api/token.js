let cachedToken = null;
let tokenExpiresAt = 0;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const now = Date.now();
    if (cachedToken && tokenExpiresAt > now + 60000) {
      return res.status(200).json({ token: cachedToken, expiresAt: tokenExpiresAt });
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
        validDurationInSeconds: 604800
      })
    });
    if (!tokenRes.ok) {
      throw new Error(`B2 token failed: ${tokenRes.statusText}`);
    }
    const tokenData = await tokenRes.json();
    cachedToken = tokenData.authorizationToken;
    tokenExpiresAt = now + (600000 * 1000);

    return res.status(200).json({
      token: cachedToken,
      downloadUrl: authData.apiInfo.storageApi.downloadUrl,
      expiresAt: tokenExpiresAt
    });
  } catch (error) {
    console.error('API /token error:', error);
    return res.status(500).json({ error: error.message });
  }
}
