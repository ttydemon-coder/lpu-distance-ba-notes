import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  AlertTriangle, 
  AlertOctagon, 
  Loader2,
  FileText
} from 'lucide-react';

export default function DeleteConfirmModal({ 
  isOpen, 
  notesToDelete = [], 
  onClose, 
  onConfirmDelete 
}) {
  const [step, setStep] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsDeleting(false);
    }
  }, [isOpen]);

  if (!isOpen || !notesToDelete.length) return null;

  const count = notesToDelete.length;
  const isMultiple = count > 1;

  const handleNextStep = () => {
    setStep(2);
  };

  const handleFinalConfirm = async () => {
    try {
      setIsDeleting(true);
      const ids = notesToDelete.map(n => n.id);
      await onConfirmDelete(ids);
      setIsDeleting(false);
      onClose();
    } catch (err) {
      console.error('Deletion error:', err);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          step === 2 
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50' 
            : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              step === 2 
                ? 'bg-rose-500 text-white' 
                : 'bg-amber-500 text-white'
            }`}>
              {step === 2 ? <AlertOctagon className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                step === 2 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'
              }`}>
                Confirmation {step} of 2
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {step === 1 
                  ? (isMultiple ? `Delete ${count} Files?` : 'Delete Document?') 
                  : '⚠️ Final Warning'
                }
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-stone-200/60 dark:hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {step === 1 ? (
            <div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {isMultiple 
                  ? `Are you sure you want to delete these ${count} selected documents from the portal?`
                  : 'Are you sure you want to delete this document from the portal?'
                }
              </p>

              {/* Items Preview */}
              <div className="mt-3 max-h-40 overflow-y-auto space-y-2 p-3 bg-stone-50 dark:bg-slate-800/60 rounded-2xl border border-stone-200 dark:border-slate-700/60 text-xs">
                {notesToDelete.slice(0, 5).map(note => (
                  <div key={note.id} className="flex items-center gap-2 text-slate-800 dark:text-slate-200 truncate">
                    <FileText className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <span className="font-semibold text-orange-600 dark:text-orange-400 flex-shrink-0">
                      {note.subjectCode || 'EXTRA'}:
                    </span>
                    <span className="truncate">{note.title}</span>
                  </div>
                ))}
                {count > 5 && (
                  <p className="text-[11px] text-slate-400 italic pt-1">
                    ...and {count - 5} more files
                  </p>
                )}
              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                You will be asked once more to confirm before the files are permanently erased.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-200 leading-relaxed font-medium">
                🛑 <strong>Irreversible Action:</strong> Deleting {isMultiple ? `these ${count} documents` : 'this document'} will permanently remove {isMultiple ? 'them' : 'it'} from both the live website and storage. Students will no longer be able to view or download {isMultiple ? 'these files' : 'this file'}.
              </div>

              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-center pt-1">
                Do you really want to permanently proceed?
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Cancel
            </button>

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm active:scale-[0.98] transition-all"
              >
                <span>Continue (Step 1/2)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalConfirm}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Permanently Delete</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
