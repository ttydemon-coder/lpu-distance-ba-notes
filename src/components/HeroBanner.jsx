import React from 'react';
import { Sparkles, FileText, DownloadCloud, BookCheck, Zap } from 'lucide-react';

export default function HeroBanner({ 
  selectedSemester, 
  setSelectedSemester, 
  totalNotes, 
  totalAvailable = 45,
  totalMissing = 34,
  totalDownloads,
  activeSubject,
  setActiveSubject,
  subjectsList,
  availabilityFilter,
  setAvailabilityFilter
}) {
  const semesters = [
    { id: 0, label: 'All Semesters', short: 'All' },
    { id: 1, label: 'Semester 1', short: 'Sem 1' },
    { id: 2, label: 'Semester 2', short: 'Sem 2' },
    { id: 3, label: 'Semester 3', short: 'Sem 3' },
    { id: 4, label: 'Semester 4', short: 'Sem 4' },
    { id: 5, label: 'Semester 5', short: 'Sem 5' },
    { id: 6, label: 'Semester 6', short: 'Sem 6' },
  ];

  return (
    <div className="relative overflow-hidden pt-4 pb-6 sm:pt-8 sm:pb-10 border-b border-stone-200 dark:border-slate-800 bg-gradient-to-b from-stone-50 via-white to-stone-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 sm:w-80 sm:h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner header badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 text-orange-700 dark:text-orange-300 text-[11px] sm:text-xs font-semibold mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Lovely Professional University • Distance Education</span>
        </div>

        {/* Hero Headline */}
        <div className="max-w-3xl">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
            Curated Study Notes, Books & Solved Papers for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500">
              Bachelor of Arts (B.A.)
            </span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl">
            High-yield study notes, university book PDFs, official sample question papers, and real examination papers for LPU Distance students.
          </p>
        </div>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-5">
          <div 
            onClick={() => setAvailabilityFilter && setAvailabilityFilter('available')}
            className={`border rounded-xl p-3 shadow-sm cursor-pointer transition-all ${
              availabilityFilter === 'available'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600'
                : 'bg-white dark:bg-slate-800/80 border-stone-200 dark:border-slate-700/60 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>Available PDFs</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {totalAvailable} <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400">Ready to Read</span>
            </div>
          </div>

          <div 
            onClick={() => setAvailabilityFilter && setAvailabilityFilter('missing')}
            className={`border rounded-xl p-3 shadow-sm cursor-pointer transition-all ${
              availabilityFilter === 'missing'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600'
                : 'bg-white dark:bg-slate-800/80 border-stone-200 dark:border-slate-700/60 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
              <DownloadCloud className="w-3.5 h-3.5 text-amber-500" />
              <span>Missing from Archive</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {totalMissing} <span className="text-[10px] font-normal text-amber-600 dark:text-amber-400">Needed</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700/60 rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
              <BookCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Semesters 1-6</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Full Degree Catalog
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700/60 rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <span>Instant Access</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Free & Ad-Free
            </div>
          </div>
        </div>

        {/* Semester Filter Tabs */}
        <div className="mt-5 sm:mt-7">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select Semester
            </span>
            <span className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold">
              {selectedSemester === 0 ? 'All Semesters' : `Semester ${selectedSemester}`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
            {semesters.map((sem) => {
              const isActive = selectedSemester === sem.id;
              return (
                <button
                  key={sem.id}
                  onClick={() => setSelectedSemester(sem.id)}
                  className={`flex-shrink-0 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 dark:bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="sm:hidden">{sem.short}</span>
                  <span className="hidden sm:inline">{sem.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Subject Pill Filter */}
        <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {subjectsList.map((subj) => {
            const isSubjActive = activeSubject === subj;
            return (
              <button
                key={subj}
                onClick={() => setActiveSubject(subj)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-colors ${
                  isSubjActive
                    ? 'bg-orange-500 text-white font-semibold shadow-sm'
                    : 'bg-stone-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {subj}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
