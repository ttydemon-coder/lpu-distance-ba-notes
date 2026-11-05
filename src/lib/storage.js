import { INITIAL_NOTES } from '../data/initialNotes';
import { getSupabaseClient } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'lpu_notes_catalog_v1';
const BOOKMARKS_KEY = 'lpu_notes_bookmarks_v1';

export const getStoredNotes = async () => {
  const supabase = getSupabaseClient();
  
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data && data.length > 0) {
        // Map database columns to app note shape if needed
        return data.map(item => ({
          id: item.id || `sb-${Date.now()}`,
          title: item.title,
          subject: item.subject,
          subjectCode: item.subject_code || item.subjectCode,
          semester: Number(item.semester),
          category: item.category || 'Study Notes',
          unit: item.unit || 'Unit 1',
          author: item.author || 'Anonymous Contributor',
          pages: item.pages || 10,
          fileSize: item.file_size || item.fileSize || '1.5 MB',
          downloadCount: item.download_count || item.downloadCount || 0,
          date: item.created_at ? item.created_at.split('T')[0] : '2024-05-01',
          description: item.description || '',
          pdfUrl: item.pdf_url || item.pdfUrl,
          tags: Array.isArray(item.tags) ? item.tags : (item.tags ? JSON.parse(item.tags) : []),
          isVerified: item.is_verified ?? true
        }));
      }
    } catch (e) {
      console.warn("Could not fetch from Supabase, loading local state:", e);
    }
  }

  // Fallback to local storage
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // parse error, fallback to initial
    }
  }

  // Initialize with curated seed notes
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_NOTES));
  return INITIAL_NOTES;
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
        download_count: 0,
        description: newNote.description,
        pdf_url: newNote.pdfUrl,
        tags: newNote.tags,
        is_verified: true
      };
      
      const { data, error } = await supabase.from('notes').insert([payload]).select();
      if (!error && data && data[0]) {
        return {
          ...newNote,
          id: data[0].id
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
