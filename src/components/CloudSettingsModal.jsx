import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  HardDrive, 
  Check, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  HelpCircle, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { testSupabaseConnection } from '../lib/supabaseClient';

export default function CloudSettingsModal({ isOpen, onClose, onSettingsUpdated }) {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  
  const [b2Bucket, setB2Bucket] = useState('');
  const [b2Endpoint, setB2Endpoint] = useState('s3.us-west-004.backblazeb2.com');
  const [b2KeyId, setB2KeyId] = useState('');
  const [b2AppKey, setB2AppKey] = useState('');
  const [b2Region, setB2Region] = useState('us-west-004');
  const [b2PublicUrl, setB2PublicUrl] = useState('');

  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSupabaseUrl(localStorage.getItem('lpu_supabase_url') || '');
      setSupabaseKey(localStorage.getItem('lpu_supabase_anon_key') || '');
      setB2Bucket(localStorage.getItem('lpu_b2_bucket') || '');
      setB2Endpoint(localStorage.getItem('lpu_b2_endpoint') || 's3.us-west-004.backblazeb2.com');
      setB2KeyId(localStorage.getItem('lpu_b2_key_id') || '');
      setB2AppKey(localStorage.getItem('lpu_b2_app_key') || '');
      setB2Region(localStorage.getItem('lpu_b2_region') || 'us-west-004');
      setB2PublicUrl(localStorage.getItem('lpu_b2_public_url') || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestSupabase = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setSupabaseTestResult({ success: false, message: 'Please enter both Supabase URL and Anon Key' });
      return;
    }
    setTestingSupabase(true);
    setSupabaseTestResult(null);
    const res = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setSupabaseTestResult(res);
    setTestingSupabase(false);
  };

  const handleSave = () => {
    localStorage.setItem('lpu_supabase_url', supabaseUrl.trim());
    localStorage.setItem('lpu_supabase_anon_key', supabaseKey.trim());
    localStorage.setItem('lpu_b2_bucket', b2Bucket.trim());
    localStorage.setItem('lpu_b2_endpoint', b2Endpoint.trim());
    localStorage.setItem('lpu_b2_key_id', b2KeyId.trim());
    localStorage.setItem('lpu_b2_app_key', b2AppKey.trim());
    localStorage.setItem('lpu_b2_region', b2Region.trim());
    localStorage.setItem('lpu_b2_public_url', b2PublicUrl.trim());

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onSettingsUpdated();
      onClose();
    }, 600);
  };

  const handleClear = () => {
    localStorage.removeItem('lpu_supabase_url');
    localStorage.removeItem('lpu_supabase_anon_key');
    localStorage.removeItem('lpu_b2_bucket');
    localStorage.removeItem('lpu_b2_endpoint');
    localStorage.removeItem('lpu_b2_key_id');
    localStorage.removeItem('lpu_b2_app_key');
    localStorage.removeItem('lpu_b2_region');
    localStorage.removeItem('lpu_b2_public_url');

    setSupabaseUrl('');
    setSupabaseKey('');
    setB2Bucket('');
    setB2Endpoint('s3.us-west-004.backblazeb2.com');
    setB2KeyId('');
    setB2AppKey('');
    setB2Region('us-west-004');
    setB2PublicUrl('');
    onSettingsUpdated();
  };

  const sqlSchemaSnippet = `-- Run this in your Supabase SQL Editor:
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  subject_code text not null,
  semester integer not null,
  category text not null,
  unit text,
  author text,
  pages integer default 1,
  file_size text,
  download_count integer default 0,
  description text,
  pdf_url text not null,
  tags jsonb default '[]'::jsonb,
  is_verified boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.notes enable row level security;

-- Public read access
create policy "Allow public read on notes" on public.notes
  for select using (true);

-- Allow inserts (or authenticate if you add admin auth)
create policy "Allow public insert on notes" on public.notes
  for insert with check (true);

-- Function to increment download counter
create or replace function increment_download_count(note_id uuid)
returns void as $$
begin
  update public.notes
  set download_count = download_count + 1
  where id = note_id;
end;
$$ language plpgsql security definer;`;

  const copySql = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sqlSchemaSnippet);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Cloud Configuration
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect Supabase (Database) & Backblaze B2 (PDF Storage)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-800 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Intro notice */}
          <div className="p-3.5 rounded-2xl bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <p className="font-semibold text-orange-800 dark:text-orange-300 mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Plug & Play Architecture:
            </p>
            The website works immediately out of the box with rich sample LPU notes. Adding your Supabase and Backblaze B2 credentials activates real-time cloud persistence and direct S3 PDF file hosting!
          </div>

          {/* Section 1: Supabase Configuration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  1. Supabase Database Configuration
                </h3>
              </div>
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1 hover:underline"
              >
                Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleTestSupabase}
                disabled={testingSupabase}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingSupabase ? 'animate-spin' : ''}`} />
                <span>Test Supabase Connection</span>
              </button>

              <button
                type="button"
                onClick={copySql}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors flex items-center gap-1.5"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
              </button>
            </div>

            {supabaseTestResult && (
              <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                supabaseTestResult.success 
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                  : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}>
                <span>{supabaseTestResult.message}</span>
              </div>
            )}
          </div>

          <div className="border-t border-stone-200 dark:border-slate-800" />

          {/* Section 2: Backblaze B2 S3 Configuration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  2. Backblaze B2 (S3-Compatible PDF Storage)
                </h3>
              </div>
              <a 
                href="https://secure.backblaze.com/b2_buckets.htm" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1 hover:underline"
              >
                B2 Console <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Bucket Name
                </label>
                <input
                  type="text"
                  value={b2Bucket}
                  onChange={(e) => setB2Bucket(e.target.value)}
                  placeholder="lpu-notes-bucket"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  S3 Endpoint
                </label>
                <input
                  type="text"
                  value={b2Endpoint}
                  onChange={(e) => setB2Endpoint(e.target.value)}
                  placeholder="s3.us-west-004.backblazeb2.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  keyID (Access Key ID)
                </label>
                <input
                  type="text"
                  value={b2KeyId}
                  onChange={(e) => setB2KeyId(e.target.value)}
                  placeholder="004a..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  applicationKey (Secret Key)
                </label>
                <input
                  type="password"
                  value={b2AppKey}
                  onChange={(e) => setB2AppKey(e.target.value)}
                  placeholder="K004..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Custom Public / CDN URL Prefix (Optional)
              </label>
              <input
                type="text"
                value={b2PublicUrl}
                onChange={(e) => setB2PublicUrl(e.target.value)}
                placeholder="https://f004.backblazeb2.com/file/your-bucket"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/90">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold text-red-500 hover:text-red-700 dark:hover:text-red-400"
          >
            Reset to Demo
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-sm"
            >
              {savedSuccess ? 'Saved!' : 'Save Credentials'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
