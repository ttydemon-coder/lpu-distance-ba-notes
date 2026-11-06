import React, { useState } from 'react';
import { 
  BookOpen, 
  UploadCloud, 
  Bookmark, 
  Sun, 
  Moon, 
  Search, 
  GraduationCap, 
  Calculator, 
  Lock,
  X
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  onOpenUpload, 
  darkMode, 
  setDarkMode, 
  searchQuery, 
  setSearchQuery,
  bookmarksCount,
  isAdmin,
  onOpenAdminAuth
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-stone-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentTab('library')}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                  LPU Distance
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-orange-100 text-orange-700 dark:bg-orange-950/70 dark:text-orange-400">
                  B.A. Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                Notes, Book PDFs, Sample Papers & Real Exam Papers
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-4 relative">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject code (DEENG101), unit, topic..."
                className="w-full pl-10 pr-8 py-2 bg-stone-100 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 focus:border-orange-500 dark:focus:border-orange-500 rounded-full text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('library')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'library' 
                  ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
              }`}
            >
              Study Archive
            </button>
            <button
              onClick={() => setCurrentTab('syllabus')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'syllabus' 
                  ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Syllabus
            </button>
            <button
              onClick={() => setCurrentTab('calculator')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'calculator' 
                  ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              CGPA Calc
            </button>
            <button
              onClick={() => setCurrentTab('bookmarks')}
              className={`relative flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'bookmarks' 
                  ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Saved
              {bookmarksCount > 0 && (
                <span className="w-4 h-4 text-[9px] font-bold bg-orange-500 text-white rounded-full flex items-center justify-center">
                  {bookmarksCount}
                </span>
              )}
            </button>
          </nav>

          {/* Actions: Theme Toggle & Admin Upload Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Admin Upload / Access Button */}
            {isAdmin ? (
              <button
                onClick={onOpenUpload}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-sm shadow-orange-500/20 active:scale-95 transition-all"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload PDF</span>
                <span className="sm:hidden">Upload</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminAuth}
                title="Admin Access"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 border border-stone-200 dark:border-slate-800 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-stone-100 dark:border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                placeholder="Search subjects, codes (DEENG101)..."
                className="w-full pl-9 pr-8 py-2 bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 focus:border-orange-500 rounded-xl text-xs text-slate-900 dark:text-white"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
