import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import HeroBanner from './components/HeroBanner';
import NoteCard from './components/NoteCard';
import PdfViewerModal from './components/PdfViewerModal';
import UploadModal from './components/UploadModal';
import AdminAuthModal from './components/AdminAuthModal';
import SyllabusGuide from './components/SyllabusGuide';
import GpaCalculator from './components/GpaCalculator';
import Footer from './components/Footer';

import { SUBJECTS_LIST, CATEGORIES_LIST } from './data/initialNotes';
import { getStoredNotes, incrementNoteDownload, getBookmarks, toggleBookmark } from './lib/storage';
import { BookOpen, Search, Filter, Bookmark, PlusCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(0); // 0 = all
  const [activeSubject, setActiveSubject] = useState('All Subjects');
  const [activeCategory, setActiveCategory] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('library'); // 'library' | 'syllabus' | 'calculator' | 'bookmarks'
  
  const [bookmarks, setBookmarks] = useState([]);
  const [previewNote, setPreviewNote] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [adminAuthOpen, setAdminAuthOpen] = useState(false);

  // Admin access state: only the owner with the passcode can upload
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('lpu_admin_auth') === 'true';
  });
  const [adminPasscode, setAdminPasscode] = useState(() => {
    return localStorage.getItem('lpu_admin_passcode') || 'admin123';
  });

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('lpu_theme') === 'dark' || 
      (!('lpu_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lpu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lpu_theme', 'light');
    }
  }, [darkMode]);

  // Load initial notes & bookmarks
  const refreshNotes = async () => {
    setIsLoading(true);
    const loaded = await getStoredNotes();
    setNotes(loaded);
    setBookmarks(getBookmarks());
    setIsLoading(false);
  };

  useEffect(() => {
    refreshNotes();
  }, []);

  // Handle Bookmarks
  const handleToggleBookmark = (noteId) => {
    const updated = toggleBookmark(noteId);
    setBookmarks(updated);
  };

  // Handle PDF Download
  const handleDownloadNote = (note) => {
    incrementNoteDownload(note.id);
    
    // Update local count
    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, downloadCount: (n.downloadCount || 0) + 1 } : n));

    // Trigger download
    const link = document.createElement('a');
    link.href = note.pdfUrl;
    link.target = '_blank';
    link.download = `${note.subjectCode}-${note.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle newly uploaded note
  const handleNoteUploaded = (newNote) => {
    setNotes(prev => [newNote, ...prev]);
    setCurrentTab('library');
    if (newNote.semester) {
      setSelectedSemester(newNote.semester);
    }
  };

  const handleAuthenticated = () => {
    setIsAdmin(true);
    setUploadModalOpen(true);
  };

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      // Semester filter
      if (selectedSemester !== 0 && note.semester !== selectedSemester) {
        return false;
      }

      // Subject filter
      if (activeSubject !== 'All Subjects' && note.subject !== activeSubject) {
        return false;
      }

      // Category filter
      if (activeCategory !== 'All Types' && note.category !== activeCategory) {
        return false;
      }

      // Bookmarks tab filter
      if (currentTab === 'bookmarks' && !bookmarks.includes(note.id)) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = note.title?.toLowerCase().includes(query);
        const inCode = note.subjectCode?.toLowerCase().includes(query);
        const inSubject = note.subject?.toLowerCase().includes(query);
        const inUnit = note.unit?.toLowerCase().includes(query);
        const inDesc = note.description?.toLowerCase().includes(query);
        const inAuthor = note.author?.toLowerCase().includes(query);
        const inTags = note.tags?.some(t => t.toLowerCase().includes(query));

        if (!inTitle && !inCode && !inSubject && !inUnit && !inDesc && !inAuthor && !inTags) {
          return false;
        }
      }

      return true;
    });
  }, [notes, selectedSemester, activeSubject, activeCategory, currentTab, bookmarks, searchQuery]);

  const totalDownloads = useMemo(() => {
    return notes.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);
  }, [notes]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenUpload={() => {
          if (isAdmin) setUploadModalOpen(true);
          else setAdminAuthOpen(true);
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        bookmarksCount={bookmarks.length}
        isAdmin={isAdmin}
        onOpenAdminAuth={() => setAdminAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'library' && (
          <div>
            {/* Hero / Filter Section */}
            <HeroBanner
              selectedSemester={selectedSemester}
              setSelectedSemester={setSelectedSemester}
              totalNotes={notes.length}
              totalDownloads={totalDownloads}
              activeSubject={activeSubject}
              setActiveSubject={setActiveSubject}
              subjectsList={SUBJECTS_LIST}
            />

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              
              {/* Secondary Category Bar & Results Count */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-stone-200 dark:border-slate-800 gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {CATEGORIES_LIST.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        activeCategory === cat
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-stone-200 dark:border-slate-800 hover:border-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between sm:justify-end gap-2">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-orange-500" />
                    <span>Showing {filteredNotes.length} {filteredNotes.length === 1 ? 'material' : 'materials'}</span>
                  </div>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <ShieldCheck className="w-3 h-3" /> Admin Mode
                    </span>
                  )}
                </div>
              </div>

              {/* Notes Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 animate-pulse p-6" />
                  ))}
                </div>
              ) : filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      isBookmarked={bookmarks.includes(note.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onPreview={(n) => setPreviewNote(n)}
                      onDownload={handleDownloadNote}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 max-w-md mx-auto shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    No study materials found
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Try adjusting your semester or subject filter.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedSemester(0);
                      setActiveSubject('All Subjects');
                      setActiveCategory('All Types');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-stone-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {currentTab === 'syllabus' && (
          <SyllabusGuide 
            onSelectCourse={(courseCode) => {
              setCurrentTab('library');
              setSearchQuery(courseCode);
            }} 
          />
        )}

        {currentTab === 'calculator' && (
          <GpaCalculator />
        )}

        {currentTab === 'bookmarks' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
            <div className="flex items-center gap-2 mb-6">
              <Bookmark className="w-6 h-6 text-orange-500 fill-current" />
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Your Saved Notes ({filteredNotes.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Quick access to all materials you bookmarked for revision
                </p>
              </div>
            </div>

            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isBookmarked={true}
                    onToggleBookmark={handleToggleBookmark}
                    onPreview={(n) => setPreviewNote(n)}
                    onDownload={handleDownloadNote}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-14 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 max-w-md mx-auto shadow-sm">
                <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No bookmarks yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Click the bookmark icon on any note to save it here for fast revision before exams.
                </p>
                <button
                  onClick={() => setCurrentTab('library')}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white shadow-sm"
                >
                  Browse Notes
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Nav */}
      <MobileNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenUpload={() => {
          if (isAdmin) setUploadModalOpen(true);
          else setAdminAuthOpen(true);
        }}
        bookmarksCount={bookmarks.length}
        isAdmin={isAdmin}
        onOpenAdminAuth={() => setAdminAuthOpen(true)}
      />

      {/* PDF Modal Reader */}
      <PdfViewerModal
        note={previewNote}
        onClose={() => setPreviewNote(null)}
        onDownload={handleDownloadNote}
      />

      {/* Upload Note Modal (Only opened by Admin) */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onNoteUploaded={handleNoteUploaded}
        subjectsList={SUBJECTS_LIST}
        categoriesList={CATEGORIES_LIST}
      />

      {/* Admin Auth Modal */}
      <AdminAuthModal
        isOpen={adminAuthOpen}
        onClose={() => setAdminAuthOpen(false)}
        onAuthenticated={handleAuthenticated}
        currentPasscode={adminPasscode}
      />

    </div>
  );
}
