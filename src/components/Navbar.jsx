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
  X,
  Github,
  ExternalLink,
  Sparkles
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
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-stone-200 dark:border-slate-800 transition-colors shadow-sm">
      
      {/* Top Global Notice Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white text-xs py-2 px-3 sm:px-6 shadow-sm border-b border-orange-700/30">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-center">
          <span className="font-semibold text-amber-50 drop-shadow-sm text-[11px] sm:text-xs">
            If website downloads not working use
          </span>
          <a 
            href="https://github.com/ttydemon-coder/LPU-BA-Notes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold tracking-wide transition-all shadow-sm text-[11px] sm:text-xs"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Link</span>
            <ExternalLink className="w-3 h-3 opacity-90" />
          </a>
        </div>
      </div>

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
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-stone-200/60 dark:bg-slate-700/60 rounded border border-stone-300/40 dark:border-slate-600/40 pointer-events-none">
                  /
                </span>
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
              onClick={() => setCurrentTab('extras')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'extras' 
                  ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              Extras
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

          {/* Actions: GitHub Repo, Theme Toggle & Admin Upload Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Desktop GitHub Repository Link */}
            <a
              href="https://github.com/ttydemon-coder/LPU-BA-Notes"
              target="_blank"
              rel="noopener noreferrer"
              title="Open Public GitHub PDF Archive"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 border border-stone-200 dark:border-slate-800 hover:bg-stone-100 dark:hover:bg-slate-800 hover:border-orange-300 dark:hover:border-slate-700 transition-all shadow-sm"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            
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
