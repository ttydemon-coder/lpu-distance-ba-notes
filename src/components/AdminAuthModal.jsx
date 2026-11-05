import React, { useState } from 'react';
import { X, Lock, KeyRound, AlertCircle } from 'lucide-react';

export default function AdminAuthModal({ isOpen, onClose, onAuthenticated, currentPasscode }) {
  const [inputPass, setInputPass] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputPass.trim() === currentPasscode) {
      localStorage.setItem('lpu_admin_auth', 'true');
      onAuthenticated();
      onClose();
    } else {
      setError('Incorrect passcode. Access denied.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl">
        
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Admin Uploader Access
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
          Please enter your secret passkey to unlock the PDF upload portal.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Admin Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={inputPass}
                onChange={(e) => {
                  setInputPass(e.target.value);
                  setError('');
                }}
                autoFocus
                placeholder="Enter secret passkey"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-sm hover:shadow active:scale-[0.98] transition-all"
          >
            Authenticate & Upload
          </button>
        </form>

      </div>
    </div>
  );
}
