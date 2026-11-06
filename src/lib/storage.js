import { INITIAL_NOTES } from '../data/initialNotes';
import { getSupabaseClient } from './supabaseClient';
import { getAuthorizedPdfUrl } from './backblazeClient';

const LOCAL_STORAGE_KEY = 'lpu_notes_catalog_v1';
const BOOKMARKS_KEY = 'lpu_notes_bookmarks_v1';

export const getStoredNotes = async () => {
  const supabase = getSupabaseClient();
  
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('semester', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (!error && data && data.length > 0) {
        // Filter out deprecated test notes and map columns
        return data
          .filter(item => !item.title?.includes('[DEPRECATED]') && !item.pdf_url?.includes('dummy.pdf'))
          .map(item => {
            const isMissing = Boolean(
              item.file_size === 'Missing' || 
              item.title?.startsWith('[MISSING]') || 
              !item.pdf_url || 
              item.is_verified === false
            );
            return {
              id: item.id || `sb-${Date.now()}`,
              title: item.title,
              subject: item.subject,
              subjectCode: item.subject_code || item.subjectCode,
              semester: Number(item.semester),
              category: item.category || 'Study Notes',
              unit: item.unit || 'All Units',
              author: item.author || 'LPU Contributor',
              pages: item.pages || 0,
              fileSize: item.file_size || item.fileSize || (isMissing ? 'Missing' : '1.5 MB'),
              downloadCount: item.download_count || item.downloadCount || 0,
              date: item.created_at ? item.created_at.split('T')[0] : '2024-05-01',
              description: item.description || '',
              pdfUrl: getAuthorizedPdfUrl(item.pdf_url || item.pdfUrl || ''),
              tags: Array.isArray(item.tags) ? item.tags : (item.tags ? JSON.parse(item.tags) : []),
              isVerified: item.is_verified ?? !isMissing,
              isMissing
            };
          });
      }
    } catch (e) {
      console.warn("Could not fetch from Supabase, loading local state:", e);
    }
  }

  // Fallback to local storage
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map(n => ({ ...n, pdfUrl: getAuthorizedPdfUrl(n.pdfUrl) }));
    } catch {
      // parse error, fallback to initial
    }
  }

  // Initialize with curated seed notes
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_NOTES));
  return INITIAL_NOTES.map(n => ({ ...n, pdfUrl: getAuthorizedPdfUrl(n.pdfUrl) }));
};

export const saveNewNote = async (newNote) => {
  const supabase = getSupabaseClient();
  
  if (supabase) {
    try {
      const payload = {
        title: newNote.title,
        subject: newNote.subject,
        subject_code: newNote.subjectCode,
        semester: newNote.semester,
        category: newNote.category,
        unit: newNote.unit,
        author: newNote.author,
        pages: newNote.pages,
        file_size: newNote.fileSize,
        description: newNote.description,
        pdf_url: newNote.pdfUrl,
        tags: newNote.tags,
        is_verified: true
      };
      
      // If replacing a missing item, perform an UPDATE
      if (newNote.replaceNoteId) {
        const { data, error } = await supabase
          .from('notes')
          .update(payload)
          .eq('id', newNote.replaceNoteId)
          .select();
        if (!error && data && data[0]) {
          return {
            ...newNote,
            id: data[0].id,
            isMissing: false
          };
        }
      }

      const { data, error } = await supabase.from('notes').insert([{ ...payload, download_count: 0 }]).select();
      if (!error && data && data[0]) {
        return {
          ...newNote,
          id: data[0].id,
          isMissing: false
        };
      }
    } catch (e) {
      console.warn("Supabase insert error, falling back to local storage:", e);
    }
  }

  // Local fallback
  const current = await getStoredNotes();
  const updated = [newNote, ...current];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return newNote;
};

export const incrementNoteDownload = async (noteId) => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.rpc('increment_download_count', { note_id: noteId });
    } catch {
      // Ignore RPC failure
    }
  }

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      const notes = JSON.parse(stored);
      const updated = notes.map(n => n.id === noteId ? { ...n, downloadCount: (n.downloadCount || 0) + 1 } : n);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      //
    }
  }
};

export const getBookmarks = () => {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const toggleBookmark = (noteId) => {
  const current = getBookmarks();
  let updated;
  if (current.includes(noteId)) {
    updated = current.filter(id => id !== noteId);
  } else {
    updated = [...current, noteId];
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteNotes = async (noteIds) => {
  const ids = Array.isArray(noteIds) ? noteIds : [noteIds];
  if (!ids.length) return true;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error: delErr } = await supabase.from('notes').delete().in('id', ids);
      if (delErr) {
        // If DELETE is restricted by RLS, mark as deprecated so it is filtered out
        await supabase.from('notes').update({ title: `[DEPRECATED] Admin deleted ${Date.now()}` }).in('id', ids);
      }
    } catch (err) {
      try {
        await supabase.from('notes').update({ title: `[DEPRECATED] Admin deleted ${Date.now()}` }).in('id', ids);
      } catch (e) {
        console.warn("Supabase deletion error:", e);
      }
    }
  }

  // Update local storage fallback
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      const notes = JSON.parse(stored);
      const updated = notes.filter(n => !ids.includes(n.id));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  return true;
};

