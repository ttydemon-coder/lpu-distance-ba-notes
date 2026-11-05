import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Bookmark, 
  Share2, 
  Check, 
  BookOpen
} from 'lucide-react';

export default function NoteCard({ 
  note, 
  isBookmarked, 
  onToggleBookmark, 
  onPreview, 
  onDownload 
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = (e) => {
    e.stopPropagation();
    const shareText = `Check out "${note.title}" (${note.subjectCode}) for LPU Distance B.A.!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Previous Year Papers (PYQ)':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/40';
      case 'Syllabus & Blueprint':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/40';
      case 'Assignment Solution':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40';
      default:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800/40';
    }
  };

  return (
    <div className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-orange-300 dark:hover:border-slate-700 transition-all">
      
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-stone-200 dark:border-slate-700">
              Sem {note.semester}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40">
              {note.subjectCode}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getCategoryBadgeClass(note.category)}`}>
              {note.category}
            </span>
          </div>

          {/* Bookmark & Share Actions */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(note.id);
              }}
              title={isBookmarked ? "Remove Bookmark" : "Save Note"}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked 
                  ? 'text-orange-600 bg-orange-50 dark:bg-orange-950/50' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              title="Share Note"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Note Subject & Unit */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
          <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{note.subject}</span>
          {note.unit && (
            <>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-500 dark:text-slate-400 font-normal truncate">{note.unit}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 
          onClick={() => onPreview(note)}
          className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug cursor-pointer group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors"
        >
          {note.title}
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
      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800">
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

    </div>
  );
}
