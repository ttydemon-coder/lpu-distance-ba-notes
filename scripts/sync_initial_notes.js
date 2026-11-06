import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient('https://kyefqtuewqqltoygbsxx.supabase.co', 'sb_publishable_YQepSRrgNcUdMAznV6_VRg_dDGVgROH');

async function run() {
  const { data, error } = await supabase.from('notes').select('*').order('semester').order('created_at', { ascending: false });
  if (error) {
    console.error(error);
    return;
  }
  const valid = data.filter(item => !item.title?.includes('[DEPRECATED]') && !item.pdf_url?.includes('dummy.pdf'));
  console.log('Valid count:', valid.length);
  const cleanData = valid.map(item => {
    const isMissing = Boolean(
      item.file_size === 'Missing' || 
      item.title?.startsWith('[MISSING]') || 
      !item.pdf_url || 
      item.is_verified === false
    );
    return {
      id: item.id,
      title: item.title,
      subject: item.subject,
      subjectCode: item.subject_code,
      semester: item.semester,
      category: item.category,
      unit: item.unit || 'All Units',
      author: item.author || 'LPU Contributor',
      pages: item.pages || 0,
      fileSize: item.file_size || (isMissing ? 'Missing' : '1.5 MB'),
      downloadCount: item.download_count || 0,
      date: item.created_at ? item.created_at.split('T')[0] : '2024-05-01',
      description: item.description || '',
      pdfUrl: item.pdf_url || '',
      tags: item.tags || [],
      isVerified: item.is_verified ?? !isMissing,
      isMissing
    };
  });
  
  const content = `export const INITIAL_NOTES = ${JSON.stringify(cleanData, null, 2)};

export const SUBJECTS_LIST = [
  "All Subjects",
  "English Literature",
  "Management",
  "Punjabi",
  "Sociology",
  "Combined / Real Exams"
];

export const CATEGORIES_LIST = [
  "All Types",
  "Study Notes",
  "Book PDFs",
  "Sample Question Papers",
  "Real Exam Papers"
];
`;

  fs.writeFileSync('src/data/initialNotes.js', content, 'utf8');
  console.log('Updated initialNotes.js with ' + cleanData.length + ' notes.');
}

run();
