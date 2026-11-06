import React from 'react';
import { BookOpen, GraduationCap, Calculator, Bookmark, PlusCircle, Lock } from 'lucide-react';

export default function MobileNav({ currentTab, setCurrentTab, onOpenUpload, bookmarksCount, isAdmin, onOpenAdminAuth }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-stone-200 dark:border-slate-800 pb-safe">
      <div className="flex items-center justify-around px-2 py-1.5 max-w-md mx-auto">
        
        {/* Library */}
        <button
          onClick={() => setCurrentTab('library')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            currentTab === 'library'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${currentTab === 'library' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5">Notes</span>
        </button>

        {/* Syllabus */}
        <button
          onClick={() => setCurrentTab('syllabus')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            currentTab === 'syllabus'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <GraduationCap className={`w-5 h-5 ${currentTab === 'syllabus' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5">Syllabus</span>
        </button>

        {/* Center Action Button: Upload if admin, else Admin Login */}
        <button
          onClick={isAdmin ? onOpenUpload : onOpenAdminAuth}
          className="flex flex-col items-center justify-center -mt-5"
          aria-label={isAdmin ? "Upload Note" : "Admin Login"}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 active:scale-95 transition-transform">
            {isAdmin ? <PlusCircle className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
          </div>
          <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 mt-0.5">
            {isAdmin ? 'Upload' : 'Admin'}
          </span>
        </button>



        {/* Bookmarks */}
        <button
          onClick={() => setCurrentTab('bookmarks')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            currentTab === 'bookmarks'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <div className="relative">
            <Bookmark className={`w-5 h-5 ${currentTab === 'bookmarks' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 text-[8px] font-bold bg-orange-500 text-white rounded-full flex items-center justify-center">
                {bookmarksCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Saved</span>
        </button>

      </div>
    </nav>
  );
}
