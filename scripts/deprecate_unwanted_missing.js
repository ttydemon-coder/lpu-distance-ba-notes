import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kyefqtuewqqltoygbsxx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YQepSRrgNcUdMAznV6_VRg_dDGVgROH';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const IDS_TO_DEPRECATE = [
  // Missing sample papers (all 6)
  'a1757d14-c629-4c97-bc8a-6ad69a918a08',
  'b97e8c1d-74fa-4223-ae7c-5b175fd086e5',
  '9d45fcca-d7b3-42e9-bed8-f7e5e74e7293',
  '3de915b6-3bc2-4602-9b01-48b9475f3a53',
  '0014b1d2-2583-4424-9f7d-87663464cb4e',
  'ecc6b759-addd-4399-8eef-853b79a3f8f0',

  // Missing real exams for Sem 1 and Sem 5 (keep Sem 6)
  'fbaf12bd-44b3-4c7a-a06a-b4ac2e3fafcc',
  '962353b4-0460-4561-9a87-ff2ad59862ec'
];

async function main() {
  console.log(`Deprecating ${IDS_TO_DEPRECATE.length} unwanted missing records in Supabase...`);
  
  for (const id of IDS_TO_DEPRECATE) {
    const { error } = await supabase
      .from('notes')
      .update({ title: `[DEPRECATED] Unwanted Missing Record ${id}` })
      .eq('id', id);

    if (error) {
      console.error(`Error deprecating ${id}:`, error);
    } else {
      console.log(`Deprecated ${id}`);
    }
  }

  console.log('Done deprecating unwanted missing records.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
