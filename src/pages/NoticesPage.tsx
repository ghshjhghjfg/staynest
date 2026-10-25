import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Search,
  Plus,
  AlertTriangle,
  Calendar,
  X,
  Trash2,
  Edit,
  Tag,
  Users,
} from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { NoticeRecord } from '../types';
import { useAuth } from '../features/auth/AuthContext';
import { formatDate } from '../lib/formatters';

export const NoticesPage: React.FC = () => {
  const { role, currentUser } = useAuth();
  const [notices, setNotices] = useState<NoticeRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeRecord | null>(null);

  // Form State
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    body: '',
    category: 'General' as NoticeRecord['category'],
    target_audience: 'All Residents' as NoticeRecord['target_audience'],
    is_emergency: false,
  });

  const loadData = () => {
    setNotices(dataStore.getNotices());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('hostelease_store_updated', loadData);
    return () => window.removeEventListener('hostelease_store_updated', loadData);
  }, []);

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.body.trim()) {
      alert('Please fill out notice title and message body.');
      return;
    }

    if (editingNotice) {
      dataStore.updateNotice(editingNotice.id, {
        title: noticeForm.title.trim(),
        body: noticeForm.body.trim(),
        category: noticeForm.category,
        target_audience: noticeForm.target_audience,
        is_emergency: noticeForm.is_emergency,
      });
    } else {
      dataStore.addNotice({
        title: noticeForm.title.trim(),
        body: noticeForm.body.trim(),
        category: noticeForm.category,
        target_audience: noticeForm.target_audience,
        created_by: currentUser?.full_name || 'Hostel Administration',
        is_published: true,
        is_emergency: noticeForm.is_emergency,
      });
    }

    setShowAddModal(false);
    setEditingNotice(null);
    setNoticeForm({
      title: '',
      body: '',
      category: 'General',
      target_audience: 'All Residents',
      is_emergency: false,
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete announcement "${title}"?`)) {
      dataStore.deleteNotice(id);
    }
  };

  const canManageNotices = role === 'admin' || role === 'warden';

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || n.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0C1629]">Hostel Bulletin & Announcements</h2>
          <p className="text-xs text-[#727A84]">
            Official circulars for night curfews, fee reminders, festival holidays, and utility shut-offs
          </p>
        </div>

        {canManageNotices && (
          <button
            onClick={() => {
              setEditingNotice(null);
              setNoticeForm({
                title: '',
                body: '',
                category: 'General',
                target_audience: 'All Residents',
                is_emergency: false,
              });
              setShowAddModal(true);
            }}
            className="px-3.5 py-2 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Notice</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#D6DCE0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#727A84] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars and topics..."
            className="w-full pl-9 pr-3 py-2 bg-[#F0F3F3]/60 border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#727A84]">Notice Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-[#F0F3F3] border border-[#D6DCE0] rounded-md text-xs text-[#0C1629]"
          >
            <option value="ALL">All Circulars</option>
            <option value="General">General</option>
            <option value="Fees">Fees & Finance</option>
            <option value="Maintenance">Maintenance & Utilities</option>
            <option value="Mess">Mess & Catering</option>
            <option value="Holiday">Holidays & Vacations</option>
          </select>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-3.5">
        {filteredNotices.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-xl border transition-colors shadow-xs bg-white ${
              n.is_emergency
                ? 'border-l-4 border-l-[#B54747] border-t-[#D6DCE0] border-r-[#D6DCE0] border-b-[#D6DCE0]'
                : 'border-[#D6DCE0]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-[#D6DCE0]/60">
              <div className="flex items-center gap-2 flex-wrap">
                {n.is_emergency && (
                  <span className="px-2 py-0.5 rounded bg-[#B54747]/10 text-[#B54747] font-bold text-[10px] tracking-wide flex items-center gap-1 uppercase">
                    <AlertTriangle className="w-3 h-3" />
                    Urgent Alert
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-[#356B9A]/10 text-[#356B9A] text-[10px] font-semibold">
                  {n.category}
                </span>
                <span className="text-xs text-[#727A84] flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {n.target_audience}
                </span>
              </div>
              <span className="text-[11px] text-[#727A84] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(n.published_at)}
              </span>
            </div>

            <h3 className="mt-3 text-base font-bold text-[#0C1629]">{n.title}</h3>
            <p className="mt-2 text-xs text-[#0C1629] leading-relaxed whitespace-pre-line">{n.body}</p>

            <div className="mt-4 pt-3 border-t border-[#D6DCE0]/60 flex items-center justify-between text-[11px] text-[#727A84]">
              <span>Issued by: <strong className="text-[#0C1629]">{n.created_by}</strong></span>
              {canManageNotices && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingNotice(n);
                      setNoticeForm({
                        title: n.title,
                        body: n.body,
                        category: n.category,
                        target_audience: n.target_audience,
                        is_emergency: n.is_emergency,
                      });
                      setShowAddModal(true);
                    }}
                    className="text-[#356B9A] hover:underline flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(n.id, n.title)}
                    className="text-[#B54747] hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Notice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-[#D6DCE0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">
                {editingNotice ? 'Edit Circular Notice' : 'Publish New Notice'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#727A84] hover:text-[#0C1629]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveNotice} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory Resident Meeting on Sunday 6:00 PM"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Category</label>
                  <select
                    value={noticeForm.category}
                    onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  >
                    <option value="General">General</option>
                    <option value="Fees">Fees</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Mess">Mess</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Target Audience</label>
                  <select
                    value={noticeForm.target_audience}
                    onChange={(e) => setNoticeForm({ ...noticeForm, target_audience: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  >
                    <option value="All Residents">All Residents</option>
                    <option value="Students">Students Only</option>
                    <option value="Staff">Staff Only</option>
                    <option value="Wing A">Wing A Only</option>
                    <option value="Wing B">Wing B Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Notice Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Full text of the circular notice..."
                  value={noticeForm.body}
                  onChange={(e) => setNoticeForm({ ...noticeForm, body: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_emergency"
                  checked={noticeForm.is_emergency}
                  onChange={(e) => setNoticeForm({ ...noticeForm, is_emergency: e.target.checked })}
                  className="rounded border-[#D6DCE0]"
                />
                <label htmlFor="is_emergency" className="font-semibold text-[#B54747] text-xs cursor-pointer">
                  Mark as High-Priority Emergency Notice (Highlighted in red)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#D6DCE0]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#D6DCE0] rounded-md text-[#0C1629]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0C1629] text-white rounded-md font-semibold">
                  Publish to Notice Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
