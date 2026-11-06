import React, { useState, useEffect } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { uploadPdfToBackblaze } from '../lib/backblazeClient';
import { saveNewNote } from '../lib/storage';

export default function UploadModal({ 
  isOpen, 
  onClose, 
  onNoteUploaded, 
  subjectsList, 
  categoriesList,
  initialData = null 
}) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(subjectsList[1] || 'English Literature');
  const [subjectCode, setSubjectCode] = useState('DENG101');
  const [semester, setSemester] = useState(1);
  const [category, setCategory] = useState('Study Notes');
  const [unit, setUnit] = useState('All Units');
  const [author, setAuthor] = useState('LPU Distance Archive');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData && isOpen) {
      const cleanTitle = initialData.title ? initialData.title.replace(/^\[MISSING\]\s*/, '') : '';
      setTitle(cleanTitle);
      setSubject(initialData.subject || subjectsList[1] || 'English Literature');
      setSubjectCode(initialData.subjectCode || 'DENG101');
      setSemester(initialData.semester || 1);
      setCategory(initialData.category || 'Study Notes');
      setUnit(initialData.unit || 'All Units');
      setDescription(initialData.description ? initialData.description.replace(/^⚠️\s*/, '') : '');
    } else if (!initialData && isOpen) {
      setTitle('');
      setFile(null);
      setErrorMsg('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubjectChange = (val) => {
    setSubject(val);
    const codeMap = {
      'English Literature': 'DENG101',
      'Management': 'DMGT101',
      'Punjabi': 'DPBI101',
      'Sociology': 'DSOC101',
      'Political Science': 'DEPOL101',
      'History': 'DEHIS101',
      'Economics': 'DEECO201',
      'Public Administration': 'DEPUB301',
      'Computer Applications': 'DECAP101',
      'Environmental Studies': 'DEEVS101',
      'Combined / Real Exams': 'LPU-SEM'
    };
    if (codeMap[val]) {
      setSubjectCode(codeMap[val]);
    }
  };

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
      setErrorMsg('Please provide a title.');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg('');
      setStatusMessage('Uploading PDF document...');
      setUploadProgress(40);

      // Upload file to storage
      const uploadRes = await uploadPdfToBackblaze(file, file.name);
      setUploadProgress(75);

      setStatusMessage('Saving record to library...');

      const tags = tagsInput
        ? tagsInput.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean)
        : [subject, `Sem-${semester}`];

      const fileSizeFormatted = file.size > 1024 * 1024 
        ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        : (file.size / 1024).toFixed(0) + ' KB';

      const newNoteData = {
        id: initialData?.id || `note-${Date.now()}`,
        replaceNoteId: initialData?.id || null,
        title: title.trim(),
        subject,
        subjectCode: subjectCode.toUpperCase().trim(),
        semester: Number(semester),
        category,
        unit: unit.trim() || 'All Units',
        author: author.trim() || 'LPU Distance Archive',
        pages: Math.max(1, Math.round(file.size / 65000)),
        fileSize: fileSizeFormatted,
        downloadCount: initialData?.downloadCount || 0,
        date: new Date().toISOString().split('T')[0],
        description: description.trim(),
        pdfUrl: uploadRes.url,
        tags,
        isVerified: true
      };

      const savedNote = await saveNewNote(newNoteData);
      setUploadProgress(100);
      setStatusMessage('Document published successfully!');

      setTimeout(() => {
        setIsUploading(false);
        onNoteUploaded(savedNote);
        onClose();
      }, 500);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Upload Study Material
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Notes, Book PDFs, Sample Papers & Real Exam Papers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-stone-200 dark:hover:bg-slate-800 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {/* PDF File Picker Zone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              PDF Document <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-stone-300 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-stone-50/50 dark:bg-slate-800/40 relative">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-orange-500 flex-shrink-0" />
                  <div className="text-left overflow-hidden">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-1.5" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Click to browse or drop your PDF here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports high-quality course books, notes, and question papers
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Political Theory: Concept of Sovereignty & State"
              required
              className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category & Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Material Type
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              >
                {categoriesList.filter(c => c !== 'All Types').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>Semester {num}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              >
                {subjectsList.filter(s => s !== 'All Subjects').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Course Code
              </label>
              <input
                type="text"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="e.g., DEPOL101"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Unit / Scope & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Unit / Scope
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. Unit 1-4 or Full Book"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Publisher / Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g., LPU Distance Education"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Description / Summary (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key topics, chapters or exam questions covered in this document..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs border border-red-200 dark:border-red-900">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Progress */}
          {isUploading && (
            <div className="p-3 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-orange-700 dark:text-orange-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {statusMessage}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-orange-200 dark:bg-orange-900/40 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-sm disabled:opacity-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Publish to Portal</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
