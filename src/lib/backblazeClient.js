import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const getBackblazeConfig = () => {
  const bucket = localStorage.getItem('lpu_b2_bucket') || import.meta.env.VITE_B2_BUCKET || 'Pdfstorage1';
  const endpoint = localStorage.getItem('lpu_b2_endpoint') || import.meta.env.VITE_B2_ENDPOINT || 's3.eu-central-003.backblazeb2.com';
  const keyId = localStorage.getItem('lpu_b2_key_id') || import.meta.env.VITE_B2_KEY_ID || '00346a105e9413f0000000001';
  const appKey = localStorage.getItem('lpu_b2_app_key') || import.meta.env.VITE_B2_APP_KEY || 'K0039HvzOmhmjywlucI88zGdiFt4vRI';
  const region = localStorage.getItem('lpu_b2_region') || import.meta.env.VITE_B2_REGION || 'eu-central-003';
  const publicUrlPrefix = localStorage.getItem('lpu_b2_public_url') || import.meta.env.VITE_B2_PUBLIC_URL || 'https://f003.backblazeb2.com/file/Pdfstorage1';

  const isConfigured = Boolean(bucket && endpoint && keyId && appKey);
  return { bucket, endpoint, keyId, appKey, region, publicUrlPrefix, isConfigured };
};

export const initDownloadToken = async () => {
  try {
    const cachedToken = localStorage.getItem('lpu_b2_download_token');
    const tokenExpires = Number(localStorage.getItem('lpu_b2_token_expires') || '0');
    
    // Reuse token if valid for at least 2 more hours
    if (cachedToken && tokenExpires > Date.now() + (2 * 3600 * 1000)) {
      return cachedToken;
    }

    const res = await fetch('/api/token');
    if (!res.ok) return null;
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('lpu_b2_download_token', data.token);
      localStorage.setItem('lpu_b2_token_expires', String(data.expiresAt || (Date.now() + 6 * 24 * 3600 * 1000)));
      return data.token;
    }
  } catch (err) {
    console.warn('Could not refresh download authorization token:', err);
  }
  return null;
};

export const getAuthorizedPdfUrl = (rawUrl) => {
  if (!rawUrl) return '';
  if (rawUrl.includes('Authorization=')) return rawUrl;
  
  if (rawUrl.includes('backblazeb2.com')) {
    const cachedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('lpu_b2_download_token') : null;
    const tokenExpires = Number((typeof localStorage !== 'undefined' ? localStorage.getItem('lpu_b2_token_expires') : null) || '0');
    
    if (cachedToken && tokenExpires > Date.now()) {
      const sep = rawUrl.includes('?') ? '&' : '?';
      return `${rawUrl}${sep}Authorization=${cachedToken}`;
    }
    
    // Fallback through serverless gateway which attaches the active token
    return `/api/pdf?url=${encodeURIComponent(rawUrl)}`;
  }
  return rawUrl;
};

export const uploadPdfToBackblaze = async (file, fileName) => {
  const config = getBackblazeConfig();

  if (!config.isConfigured) {
    const localUrl = URL.createObjectURL(file);
    return {
      success: true,
      url: localUrl,
      source: 'local_fallback',
      message: 'Uploaded in local preview mode.'
    };
  }

  try {
    const sanitizedFileName = `notes/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const s3 = new S3Client({
      endpoint: config.endpoint.startsWith('http') ? config.endpoint : `https://${config.endpoint}`,
      region: config.region,
      credentials: {
        accessKeyId: config.keyId,
        secretAccessKey: config.appKey,
      },
    });

    const fileBuffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: config.bucket,
      Key: sanitizedFileName,
      Body: new Uint8Array(fileBuffer),
      ContentType: file.type || 'application/pdf',
    });

    await s3.send(command);

    const publicBase = config.publicUrlPrefix || `https://${config.bucket}.${config.endpoint}`;
    const fileUrl = `${publicBase}/${sanitizedFileName}`;

    return {
      success: true,
      url: fileUrl,
      source: 'backblaze_b2',
      message: 'Successfully uploaded to Backblaze B2!'
    };
  } catch (error) {
    console.error("Backblaze upload error:", error);
    const fallbackUrl = URL.createObjectURL(file);
    return {
      success: true,
      url: fallbackUrl,
      source: 'local_fallback_on_error',
      message: `Backblaze upload warning: ${error.message || 'CORS restriction'}. Note saved locally.`
    };
  }
};
