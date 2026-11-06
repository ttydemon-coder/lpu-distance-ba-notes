import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { getAuthorizedPdfUrl } from '../lib/backblazeClient';

export default function PdfViewerModal({ note, onClose, onDownload }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!note) return null;

  const finalPdfUrl = getAuthorizedPdfUrl(note.pdfUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className={`flex flex-col bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[92vh]'
      }`}>
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5 overflow-hidden pr-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {note.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-orange-600 dark:text-orange-400">{note.subjectCode}</span>
                <span>•</span>
                <span>Sem {note.semester}</span>
                <span>•</span>
                <span>{note.fileSize}</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800 rounded-lg hidden sm:block"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <a
              href={finalPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new window"
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-800 rounded-lg"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => onDownload(note)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={onClose}
              title="Close Reader"
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-800 rounded-lg ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Body / PDF Frame */}
        <div className="flex-1 w-full h-full relative bg-stone-100 dark:bg-slate-950">
          <iframe
            src={`${finalPdfUrl}#toolbar=1&navpanes=0`}
            title={note.title}
            className="w-full h-full border-0"
          />

          {/* Fallback helper bar if embedded view is constrained */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-stone-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 pointer-events-auto">
            <Info className="w-3.5 h-3.5 text-orange-500" />
            <span>Having trouble previewing?</span>
            <a 
              href={finalPdfUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold text-orange-600 dark:text-orange-400 underline"
            >
              Open Direct PDF
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
