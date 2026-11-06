import React from 'react';
import { Sparkles, FileText, DownloadCloud, BookCheck, CheckCircle2 } from 'lucide-react';

export default function HeroBanner({ 
  selectedSemester, 
  setSelectedSemester, 
  totalNotes, 
  totalAvailable = 59,
  totalMissing = 27,
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
    <div className="relative overflow-hidden pt-4 pb-5 sm:pt-6 sm:pb-8 border-b border-stone-200 dark:border-slate-800 bg-gradient-to-b from-stone-50 via-white to-stone-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-1/4 w-60 h-60 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100/70 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 text-orange-700 dark:text-orange-300 text-[11px] font-semibold mb-2.5 shadow-sm">
          <Sparkles className="w-3 h-3 text-orange-500" />
          <span>Lovely Professional University • Distance B.A.</span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Study Notes, Books & Solved Papers
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              English • Punjabi • Management • Social Science
            </p>
          </div>

          {/* Compact Status Badges (Replacing 4 bulky boxes) */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setAvailabilityFilter && setAvailabilityFilter('available')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                availabilityFilter === 'available'
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800/90 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>{totalAvailable} Available</span>
            </button>

            <button
              onClick={() => setAvailabilityFilter && setAvailabilityFilter('missing')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                availabilityFilter === 'missing'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800/90 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60 hover:bg-amber-50 dark:hover:bg-amber-950/30'
              }`}
            >
              <DownloadCloud className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{totalMissing} Missing / Needed</span>
            </button>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 bg-stone-100 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700/60">
              <BookCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Semesters 1-6</span>
            </div>
          </div>
        </div>

        {/* Clean Semester Filter Bar */}
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {semesters.map((sem) => {
              const isActive = selectedSemester === sem.id;
              return (
                <button
                  key={sem.id}
                  onClick={() => setSelectedSemester(sem.id)}
                  className={`flex-shrink-0 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 dark:bg-orange-500 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span className="sm:hidden">{sem.short}</span>
                  <span className="hidden sm:inline">{sem.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
