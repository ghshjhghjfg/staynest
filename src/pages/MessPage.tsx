import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Star,
  Plus,
  CheckCircle2,
  Edit,
  Clock,
  Sparkles,
  MessageSquare,
  X,
} from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { MessMenu, FoodFeedback, StudentRecord } from '../types';
import { useAuth } from '../features/auth/AuthContext';

export const MessPage: React.FC = () => {
  const { role, currentUser } = useAuth();
  const [menus, setMenus] = useState<MessMenu[]>([]);
  const [feedbacks, setFeedbacks] = useState<FoodFeedback[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);

  const [activeDay, setActiveDay] = useState<MessMenu['day_of_week']>('Monday');
  const [editingMenu, setEditingMenu] = useState<MessMenu | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Feedback Form
  const [feedbackForm, setFeedbackForm] = useState({
    meal_type: 'Lunch' as FoodFeedback['meal_type'],
    rating: 5,
    category: 'Taste & Quality' as FoodFeedback['category'],
    comments: '',
  });

  const loadData = () => {
    setMenus(dataStore.getMessMenus());
    setFeedbacks(dataStore.getFoodFeedback());
    setStudents(dataStore.getStudents());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('staynest_store_updated', loadData);
    return () => window.removeEventListener('staynest_store_updated', loadData);
  }, []);

  const currentMenu = menus.find((m) => m.day_of_week === activeDay) || menus[0];

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenu) return;

    dataStore.updateMessMenu(editingMenu.id, {
      breakfast: editingMenu.breakfast,
      lunch: editingMenu.lunch,
      snacks: editingMenu.snacks,
      dinner: editingMenu.dinner,
      special_item: editingMenu.special_item,
    });

    setEditingMenu(null);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.comments.trim()) {
      alert('Please write comments for your dining feedback.');
      return;
    }

    const currentStudent = students.find((s) => s.email === currentUser?.email) || students[0];

    dataStore.addFoodFeedback({
      student_id: currentStudent.id,
      student_name: currentStudent.full_name,
      meal_type: feedbackForm.meal_type,
      date: new Date().toISOString().split('T')[0],
      rating: feedbackForm.rating,
      category: feedbackForm.category,
      comments: feedbackForm.comments,
    });

    setShowFeedbackModal(false);
    setFeedbackForm({
      meal_type: 'Lunch',
      rating: 5,
      category: 'Taste & Quality',
      comments: '',
    });
  };

  const handleToggleReviewed = (id: string) => {
    dataStore.toggleFeedbackReviewed(id);
  };

  const canEditMenu = role === 'admin' || role === 'warden' || role === 'staff';

  const days: MessMenu['day_of_week'][] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0C1629]">Mess & Dining Hall Management</h2>
          <p className="text-xs text-[#727A84]">
            Four-meal hygienic schedule, nutrition adherence, and resident food feedback
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="px-3.5 py-2 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Star className="w-3.5 h-3.5" />
            <span>Submit Meal Feedback</span>
          </button>
        </div>
      </div>

      {/* Days Tabs */}
      <div className="bg-white p-2 rounded-xl border border-[#D6DCE0] shadow-xs flex items-center gap-1 overflow-x-auto text-xs">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeDay === day
                ? 'bg-[#0C1629] text-white shadow-xs font-semibold'
                : 'text-[#727A84] hover:text-[#0C1629] hover:bg-[#F0F3F3]'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Menu Cards Grid */}
      {currentMenu && (
        <div className="bg-white rounded-xl border border-[#D6DCE0] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#D6DCE0]">
            <div>
              <h3 className="font-bold text-lg text-[#0C1629]">{currentMenu.day_of_week} Menu Schedule</h3>
              <p className="text-xs text-[#727A84]">Serving 250+ resident students daily</p>
            </div>
            {canEditMenu && (
              <button
                onClick={() => setEditingMenu({ ...currentMenu })}
                className="px-3 py-1.5 border border-[#D6DCE0] hover:bg-[#F0F3F3] text-[#0C1629] rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 text-[#727A84]" />
                <span>Edit Today's Menu</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Breakfast */}
            <div className="bg-[#F0F3F3] p-4 rounded-xl border border-[#D6DCE0] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#727A84] uppercase tracking-wider block">
                  Breakfast • 7:30 AM - 9:30 AM
                </span>
                <p className="mt-2 text-xs font-semibold text-[#0C1629] leading-relaxed">
                  {currentMenu.breakfast}
                </p>
              </div>
              <span className="text-[10px] text-[#287A52] font-medium mt-3 block">Tea & Coffee included</span>
            </div>

            {/* Lunch */}
            <div className="bg-[#F0F3F3] p-4 rounded-xl border border-[#D6DCE0] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#727A84] uppercase tracking-wider block">
                  Lunch • 12:30 PM - 2:30 PM
                </span>
                <p className="mt-2 text-xs font-semibold text-[#0C1629] leading-relaxed">
                  {currentMenu.lunch}
                </p>
              </div>
              <span className="text-[10px] text-[#287A52] font-medium mt-3 block">Unlimited rice & phulka</span>
            </div>

            {/* Snacks */}
            <div className="bg-[#F0F3F3] p-4 rounded-xl border border-[#D6DCE0] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#727A84] uppercase tracking-wider block">
                  Evening Snacks • 5:00 PM - 6:00 PM
                </span>
                <p className="mt-2 text-xs font-semibold text-[#0C1629] leading-relaxed">
                  {currentMenu.snacks}
                </p>
              </div>
              <span className="text-[10px] text-[#287A52] font-medium mt-3 block">Hot Masala Chai / Green Tea</span>
            </div>

            {/* Dinner */}
            <div className="bg-[#F0F3F3] p-4 rounded-xl border border-[#D6DCE0] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#727A84] uppercase tracking-wider block">
                  Dinner • 7:30 PM - 9:30 PM
                </span>
                <p className="mt-2 text-xs font-semibold text-[#0C1629] leading-relaxed">
                  {currentMenu.dinner}
                </p>
              </div>
              {currentMenu.special_item && (
                <span className="text-[10px] text-[#356B9A] font-bold mt-3 block">
                  ★ Special: {currentMenu.special_item}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Resident Feedback Section */}
      <div className="bg-white rounded-xl border border-[#D6DCE0] p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D6DCE0]">
          <div>
            <h3 className="font-bold text-sm text-[#0C1629]">Recent Student Dining Feedback</h3>
            <p className="text-xs text-[#727A84]">Continuous quality monitoring by Hostel Mess Committee</p>
          </div>
          <span className="text-xs text-[#727A84]">{feedbacks.length} submissions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="p-4 rounded-xl border border-[#D6DCE0] bg-[#F0F3F3]/50 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#0C1629]">{fb.student_name}</span>
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: fb.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#727A84]">
                <span>{fb.meal_type}</span>
                <span>•</span>
                <span>{fb.category}</span>
                <span>•</span>
                <span>{fb.date}</span>
              </div>
              <p className="text-[#0C1629] leading-relaxed italic">"{fb.comments}"</p>
              <div className="pt-2 border-t border-[#D6DCE0] flex items-center justify-between text-[10px]">
                <span
                  className={fb.reviewed_by_staff ? 'text-[#287A52] font-semibold' : 'text-[#727A84]'}
                >
                  {fb.reviewed_by_staff ? '✓ Reviewed by Mess Warden' : 'Pending review'}
                </span>
                {canEditMenu && (
                  <button
                    onClick={() => handleToggleReviewed(fb.id)}
                    className="text-[#356B9A] hover:underline font-semibold"
                  >
                    Toggle Reviewed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Menu Modal */}
      {editingMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-[#D6DCE0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">Edit Menu for {editingMenu.day_of_week}</h3>
              <button onClick={() => setEditingMenu(null)} className="text-[#727A84] hover:text-[#0C1629]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveMenu} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Breakfast Items</label>
                <input
                  type="text"
                  required
                  value={editingMenu.breakfast}
                  onChange={(e) => setEditingMenu({ ...editingMenu, breakfast: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Lunch Items</label>
                <input
                  type="text"
                  required
                  value={editingMenu.lunch}
                  onChange={(e) => setEditingMenu({ ...editingMenu, lunch: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Evening Snacks</label>
                <input
                  type="text"
                  required
                  value={editingMenu.snacks}
                  onChange={(e) => setEditingMenu({ ...editingMenu, snacks: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Dinner Items</label>
                <input
                  type="text"
                  required
                  value={editingMenu.dinner}
                  onChange={(e) => setEditingMenu({ ...editingMenu, dinner: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Special Item (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Ice cream, Biryani option, or Gulab Jamun"
                  value={editingMenu.special_item || ''}
                  onChange={(e) => setEditingMenu({ ...editingMenu, special_item: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#D6DCE0]">
                <button
                  type="button"
                  onClick={() => setEditingMenu(null)}
                  className="px-4 py-2 border border-[#D6DCE0] rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0C1629] text-white rounded-md font-semibold">
                  Publish Menu Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#D6DCE0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">Resident Dining Feedback</h3>
              <button onClick={() => setShowFeedbackModal(false)} className="text-[#727A84] hover:text-[#0C1629]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitFeedback} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Meal Session</label>
                  <select
                    value={feedbackForm.meal_type}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, meal_type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Rating (1 to 5 Stars)</label>
                  <select
                    value={feedbackForm.rating}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  >
                    <option value="5">★★★★★ (Excellent)</option>
                    <option value="4">★★★★☆ (Good)</option>
                    <option value="3">★★★☆☆ (Average)</option>
                    <option value="2">★★☆☆☆ (Below Expectation)</option>
                    <option value="1">★☆☆☆☆ (Poor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Feedback Category</label>
                <select
                  value={feedbackForm.category}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                >
                  <option value="Taste & Quality">Taste & Quality</option>
                  <option value="Hygiene">Hygiene & Cleanliness</option>
                  <option value="Portion Size">Portion Size</option>
                  <option value="Timeliness">Timeliness & Temperature</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Observations / Comments *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details so kitchen staff and mess committee can address it..."
                  value={feedbackForm.comments}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#D6DCE0]">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 border border-[#D6DCE0] rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0C1629] text-white rounded-md font-semibold">
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
