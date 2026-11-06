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

const PENDING_DIR = '/storage/emulated/0/LPU/pending books';

const BOOKS_META = [
  // Semester 1
  {
    file: 'DENG103 book.pdf',
    semester: 1,
    subject: 'English',
    subjectCode: 'DENG103',
    title: 'DENG103: Basic English Literature Official SLM Book',
    description: 'Official university Self-Learning Material (SLM) textbook for DENG103 covering all units.',
    tags: ['English', 'DENG103', 'Sem-1', 'Book PDFs', 'SLM']
  },
  {
    file: 'DENG104 book.pdf',
    semester: 1,
    subject: 'English',
    subjectCode: 'DENG104',
    title: 'DENG104: English Communication & Language Official SLM Book',
    description: 'Official university Self-Learning Material (SLM) textbook for DENG104 communication skills.',
    tags: ['English', 'DENG104', 'Sem-1', 'Book PDFs', 'SLM']
  },
  {
    file: 'DMGT101 book.pdf',
    semester: 1,
    subject: 'Management',
    subjectCode: 'DMGT101',
    title: 'DMGT101: Principles of Management Official University Book PDF',
    description: 'Complete university Self-Learning Material (SLM) textbook covering all units of Principles of Management.',
    tags: ['Management', 'DMGT101', 'Sem-1', 'Book PDFs', 'SLM']
  },
  {
    file: 'DPBI101 book.pdf',
    semester: 1,
    subject: 'Punjabi',
    subjectCode: 'DPBI101',
    title: 'DPBI101: Punjabi Sahitya - I Official University Book PDF',
    description: 'Official university Self-Learning Material (SLM) textbook for Punjabi Sahitya (Compulsory Punjabi).',
    tags: ['Punjabi', 'DPBI101', 'Sem-1', 'Book PDFs', 'SLM']
  },

  // Semester 2
  {
    file: 'DENG105 book.pdf',
    semester: 2,
    subject: 'English',
    subjectCode: 'DENG105',
    title: 'DENG105: English Communication Skills Official University Book PDF',
    description: 'Official university Self-Learning Material (SLM) textbook for DENG105 Communication Skills.',
    tags: ['English', 'DENG105', 'Sem-2', 'Book PDFs', 'SLM']
  },
  {
    file: 'DENG201 book.pdf',
    semester: 2,
    subject: 'English',
    subjectCode: 'DENG201',
    title: 'DENG201: General English - II Official University Book PDF',
    description: 'Official university SLM book for DENG201 General English covering grammar, prose, and compositions.',
    tags: ['English', 'DENG201', 'Sem-2', 'Book PDFs', 'SLM']
  },
  {
    file: 'DMGT204 book.pdf',
    semester: 2,
    subject: 'Management',
    subjectCode: 'DMGT204',
    title: 'DMGT204: Human Resource & Marketing Management Official Book PDF',
    description: 'Complete university textbook covering HRM concepts, recruitment, training, and marketing principles.',
    tags: ['Management', 'DMGT204', 'Sem-2', 'Book PDFs', 'SLM']
  },
  {
    file: 'DSOC102 book.pdf',
    semester: 2,
    subject: 'Social Science',
    subjectCode: 'DSOC102',
    title: 'DSOC102: Society in India (English Medium) Official Book PDF',
    description: 'Official university SLM textbook in English medium covering Indian society concepts and institutions.',
    tags: ['Social Science', 'Sociology', 'DSOC102', 'Sem-2', 'Book PDFs', 'SLM']
  },
  {
    file: 'DSOC102 Punjabi medium Book.pdf',
    semester: 2,
    subject: 'Social Science',
    subjectCode: 'DSOC102',
    title: 'DSOC102: Society in India (Punjabi Medium) Official Book PDF',
    description: 'Official university SLM textbook translated into Punjabi medium covering all syllabus units.',
    tags: ['Social Science', 'Sociology', 'DSOC102', 'Sem-2', 'Book PDFs', 'Punjabi-Medium']
  },

  // Semester 3
  {
    file: 'DENG202 book.pdf',
    semester: 3,
    subject: 'English',
    subjectCode: 'DENG202',
    title: 'DENG202: Elective English (Poetry & Drama) Official SLM Book PDF',
    description: 'Official university textbook covering Classical Poetry, Shakespearean drama, and literary criticism.',
    tags: ['English', 'DENG202', 'Sem-3', 'Book PDFs', 'SLM']
  },
  {
    file: 'DMGT203 book.pdf',
    semester: 3,
    subject: 'Management',
    subjectCode: 'DMGT203',
    title: 'DMGT203: Management Principles & OB Official Book PDF',
    description: 'Complete university Self-Learning Material book covering Organizational Behavior and Leadership.',
    tags: ['Management', 'DMGT203', 'Sem-3', 'Book PDFs', 'SLM']
  },

  // Semester 4
  {
    file: 'DENG203 book.pdf',
    semester: 4,
    subject: 'English',
    subjectCode: 'DENG203',
    title: 'DENG203: English Fiction & Prose Official SLM Book PDF',
    description: 'Official university Self-Learning Material book covering modern novels, short stories, and prose essays.',
    tags: ['English', 'DENG203', 'Sem-4', 'Book PDFs', 'SLM']
  },
  {
    file: 'DMGT207 book.pdf',
    semester: 4,
    subject: 'Management',
    subjectCode: 'DMGT207',
    title: 'DMGT207: Financial & Cost Management Official University Book PDF',
    description: 'Complete university textbook covering Financial Accounting, Cost Sheets, Budgeting, and Working Capital.',
    tags: ['Management', 'DMGT207', 'Sem-4', 'Book PDFs', 'SLM']
  },
  {
    file: 'DPBI201 book.pdf',
    semester: 4,
    subject: 'Punjabi',
    subjectCode: 'DPBI201',
    title: 'DPBI201: Modern Punjabi Literature Official University Book PDF',
    description: 'Official university SLM textbook covering 20th-century Punjabi poetry, plays, and critical essays.',
    tags: ['Punjabi', 'DPBI201', 'Sem-4', 'Book PDFs', 'SLM']
  },

  // Semester 5
  {
    file: 'DMGT206 book.pdf',
    semester: 5,
    subject: 'Management',
    subjectCode: 'DMGT206',
    title: 'DMGT206: Production and Operations Management Official SLM Book PDF',
    description: 'Comprehensive university textbook covering plant layout, inventory control, and supply chain management.',
    tags: ['Management', 'DMGT206', 'Sem-5', 'Book PDFs', 'SLM']
  }
];

async function run() {
  console.log('Starting upload of 15 pending books...');
  
  // Fetch existing notes from Supabase
  const { data: existingNotes, error: fetchErr } = await supabase.from('notes').select('*');
  if (fetchErr) {
    console.error('Failed to fetch existing notes:', fetchErr);
    return;
  }
  console.log(`Fetched ${existingNotes.length} existing records from Supabase.`);

  let uploadedCount = 0;
  let replacedCount = 0;
  let insertedCount = 0;

  for (const item of BOOKS_META) {
    const fullPath = path.join(PENDING_DIR, item.file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const sizeMb = (fileBuffer.length / (1024 * 1024)).toFixed(1) + ' MB';
    
    // Construct clean B2 key
    const sanitizedName = item.file.replace(/[^a-zA-Z0-9.-]/g, '_');
    const s3Key = `lpu-books/sem${item.semester}/${Date.now()}_${sanitizedName}`;

    console.log(`Uploading ${item.file} (${sizeMb}) to B2: ${s3Key}...`);
    const putCmd = new PutObjectCommand({
      Bucket: B2_BUCKET,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: 'application/pdf',
    });

    await s3.send(putCmd);
    const pdfUrl = `${B2_PUBLIC_BASE}/${s3Key}`;
    uploadedCount++;

    // Check if there is an existing missing placeholder in Supabase
    const placeholder = existingNotes.find(n => 
      n.semester === item.semester &&
      n.subject_code === item.subjectCode &&
      n.category === 'Book PDFs' &&
      (n.file_size === 'Missing' || n.title?.includes('[MISSING]') || !n.pdf_url)
    );

    if (placeholder) {
      console.log(`-> Updating existing placeholder ${placeholder.id} (${placeholder.title})`);
      const { error: updateErr } = await supabase.from('notes').update({
        title: item.title,
        subject: item.subject,
        subject_code: item.subjectCode,
        semester: item.semester,
        category: 'Book PDFs',
        unit: 'Complete SLM Book',
        author: 'LPU Distance Education (SLM)',
        pages: 150,
        file_size: sizeMb,
        description: item.description,
        pdf_url: pdfUrl,
        tags: item.tags,
        is_verified: true
      }).eq('id', placeholder.id);

      if (updateErr) {
        console.error('Update error:', updateErr);
      } else {
        replacedCount++;
      }
    } else {
      console.log(`-> Inserting new note record for ${item.title}`);
      const { error: insertErr } = await supabase.from('notes').insert([{
        title: item.title,
        subject: item.subject,
        subject_code: item.subjectCode,
        semester: item.semester,
        category: 'Book PDFs',
        unit: 'Complete SLM Book',
        author: 'LPU Distance Education (SLM)',
        pages: 150,
        file_size: sizeMb,
        download_count: 0,
        description: item.description,
        pdf_url: pdfUrl,
        tags: item.tags,
        is_verified: true
      }]);

      if (insertErr) {
        console.error('Insert error:', insertErr);
      } else {
        insertedCount++;
      }
    }
  }

  // Update Sem 5 and 6 non-management placeholders to note physical purchase
  console.log('Updating Sem 5 & 6 non-management missing placeholders with physical purchase notice...');
  const sem5and6Purchases = [
    { code: 'DENG302', sem: 5, note: '⚠️ Physical textbook only. LPU does not provide digital SLM for this course; textbook must be purchased directly from the university.' },
    { code: 'DPBI301', sem: 6, note: '⚠️ Physical textbook only. Must be purchased from the LPU university bookstore (digital SLM not issued by university).' },
    { code: 'DENG303', sem: 6, note: '⚠️ Physical textbook only. Must be purchased from the LPU university bookstore (digital SLM not issued by university).' },
    { code: 'DSOC302', sem: 6, note: '⚠️ Physical textbook only. Must be purchased from the LPU university bookstore (digital SLM not issued by university).' }
  ];

  for (const p of sem5and6Purchases) {
    await supabase.from('notes').update({
      description: p.note
    }).eq('semester', p.sem).eq('subject_code', p.code).eq('category', 'Book PDFs');
  }

  console.log('====================================');
  console.log(`Finished processing:`);
  console.log(`- Uploaded to Backblaze: ${uploadedCount}`);
  console.log(`- Replaced missing placeholders: ${replacedCount}`);
  console.log(`- Inserted new notes: ${insertedCount}`);
  console.log('====================================');
}

run();
