import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

const B2_ENDPOINT = 'https://s3.eu-central-003.backblazeb2.com';
const B2_REGION = 'eu-central-003';
const B2_KEY_ID = '00346a105e9413f0000000001';
const B2_APP_KEY = 'K0039HvzOmhmjywlucI88zGdiFt4vRI';
const B2_BUCKET = 'Pdfstorage1';
const B2_PUBLIC_BASE = 'https://f003.backblazeb2.com/file/Pdfstorage1';

const SUPABASE_URL = 'https://kyefqtuewqqltoygbsxx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YQepSRrgNcUdMAznV6_VRg_dDGVgROH';

const s3 = new S3Client({
  endpoint: B2_ENDPOINT,
  region: B2_REGION,
  credentials: {
    accessKeyId: B2_KEY_ID,
    secretAccessKey: B2_APP_KEY,
  },
});

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const FILE_PATH = '/storage/emulated/0/LPU/6th sem/DMGT208 book.pdf';

async function main() {
  if (!fs.existsSync(FILE_PATH)) {
    console.error(`File not found: ${FILE_PATH}`);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(FILE_PATH);
  const sizeMb = (fileBuffer.length / (1024 * 1024)).toFixed(1) + ' MB';
  console.log(`Read ${FILE_PATH} (${sizeMb})`);

  const s3Key = `lpu-books/sem6/${Date.now()}_DMGT208_book.pdf`;
  console.log(`Uploading to B2: ${s3Key}...`);

  const putCmd = new PutObjectCommand({
    Bucket: B2_BUCKET,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: 'application/pdf',
  });

  await s3.send(putCmd);
  const pdfUrl = `${B2_PUBLIC_BASE}/${s3Key}`;
  console.log(`Uploaded successfully! PDF URL: ${pdfUrl}`);

  // Fetch placeholder in Supabase
  const { data: placeholder, error: pErr } = await supabase
    .from('notes')
    .select('*')
    .eq('id', 'e61ddb08-104b-490a-9952-7591e8fd0d00')
    .single();

  if (pErr) {
    console.error('Error fetching placeholder:', pErr);
  } else {
    console.log('Found placeholder:', placeholder.title);
  }

  const updateData = {
    title: 'DMGT208: Strategic Management & Business Policy Official SLM Book PDF',
    subject: 'Management',
    subject_code: 'DMGT208',
    semester: 6,
    category: 'Book PDFs',
    unit: 'Complete SLM Book',
    author: 'LPU Distance Education (SLM)',
    pages: 180,
    file_size: sizeMb,
    description: 'Complete university Self-Learning Material (SLM) textbook covering all units of Strategic Management & Business Policy.',
    pdf_url: pdfUrl,
    tags: ['Management', 'DMGT208', 'Sem-6', 'Book PDFs', 'SLM'],
    is_verified: true
  };

  const { error: uErr } = await supabase
    .from('notes')
    .update(updateData)
    .eq('id', 'e61ddb08-104b-490a-9952-7591e8fd0d00');

  if (uErr) {
    console.error('Error updating placeholder:', uErr);
    process.exit(1);
  }

  console.log('Successfully updated Supabase note record e61ddb08-104b-490a-9952-7591e8fd0d00!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
