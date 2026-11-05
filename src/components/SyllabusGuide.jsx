import React, { useState } from 'react';
import { LPU_BA_CURRICULUM } from '../data/curriculum';
import { BookOpen, GraduationCap, Award, ArrowRight, CheckCircle } from 'lucide-react';

export default function SyllabusGuide({ onSelectCourse }) {
  const [activeSem, setActiveSem] = useState(1);

  const currentCurriculum = LPU_BA_CURRICULUM.find(c => c.semester === activeSem) || LPU_BA_CURRICULUM[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-semibold mb-2">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>LPU Distance Education • Bachelor of Arts Curriculum</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Semester-Wise Syllabus & Course Blueprint
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Official course structure, credit breakdown, and direct access to study notes for each subject.
        </p>
      </div>

      {/* Semester Selector Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
        {LPU_BA_CURRICULUM.map((sem) => {
          const isActive = activeSem === sem.semester;
          return (
            <button
              key={sem.semester}
              onClick={() => setActiveSem(sem.semester)}
              className={`p-3 rounded-2xl text-center border transition-all ${
                isActive
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-stone-200 dark:border-slate-800 hover:border-orange-300'
              }`}
            >
              <div className="text-xs uppercase tracking-wider font-bold">Semester</div>
              <div className="text-xl font-extrabold mt-0.5">{sem.semester}</div>
            </button>
          );
        })}
      </div>

      {/* Active Semester Card */}
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-stone-200 dark:border-slate-800 gap-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {currentCurriculum.title}
            </h3>
            <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-0.5">
              {currentCurriculum.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Total Semester Credits: {currentCurriculum.courses.reduce((acc, c) => acc + c.credits, 0)} Credits</span>
          </div>
        </div>

        {/* Courses Table / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCurriculum.courses.map((course) => (
            <div
              key={course.code}
              className="group flex flex-col justify-between p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                    {course.code}
                  </span>
                  <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-900/60">
                    {course.type} • {course.credits} Credits
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {course.title}
                </h4>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Self-Learning Material
                </span>
                <button
                  onClick={() => onSelectCourse(course.code)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:gap-1.5 transition-all"
                >
                  <span>Find Notes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
