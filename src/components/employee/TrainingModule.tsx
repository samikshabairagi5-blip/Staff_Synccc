import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import { TrainingProgram } from '../../types/hrm';
import { CertificateModal } from '../common/CertificateModal';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  User,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const TrainingModule: React.FC = () => {
  const { user } = useAuth();
  const { trainings, enrollTraining, toggleModuleComplete } = useHRM();

  const [activeTab, setActiveTab] = useState<'my' | 'catalog'>('my');
  const [selectedCourse, setSelectedCourse] = useState<TrainingProgram | null>(null);
  const [certModalData, setCertModalData] = useState<{
    isOpen: boolean;
    studentName: string;
    courseTitle: string;
    completionDate: string;
    certificateId: string;
    instructor: string;
  }>({
    isOpen: false,
    studentName: '',
    courseTitle: '',
    completionDate: '',
    certificateId: '',
    instructor: ''
  });

  // Calculate enrolled courses for current user
  const enrolledTrainings = trainings.filter((t) =>
    t.enrolledEmployeeIds.includes(user?.id || '')
  );

  const availableTrainings = trainings.filter(
    (t) => !t.enrolledEmployeeIds.includes(user?.id || '')
  );

  const handleOpenCertificate = (course: TrainingProgram) => {
    setCertModalData({
      isOpen: true,
      studentName: user?.name || 'Valued Team Member',
      courseTitle: course.title,
      completionDate: course.completionDate || new Date().toISOString().split('T')[0],
      certificateId: course.certificateId || `NX-CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      instructor: course.instructor
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Corporate Training & Certifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upskill through enterprise curricula, track module milestones, and earn verifiable certifications.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('my')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'my'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Learning ({enrolledTrainings.length})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'catalog'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Course Catalog ({availableTrainings.length})
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Course Cards */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'my' ? (
            enrolledTrainings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                <p className="font-semibold text-slate-700 text-sm">No courses enrolled yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Explore the corporate catalog to enroll in high-impact skill paths.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              enrolledTrainings.map((course) => {
                const completedModules = course.modules.filter((m) => m.completed).length;
                const totalModules = course.modules.length;
                const progressPct = Math.round((completedModules / totalModules) * 100);
                const isSelected = selectedCourse?.id === course.id;

                return (
                  <div
                    key={course.id}
                    className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-sm ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/10'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            {course.category}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {course.durationHours} hrs total
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{course.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                      </div>

                      {/* Status / Certificate badge */}
                      {course.status === 'completed' ? (
                        <button
                          onClick={() => handleOpenCertificate(course)}
                          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition shadow-xs"
                        >
                          <Award className="w-4 h-4 text-amber-600" />
                          View Certificate
                        </button>
                      ) : (
                        <span className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start">
                          In Progress
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-600 font-medium">
                          Progress: <strong>{completedModules}</strong> of {totalModules} modules ({progressPct}%)
                        </span>
                        <span className="font-bold text-indigo-600">{progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            progressPct === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Action to view modules */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Instructor: <strong>{course.instructor}</strong></span>
                      </div>
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        {isSelected ? 'Viewing Modules below' : 'Open Curriculum Modules'}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            /* Catalog tab */
            availableTrainings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-3" />
                <p className="font-semibold text-slate-700 text-sm">All courses enrolled!</p>
                <p className="text-xs text-slate-400 mt-1">
                  You have enrolled in every available curriculum in the company catalog.
                </p>
              </div>
            ) : (
              availableTrainings.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-slate-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                          {course.category}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {course.durationHours} hrs
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{course.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{course.description}</p>
                    </div>

                    <button
                      onClick={() => enrollTraining(course.id)}
                      className="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition self-start"
                    >
                      Enroll in Course
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Instructor: <strong>{course.instructor}</strong></span>
                    <span>{course.modules.length} lessons & laboratory exercises</span>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Right col: Interactive Module Checklist / Detail Drawer */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Interactive Lesson Checklist
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {selectedCourse
                ? selectedCourse.title
                : 'Select an enrolled course on the left to track & complete lessons'}
            </p>

            {selectedCourse ? (
              <div className="space-y-3">
                {selectedCourse.modules.map((mod, idx) => (
                  <div
                    key={mod.id}
                    onClick={() => toggleModuleComplete(selectedCourse.id, mod.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                      mod.completed
                        ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70'
                    }`}
                  >
                    <button className="mt-0.5 shrink-0">
                      {mod.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold leading-tight">
                          {idx + 1}. {mod.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">{mod.summary}</p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        Duration: {mod.durationMinutes} mins
                      </span>
                    </div>
                  </div>
                ))}

                {selectedCourse.modules.every((m) => m.completed) && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-center">
                    <Sparkles className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                    <p className="font-bold text-xs text-amber-900">Curriculum Completed!</p>
                    <p className="text-[11px] text-amber-700 mt-0.5 mb-2">
                      All laboratory modules verified. Your certificate has been issued.
                    </p>
                    <button
                      onClick={() => handleOpenCertificate(selectedCourse)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition"
                    >
                      View & Print Certificate
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Click &ldquo;Open Curriculum Modules&rdquo; on any course to preview lessons and mark completion.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certModalData.isOpen}
        onClose={() => setCertModalData({ ...certModalData, isOpen: false })}
        certificate={certModalData}
      />
    </div>
  );
};
