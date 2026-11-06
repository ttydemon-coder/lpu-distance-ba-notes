import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { uploadPdfToBackblaze } from '../lib/backblazeClient';
import { saveNewNote } from '../lib/storage';

export default function UploadExtraModal({ 
  isOpen, 
  onClose, 
  onNoteUploaded 
}) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState(0); // 0 = General / Any
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
        setErrorMsg('Please select a valid PDF file.');
        return;
      }
      setFile(selected);
      setErrorMsg('');
      if (!title) {
        const cleanName = selected.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setTitle(cleanName);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please choose a PDF file to upload.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Please give your document a title.');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg('');
      setStatusMessage('Uploading PDF document...');
      setUploadProgress(40);

      // Upload file to Backblaze B2
      const uploadRes = await uploadPdfToBackblaze(file, `extra_${file.name}`);
      setUploadProgress(75);

      setStatusMessage('Publishing to Extras vault...');

      const fileSizeFormatted = file.size > 1024 * 1024 
        ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        : (file.size / 1024).toFixed(0) + ' KB';

      const newNoteData = {
        id: `extra-${Date.now()}`,
        title: title.trim(),
        subject: 'General / Extras',
        subjectCode: semester > 0 ? `SEM${semester}-EXTRA` : 'EXTRA',
        semester: Number(semester),
        category: 'Extras',
        unit: 'Supplementary Document',
        author: author.trim() || 'Student Contribution',
        pages: Math.max(1, Math.round(file.size / 65000)),
        fileSize: fileSizeFormatted,
        downloadCount: 0,
        date: new Date().toISOString().split('T')[0],
        description: description.trim() || 'Open supplementary study material uploaded to Extras.',
        pdfUrl: uploadRes.url,
        tags: ['Extras', 'Open Upload', semester > 0 ? `Sem-${semester}` : 'General'],
        isVerified: true,
        isMissing: false
      };

      const savedNote = await saveNewNote(newNoteData);
      setUploadProgress(100);
      setStatusMessage('Extra document published successfully!');

      setTimeout(() => {
        setIsUploading(false);
        onNoteUploaded(savedNote);
        onClose();
        // Reset state
        setFile(null);
        setTitle('');
        setDescription('');
        setAuthor('');
        setSemester(0);
      }, 500);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Upload failed. Please check network and try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Upload to Extras
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Any PDF allowed without strict category or subject restrictions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900/40">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* PDF File Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Choose PDF Document <span className="text-orange-500">*</span>
            </label>
            <div className="relative border-2 border-dashed border-stone-300 dark:border-slate-700 hover:border-purple-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-stone-50/50 dark:bg-slate-800/40">
              <input 
                type="file" 
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={isUploading}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center gap-1.5">
                <FileText className="w-8 h-8 text-purple-500" />
                {file ? (
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs">{file.name}</p>
                    <p className="text-[11px] text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click or Drag & Drop any PDF here</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Notes, guides, summaries, question sheets, charts</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Document Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Title <span className="text-orange-500">*</span>
            </label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              placeholder="e.g. Political Science Summary / Rapid Revision Sheet"
              className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 focus:border-purple-500 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Semester (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester (Optional)
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                disabled={isUploading}
                className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 focus:border-purple-500 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value={0}>General / All Semesters</option>
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
                <option value={3}>Semester 3</option>
                <option value={4}>Semester 4</option>
                <option value={5}>Semester 5</option>
                <option value={6}>Semester 6</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contributed By (Optional)
              </label>
              <input 
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={isUploading}
                placeholder="Your name or Student Contributor"
                className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 focus:border-purple-500 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
              >
              </input>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Brief Description / Notes (Optional)
            </label>
            <textarea 
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              placeholder="What topics or helpful info does this document contain?"
              className="w-full px-3.5 py-2.5 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 focus:border-purple-500 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none resize-none"
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-500" />
                  {statusMessage}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-stone-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUploading || !file}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-purple-500/20 active:scale-[0.98] transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isUploading ? 'Publishing Document...' : 'Publish to Extras'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
