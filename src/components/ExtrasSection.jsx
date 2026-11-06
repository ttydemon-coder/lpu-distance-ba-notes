import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  Search, 
  FileText, 
  Download, 
  Eye, 
  Bookmark, 
  Share2, 
  Check, 
  Filter,
  FolderOpen,
  Calendar,
  User,
  ExternalLink,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react';

export default function ExtrasSection({ 
  notes, 
  bookmarks, 
  onToggleBookmark, 
  onPreview, 
  onDownload, 
  onOpenUploadExtra,
  isAdmin = false,
  onAdminDelete,
  selectedNoteIds = [],
  onToggleSelect,
  onBatchDelete
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSem, setSelectedSem] = useState(-1); // -1 = All Extras
  const [copiedId, setCopiedId] = useState(null);

  // Filter notes that belong to Extras
  const extraNotes = useMemo(() => {
    return notes.filter(n => {
      const isExtra = 
        n.category === 'Extras' || 
        n.subject === 'General / Extras' || 
        n.subjectCode?.includes('EXTRA') || 
        n.tags?.includes('Extras');

      if (!isExtra) return false;

      // Semester filter
      if (selectedSem !== -1) {
        if (selectedSem === 0 && n.semester !== 0) return false;
        if (selectedSem > 0 && n.semester !== selectedSem) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = n.title?.toLowerCase().includes(q);
        const inDesc = n.description?.toLowerCase().includes(q);
        const inAuthor = n.author?.toLowerCase().includes(q);
        const inTags = n.tags?.some(t => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inAuthor && !inTags) return false;
      }

      return true;
    });
  }, [notes, selectedSem, searchQuery]);

  const handleShare = (note, e) => {
    e.stopPropagation();
    const shareText = `Check out "${note.title}" in LPU B.A. Extras Vault!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      setCopiedId(note.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const semFilters = [
    { id: -1, label: 'All Extras' },
    { id: 0, label: 'General / Multi-Sem' },
    { id: 1, label: 'Sem 1' },
    { id: 2, label: 'Sem 2' },
    { id: 3, label: 'Sem 3' },
    { id: 4, label: 'Sem 4' },
    { id: 5, label: 'Sem 5' },
    { id: 6, label: 'Sem 6' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-in fade-in duration-300">
      
      {/* Top Banner / Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-8 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-purple-200 text-xs font-semibold mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Open Document Vault • No Format Restrictions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Extras & Community Documents
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-purple-100/80 leading-relaxed">
              Upload and explore supplementary PDFs: assignment question banks, revision charts, reference articles, handwritten sheets, syllabus updates, or university circulars. Any PDF is accepted.
            </p>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={onOpenUploadExtra}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-white text-purple-900 hover:bg-purple-50 active:scale-95 transition-all shadow-lg shadow-black/20"
            >
              <UploadCloud className="w-4 h-4 text-purple-600" />
              <span>Upload Any PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 pb-4 mb-6 border-b border-stone-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Semester Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto sm:flex-wrap pb-1 scrollbar-none">
            {semFilters.map((sem) => (
              <button
                key={sem.id}
                onClick={() => setSelectedSem(sem.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  selectedSem === sem.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-slate-700'
                }`}
              >
                {sem.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search extra PDFs..."
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 focus:border-purple-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <Filter className="w-3.5 h-3.5 text-purple-500" />
            <span>Showing {extraNotes.length} document{extraNotes.length === 1 ? '' : 's'}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Open contributions
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      {extraNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {extraNotes.map((note) => {
            const isBookmarked = bookmarks.includes(note.id);
            const isSelected = selectedNoteIds.includes(note.id);
            return (
              <div 
                key={note.id}
                className={`group relative flex flex-col justify-between rounded-2xl p-5 bg-white dark:bg-slate-900 border transition-all ${
                  isSelected 
                    ? 'ring-2 ring-purple-500 border-purple-500 bg-purple-50/20 dark:bg-purple-950/20' 
                    : 'border-stone-200 dark:border-slate-800 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-900/60 hover:-translate-y-0.5'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-1.5 mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSelect && onToggleSelect(note.id);
                          }}
                          className={`p-1 -ml-1 rounded-md transition-colors ${
                            isSelected 
                              ? 'text-purple-600 bg-purple-100 dark:bg-purple-950/70' 
                              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
                          }`}
                          title={isSelected ? "Deselect" : "Select for batch action"}
                        >
                          {isSelected ? <CheckSquare className="w-4 h-4 text-purple-600" /> : <Square className="w-4 h-4" />}
                        </button>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50">
                        Extras
                      </span>
                      {note.semester > 0 ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                          Sem {note.semester}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          General
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-medium">
                        {note.fileSize}
                      </span>
                    </div>

                    {/* Bookmark, Share & Admin Delete */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(note.id);
                        }}
                        title={isBookmarked ? "Remove Bookmark" : "Save Document"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isBookmarked 
                            ? 'text-purple-600 bg-purple-50 dark:bg-purple-950/50' 
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => handleShare(note, e)}
                        title="Share Link"
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        {copiedId === note.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                      </button>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAdminDelete && onAdminDelete(note);
                          }}
                          title="Delete document (Admin)"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors ml-0.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => onPreview(note)}
                    className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug cursor-pointer group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
                  >
                    {note.title}
                  </h3>

                  {/* Description */}
                  {note.description && (
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {note.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400 flex-wrap">
                    {note.author && (
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3 text-purple-400" />
                        <span>{note.author}</span>
                      </span>
                    )}
                    {note.date && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{note.date}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => onPreview(note)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 active:scale-[0.98] transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-500" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => onDownload(note)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm active:scale-[0.98] transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            No Extra Documents Yet
          </h3>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            This is an open section for any supplementary PDFs: question banks, formula sheets, revision summaries, or university notices without specific type rules.
          </p>
          <button
            onClick={onOpenUploadExtra}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/20 active:scale-95 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload The First PDF</span>
          </button>
        </div>
      )}

    </div>
  );
}
