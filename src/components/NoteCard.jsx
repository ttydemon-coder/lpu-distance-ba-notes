import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Bookmark, 
  Share2, 
  Check, 
  BookOpen,
  AlertTriangle,
  UploadCloud,
  BellRing,
  Lock,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react';

export default function NoteCard({ 
  note, 
  isBookmarked, 
  onToggleBookmark, 
  onPreview, 
  onDownload,
  isAdmin = false,
  onAdminUpload,
  onOpenAdminAuth,
  onAdminDelete,
  isSelected = false,
  onToggleSelect
}) {
  const [copied, setCopied] = useState(false);
  const [requested, setRequested] = useState(false);

  const isMissing = Boolean(
    note.isMissing || 
    note.fileSize === 'Missing' || 
    note.title?.startsWith('[MISSING]') || 
    !note.pdfUrl
  );

  const displayTitle = note.title ? note.title.replace(/^\[MISSING\]\s*/, '') : '';

  const handleShare = (e) => {
    e.stopPropagation();
    const shareText = `Check out "${displayTitle}" (${note.subjectCode}) for LPU Distance B.A.!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRequest = (e) => {
    e.stopPropagation();
    setRequested(true);
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Real Exam Papers':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/40';
      case 'Sample Question Papers':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/40';
      case 'Book PDFs':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/40';
      default:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800/40';
    }
  };

  return (
    <div className={`group relative flex flex-col justify-between rounded-2xl p-4 sm:p-5 shadow-sm transition-all ${
      isSelected
        ? 'ring-2 ring-orange-500 border-orange-500 bg-orange-50/20 dark:bg-orange-950/20'
        : isMissing 
          ? 'bg-amber-50/20 dark:bg-amber-950/15 border-2 border-dashed border-amber-300/80 dark:border-amber-800/50 hover:border-amber-400 dark:hover:border-amber-700' 
          : 'bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:shadow-md hover:border-orange-300 dark:hover:border-slate-700 hover:-translate-y-0.5'
    }`}>
      
      <div>
        {/* Top Badges & Actions */}
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
                    ? 'text-orange-600 bg-orange-100 dark:bg-orange-950/70' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
                }`}
                title={isSelected ? "Deselect" : "Select for batch action"}
              >
                {isSelected ? <CheckSquare className="w-4 h-4 text-orange-600" /> : <Square className="w-4 h-4" />}
              </button>
            )}
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-stone-200 dark:border-slate-700">
              Sem {note.semester}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40">
              {note.subjectCode}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getCategoryBadgeClass(note.category)}`}>
              {note.category}
            </span>
            {isMissing && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 inline-flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                Missing
              </span>
            )}
          </div>

          {/* Bookmark, Share & Admin Delete Actions */}
          <div className="flex items-center gap-0.5">
            {!isMissing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(note.id);
                }}
                title={isBookmarked ? "Remove Bookmark" : "Save Material"}
                className={`p-1.5 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'text-orange-600 bg-orange-50 dark:bg-orange-950/50' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            )}
            <button
              onClick={handleShare}
              title="Share"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
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

        {/* Note Subject & Unit */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
          <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">
            {note.subject === 'Sociology' ? 'Social Science' : (note.subject === 'English Literature' ? 'English' : note.subject)}
          </span>
          {note.unit && (
            <>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-500 dark:text-slate-400 font-normal truncate">{note.unit}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 
          onClick={() => !isMissing && onPreview(note)}
          className={`text-sm sm:text-base font-bold leading-snug transition-colors ${
            isMissing
              ? 'text-slate-800 dark:text-slate-200'
              : 'text-slate-900 dark:text-white cursor-pointer group-hover:text-orange-600 dark:group-hover:text-orange-400'
          }`}
        >
          {displayTitle}
        </h3>

        {/* Description */}
        {note.description && (
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {note.description}
          </p>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex items-center gap-1 mt-2.5 flex-wrap">
            {note.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                className="text-[10px] text-slate-500 dark:text-slate-400 bg-stone-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className={`mt-4 pt-3 border-t ${isMissing ? 'border-amber-200/60 dark:border-amber-900/40' : 'border-stone-100 dark:border-slate-800'}`}>
        
        {isMissing ? (
          <div>
            <div className="flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-300 mb-2.5 font-medium">
              <span className="inline-flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" /> Awaiting Archive Upload
              </span>
              <span className="text-slate-400 dark:text-slate-500">Needed</span>
            </div>

            {isAdmin ? (
              <button
                onClick={() => onAdminUpload && onAdminUpload(note)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white shadow-sm transition-all"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload This Missing PDF</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleRequest}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-[0.98] ${
                    requested 
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' 
                      : 'bg-white dark:bg-slate-800/90 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                  }`}
                >
                  {requested ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <BellRing className="w-3.5 h-3.5" />}
                  <span>{requested ? 'Request Noted' : 'Request Note'}</span>
                </button>

                <button
                  onClick={() => onOpenAdminAuth && onOpenAdminAuth(note)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admin Upload</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
              <span>{note.pages} pages • {note.fileSize}</span>
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>{note.downloadCount || 0} reads</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onPreview(note)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Read PDF</span>
              </button>

              <button
                onClick={() => onDownload(note)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-sm active:scale-[0.98] transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
