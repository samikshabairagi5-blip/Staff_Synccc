import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import { Award, Star, CheckCircle, Target, TrendingUp, UserCheck, MessageSquare } from 'lucide-react';

export const PerformanceView: React.FC = () => {
  const { user } = useAuth();
  const { reviews } = useHRM();

  const userReview = reviews.find((r) => r.employeeId === user?.employeeId) || reviews[0];

  const ratingCategories = [
    { label: 'Technical Architecture & Execution', score: userReview?.categories.technicalSkills || 4.8 },
    { label: 'Cross-functional Communication', score: userReview?.categories.communication || 4.5 },
    { label: 'Punctuality & Reliability', score: userReview?.categories.punctuality || 4.7 },
    { label: 'Complex Problem Solving', score: userReview?.categories.problemSolving || 5.0 },
    { label: 'Teamwork & Collaborative Impact', score: userReview?.categories.teamwork || 4.6 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Performance Appraisal & OKR Objectives
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review supervisory evaluation, quarterly competency scores, key accomplishments, and growth goals.
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
              Evaluation Cycle: {userReview?.reviewPeriod || 'Q3 2026'}
            </span>
            <h2 className="text-2xl font-extrabold mt-2 tracking-tight">
              Performance Review Rating: {userReview?.rating} / 5.0
            </h2>
            <p className="text-xs text-indigo-200/80 mt-1 max-w-xl">
              Reviewed by <strong>{userReview?.reviewerName}</strong> on {userReview?.date}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(userReview?.rating || 5)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competencies Progress Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Competency Rating Breakdown
          </h3>

          <div className="space-y-4">
            {ratingCategories.map((cat) => (
              <div key={cat.label} className="space-y-1.5">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-700">{cat.label}</span>
                  <span className="font-bold text-indigo-700">{cat.score.toFixed(1)} / 5.0</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(cat.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manager Feedback & Recommendations */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            Manager Feedback & Evaluation Notes
          </h3>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
            <span className="font-bold text-emerald-900">Key Strengths Demonstrated:</span>
            <p className="text-slate-700 leading-relaxed">{userReview?.strengths}</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1">
            <span className="font-bold text-amber-900">Opportunities for Growth:</span>
            <p className="text-slate-700 leading-relaxed">{userReview?.areasForImprovement}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900">Executive Summary & Next Promotion Track:</span>
            <p className="text-slate-600 leading-relaxed italic">&ldquo;{userReview?.managerNotes}&rdquo;</p>
          </div>
        </div>
      </div>

      {/* Next Quarter Goals */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" />
          Quarterly Strategic Goals & OKRs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userReview?.goalsNextQuarter.map((goal, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
                {idx + 1}
              </div>
              <p className="text-slate-800 font-medium leading-snug">{goal}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
