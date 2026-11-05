import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const getBackblazeConfig = () => {
  const bucket = localStorage.getItem('lpu_b2_bucket') || import.meta.env.VITE_B2_BUCKET || '';
  const endpoint = localStorage.getItem('lpu_b2_endpoint') || import.meta.env.VITE_B2_ENDPOINT || '';
  const keyId = localStorage.getItem('lpu_b2_key_id') || import.meta.env.VITE_B2_KEY_ID || '';
  const appKey = localStorage.getItem('lpu_b2_app_key') || import.meta.env.VITE_B2_APP_KEY || '';
  const region = localStorage.getItem('lpu_b2_region') || import.meta.env.VITE_B2_REGION || 'us-west-004';
  const publicUrlPrefix = localStorage.getItem('lpu_b2_public_url') || import.meta.env.VITE_B2_PUBLIC_URL || '';

  const isConfigured = Boolean(bucket && endpoint && keyId && appKey);
  return { bucket, endpoint, keyId, appKey, region, publicUrlPrefix, isConfigured };
};

export const uploadPdfToBackblaze = async (file, fileName) => {
  const config = getBackblazeConfig();

  if (!config.isConfigured) {
    // Local / Offline fallback mode: create an Object URL or simulated cloud URL
    const localUrl = URL.createObjectURL(file);
    return {
      success: true,
      url: localUrl,
      source: 'local_fallback',
      message: 'Uploaded in local preview mode (configure Backblaze B2 in Settings for real cloud storage).'
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

    // Construct public or B2 download URL
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
    // If CORS or auth fails in browser, provide helpful details & fall back to local URL
    const fallbackUrl = URL.createObjectURL(file);
    return {
      success: true, // Still allow the note to be created in the UI
      url: fallbackUrl,
      source: 'local_fallback_on_error',
      message: `Backblaze upload warning: ${error.message || 'CORS restriction'}. Note saved locally.`
    };
  }
};
