import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import { Announcement } from '../../types/hrm';
import {
  BellRing,
  Plus,
  Pin,
  Trash2,
  Tag,
  AlertCircle,
  Clock,
  Building,
  User,
  X
} from 'lucide-react';

export const AnnouncementsModule: React.FC = () => {
  const { user, role } = useAuth();
  const { announcements, addAnnouncement, deleteAnnouncement, togglePinAnnouncement, departments } = useHRM();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [priority, setPriority] = useState<'urgent' | 'high' | 'normal'>('normal');
  const [tagsStr, setTagsStr] = useState('Policy, Update');
  const [isPinned, setIsPinned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addAnnouncement({
      title,
      content,
      department,
      priority,
      authorName: user?.name || 'HR Management',
      authorRole: user?.role === 'hr' ? 'VP of People & Culture' : 'Engineering Management',
      tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      isPinned
    });

    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setTagsStr('Policy, Update');
    setIsPinned(false);
  };

  const filteredAnnouncements = announcements
    .filter((a) => (filterPriority === 'all' ? true : a.priority === filterPriority))
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Corporate Announcements & Bulletins
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Broadcast strategic notices, holiday calendars, wellness benefits, and cross-departmental milestones.
          </p>
        </div>

        {(role === 'hr' || role === 'manager') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Post Announcement
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl font-semibold">
          {(['all', 'urgent', 'high', 'normal'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                filterPriority === p ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <span className="text-slate-400 font-mono text-[11px]">
          {filteredAnnouncements.length} bulletins active
        </span>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white rounded-2xl p-6 border transition-all duration-200 shadow-sm relative overflow-hidden ${
              ann.isPinned
                ? 'border-indigo-300 ring-2 ring-indigo-500/10'
                : 'border-slate-200/90'
            }`}
          >
            {ann.isPinned && (
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl flex items-center gap-1">
                <Pin className="w-3 h-3" /> Pinned
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1 pr-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      ann.priority === 'urgent'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : ann.priority === 'high'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ann.priority} Priority
                  </span>
                  <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                    <Building className="w-3 h-3" /> {ann.department}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ann.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug pt-1">{ann.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pt-1">
                  {ann.content}
                </p>
              </div>

              {(role === 'hr' || role === 'manager') && (
                <div className="flex sm:flex-col items-center gap-2 pt-2 sm:pt-0 shrink-0">
                  <button
                    onClick={() => togglePinAnnouncement(ann.id)}
                    className={`p-2 rounded-lg transition ${
                      ann.isPinned
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                    title={ann.isPinned ? 'Unpin' : 'Pin to Top'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this announcement?')) {
                        deleteAnnouncement(ann.id);
                      }
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Tags and Author */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {ann.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]"
                  >
                    <Tag className="w-2.5 h-2.5 text-slate-400" />
                    {t}
                  </span>
                ))}
              </div>

              <div className="text-slate-500 text-[11px]">
                Posted by <strong className="text-slate-800">{ann.authorName}</strong> ({ann.authorRole})
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Create New Announcement</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Headline Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Benefits Enrollment Now Open"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="All Departments">All Departments</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Bulletin Body Text</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detail the announcement, timeline, guidelines, and who to contact..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="e.g. Benefits, Q4, Policy, Urgent"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="pinCheck" className="text-slate-700 font-medium cursor-pointer">
                  Pin this bulletin to top of notice board
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20 transition"
                >
                  Broadcast Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
