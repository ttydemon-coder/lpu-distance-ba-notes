import React from 'react';
import { BookOpen, Shield, ExternalLink, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-colors pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-sm">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                LPU Distance B.A. Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Curated academic repository for Lovely Professional University Distance Education students pursuing Bachelor of Arts (B.A.). Fast, ad-free study notes, actual book PDFs, official sample papers, and real examination questions.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-orange-500" />
              <span>For non-commercial student learning</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Core Subjects
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>English (DENG)</li>
              <li>Punjabi (DPBI)</li>
              <li>Management (DMGT)</li>
              <li>Social Science (DSOC)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Official University Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a href="https://ums.lpu.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-orange-600">
                  LPU e-Connect (UMS) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.lpude.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-orange-600">
                  LPU Distance Education Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.lpude.in/programmes/arts/bachelor-of-arts.php" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-orange-600">
                  Official B.A. Programme Guide <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-stone-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} LPU Distance B.A. Portal. Student Study Archive.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Fast, secure & optimized for mobile</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
