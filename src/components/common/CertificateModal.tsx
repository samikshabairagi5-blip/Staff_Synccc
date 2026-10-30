import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Download, Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: {
    studentName: string;
    courseTitle: string;
    completionDate: string;
    certificateId: string;
    instructor: string;
  };
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificate
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if canvas unavailable
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Top action bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Corporate Certification • NexusHR Academy</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Area */}
        <div className="p-8 md:p-12 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 text-center relative">
          {/* Decorative frame */}
          <div className="border-4 border-double border-amber-300/80 rounded-xl p-8 md:p-10 relative">
            {/* Watermark / Logo */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-400 flex items-center justify-center text-amber-600 shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <span className="font-bold text-lg tracking-wider text-slate-800 uppercase">
                NexusHR Global Academy
              </span>
            </div>

            <p className="text-xs font-semibold tracking-widest text-amber-700 uppercase mb-2">
              Certificate of Professional Completion
            </p>
            <h2 className="text-sm text-slate-500 font-light mb-4">This is proudly awarded to</h2>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight mb-4 underline decoration-amber-300 underline-offset-8">
              {certificate.studentName}
            </h1>

            <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
              for successfully completing all rigorous training curricula, practical laboratory assessments, and verified milestones in
            </p>

            <div className="inline-block bg-slate-50 border border-slate-200/90 px-6 py-2.5 rounded-xl shadow-xs mb-8">
              <span className="text-base md:text-lg font-bold text-indigo-950">
                {certificate.courseTitle}
              </span>
            </div>

            {/* Signature & Serial Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200 text-xs items-end">
              <div>
                <p className="font-semibold text-slate-800">{certificate.instructor}</p>
                <div className="w-24 h-0.5 bg-slate-300 mx-auto my-1" />
                <p className="text-[11px] text-slate-500">Lead Curriculum Instructor</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-amber-400/20 border-2 border-amber-500 flex items-center justify-center shadow-inner mb-1">
                  <CheckCircle className="w-7 h-7 text-amber-600" />
                </div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">
                  Verified Authentic
                </span>
              </div>

              <div>
                <p className="font-semibold text-slate-800">{certificate.completionDate}</p>
                <div className="w-24 h-0.5 bg-slate-300 mx-auto my-1" />
                <p className="text-[11px] text-slate-500">Issued On</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Credential ID: <strong className="text-slate-600">{certificate.certificateId}</strong></span>
              <span>Verification URL: nexushr.io/verify/{certificate.certificateId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
