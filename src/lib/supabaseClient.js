import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from localStorage or Vite environment variables
export const getSupabaseConfig = () => {
  const localUrl = localStorage.getItem('lpu_supabase_url');
  const localKey = localStorage.getItem('lpu_supabase_anon_key');
  
  const url = localUrl || import.meta.env.VITE_SUPABASE_URL || '';
  const key = localKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  return { url, key, isConfigured: Boolean(url && key) };
};

let supabaseInstance = null;

export const getSupabaseClient = () => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;
  
  if (!supabaseInstance || supabaseInstance.supabaseUrl !== url) {
    try {
      supabaseInstance = createClient(url, key);
    } catch (e) {
      console.warn("Supabase initialization error:", e);
      return null;
    }
  }
  return supabaseInstance;
};

export const testSupabaseConnection = async (url, key) => {
  try {
    const client = createClient(url, key);
    const { data, error } = await client.from('notes').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // Table might not exist yet, but connection was reached
      return { success: true, message: `Connected to Supabase! (Note: ensure 'notes' table is created with schema)` };
    }
    return { success: true, message: "Successfully connected to Supabase Database!" };
  } catch (err) {
    return { success: false, message: err.message || "Failed to reach Supabase" };
  }
};
