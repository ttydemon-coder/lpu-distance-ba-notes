import React, { useState } from 'react';
import { Calculator, Plus, Trash2, Award, Info, RefreshCw } from 'lucide-react';

const GRADE_POINTS = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'D': 4,
  'F': 0
};

export default function GpaCalculator() {
  const [courses, setCourses] = useState([
    { id: 1, name: 'English Literature - I (DEENG101)', credits: 4, grade: 'A+' },
    { id: 2, name: 'Political Theory (DEPOL101)', credits: 4, grade: 'A' },
    { id: 3, name: 'Ancient Indian History (DEHIS101)', credits: 4, grade: 'B+' },
    { id: 4, name: 'Environmental Studies (DEEVS101)', credits: 2, grade: 'O' },
    { id: 5, name: 'Computer Applications (DECAP101)', credits: 3, grade: 'A' }
  ]);

  const addCourse = () => {
    setCourses([
      ...courses,
      {
        id: Date.now(),
        name: `Course ${courses.length + 1}`,
        credits: 4,
        grade: 'A'
      }
    ]);
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const resetCourses = () => {
    setCourses([
      { id: 1, name: 'Course 1', credits: 4, grade: 'A' },
      { id: 2, name: 'Course 2', credits: 4, grade: 'A' },
      { id: 3, name: 'Course 3', credits: 4, grade: 'A' }
    ]);
  };

  // SGPA Calculation
  const totalCredits = courses.reduce((sum, c) => sum + Number(c.credits || 0), 0);
  const totalPoints = courses.reduce((sum, c) => sum + (Number(c.credits || 0) * (GRADE_POINTS[c.grade] || 0)), 0);
  const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  const percentage = totalCredits > 0 ? ((Number(sgpa) - 0.75) * 10).toFixed(1) : '0';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="max-w-2xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-semibold mb-2">
          <Calculator className="w-3.5 h-3.5" />
          <span>LPU 10-Point Grading System</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          LPU Distance B.A. SGPA & Percentage Calculator
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Calculate your Semester Grade Point Average (SGPA) and estimated percentage based on UGC & LPU credit weighting.
        </p>
      </div>

      {/* Result Highlight Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-tr from-orange-600 to-amber-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 sm:col-span-1">
          <span className="text-xs uppercase tracking-wider font-bold text-orange-100">Calculated SGPA</span>
          <div className="text-4xl sm:text-5xl font-black mt-2 tracking-tight">
            {sgpa}
          </div>
          <p className="text-xs text-orange-100 mt-2 font-medium">
            Based on {totalCredits} Total Semester Credits
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 sm:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              Approximate Percentage
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              {Number(sgpa) >= 8.0 ? 'First Division with Distinction' : Number(sgpa) >= 6.5 ? 'First Division' : 'Pass'}
            </span>
          </div>

          <div className="text-3xl font-black text-slate-900 dark:text-white my-2">
            {Math.max(0, Number(percentage))}%
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
            <span>Formula: Percentage = (SGPA - 0.75) × 10</span>
          </p>
        </div>
      </div>

      {/* Courses Input Table */}
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Semester Courses & Earned Grades
          </h3>
          <button
            onClick={resetCourses}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="space-y-3">
          {courses.map((course, idx) => (
            <div 
              key={course.id}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-700/60"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                  placeholder="Subject name"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">Credits:</span>
                  <select
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, 'credits', Number(e.target.value))}
                    className="bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">Grade:</span>
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                    className="bg-transparent text-xs font-bold text-orange-600 dark:text-orange-400 focus:outline-none"
                  >
                    {Object.keys(GRADE_POINTS).map(g => (
                      <option key={g} value={g}>{g} ({GRADE_POINTS[g]} pts)</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => removeCourse(course.id)}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Remove Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addCourse}
          className="mt-4 w-full py-2.5 rounded-2xl border-2 border-dashed border-stone-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Course</span>
        </button>
      </div>

    </div>
  );
}
