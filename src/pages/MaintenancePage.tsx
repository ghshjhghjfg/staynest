import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  X,
  Download,
  AlertCircle,
  Hammer,
} from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { MaintenanceTask } from '../types';
import { useAuth } from '../features/auth/AuthContext';
import { getStatusBadgeClasses, formatINR } from '../lib/formatters';

export const MaintenancePage: React.FC = () => {
  const { role, currentUser } = useAuth();
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [updatingTask, setUpdatingTask] = useState<MaintenanceTask | null>(null);

  // New Task Form
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    category: 'Plumbing' as MaintenanceTask['category'],
    location: '',
    priority: 'Medium' as MaintenanceTask['priority'],
    assigned_to: '',
    cost: 0,
  });

  // Update Form
  const [updateStatus, setUpdateStatus] = useState<MaintenanceTask['status']>('In Progress');
  const [completionNotes, setCompletionNotes] = useState('');
  const [actualCost, setActualCost] = useState(0);

  const loadData = () => {
    setTasks(dataStore.getMaintenanceTasks());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('staynest_store_updated', loadData);
    return () => window.removeEventListener('staynest_store_updated', loadData);
  }, []);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      alert('Task title is required.');
      return;
    }

    dataStore.addMaintenanceTask({
      title: taskForm.title.trim(),
      description: taskForm.description,
      category: taskForm.category,
      location: taskForm.location || 'Wing A',
      priority: taskForm.priority,
      assigned_to: taskForm.assigned_to || 'Estate Maintenance Team',
      created_by: currentUser?.full_name || 'Hostel Warden',
      cost: Number(taskForm.cost) || 0,
    });

    setShowAddModal(false);
    setTaskForm({
      title: '',
      description: '',
      category: 'Plumbing',
      location: '',
      priority: 'Medium',
      assigned_to: '',
      cost: 0,
    });
  };

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingTask) return;

    dataStore.updateMaintenanceTask(updatingTask.id, {
      status: updateStatus,
      notes: completionNotes || updatingTask.notes,
      cost: actualCost || updatingTask.cost,
      completed_at: updateStatus === 'Completed' ? new Date().toISOString() : undefined,
    });

    setUpdatingTask(null);
  };

  const handleExportCSV = () => {
    const headers = ['Task ID', 'Title', 'Category', 'Location', 'Priority', 'Status', 'Assigned To', 'Cost (INR)', 'Created At'];
    const rows = tasks.map((t) => [
      t.id,
      t.title,
      t.category,
      t.location,
      t.priority,
      t.status,
      t.assigned_to || 'Unassigned',
      t.cost || 0,
      t.created_at,
    ]);
    dataStore.exportToCSV('staynest_maintenance_tasks', headers, rows);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0C1629]">Hostel Infrastructure & Maintenance</h2>
          <p className="text-xs text-[#727A84]">
            Schedule electrical repairs, geyser servicing, plumbing fixtures, and civil upkeep
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white hover:bg-[#F0F3F3] border border-[#D6DCE0] text-[#0C1629] rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#727A84]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Maintenance Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#D6DCE0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#727A84] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search task title, location, technician..."
            className="w-full pl-9 pr-3 py-2 bg-[#F0F3F3]/60 border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[#727A84]">Trade:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F0F3F3] border border-[#D6DCE0] rounded-md text-xs text-[#0C1629]"
            >
              <option value="ALL">All Trades</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="HVAC / Fan">HVAC / Fan</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Civil & Painting">Civil & Painting</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#727A84]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F0F3F3] border border-[#D6DCE0] rounded-md text-xs text-[#0C1629]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-[#D6DCE0] p-4 shadow-xs flex flex-col justify-between hover:border-[#0C1629]/40 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#D6DCE0]">
                <div>
                  <span className="font-bold text-sm text-[#0C1629] block">{t.title}</span>
                  <span className="text-[11px] text-[#727A84]">{t.location}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusBadgeClasses(t.status)}`}>
                  {t.status}
                </span>
              </div>

              <p className="mt-2.5 text-xs text-[#0C1629] leading-relaxed">{t.description}</p>

              <div className="mt-3 space-y-1 text-[11px] text-[#727A84]">
                <p>
                  Trade: <strong className="text-[#0C1629]">{t.category}</strong> • Priority:{' '}
                  <span className="text-[#B54747] font-semibold">{t.priority}</span>
                </p>
                <p>
                  Assigned: <span className="text-[#0C1629] font-medium">{t.assigned_to || 'Unassigned'}</span>
                </p>
                {t.cost ? (
                  <p>
                    Cost: <strong className="text-[#0C1629]">{formatINR(t.cost)}</strong>
                  </p>
                ) : null}
                {t.notes && (
                  <div className="p-2 bg-[#F0F3F3] rounded text-[10px] text-[#0C1629] mt-2">
                    <span className="font-semibold block">Tech Note:</span>
                    {t.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-[#D6DCE0] flex items-center justify-between text-[11px]">
              <span className="text-[#727A84]">{new Date(t.created_at).toLocaleDateString()}</span>
              <button
                onClick={() => {
                  setUpdatingTask(t);
                  setUpdateStatus(t.status);
                  setCompletionNotes(t.notes || '');
                  setActualCost(t.cost || 0);
                }}
                className="text-[#356B9A] font-semibold hover:underline cursor-pointer"
              >
                Update Progress
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#D6DCE0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">Create Maintenance Job</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#727A84] hover:text-[#0C1629]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roof water tank descaling & valve service"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Category / Trade</label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="HVAC / Fan">HVAC / Fan</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Civil & Painting">Civil & Painting</option>
                    <option value="Appliance">Appliance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Location Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wing A Roof Terrace or Corridor L2"
                  value={taskForm.location}
                  onChange={(e) => setTaskForm({ ...taskForm, location: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Assign Staff / Vendor</label>
                  <input
                    type="text"
                    placeholder="e.g. Plumber - Shanker"
                    value={taskForm.assigned_to}
                    onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Est. Cost (INR)</label>
                  <input
                    type="number"
                    value={taskForm.cost}
                    onChange={(e) => setTaskForm({ ...taskForm, cost: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Job Description</label>
                <textarea
                  rows={3}
                  placeholder="Parts needed, issue root cause, safety precautions..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Progress Modal */}
      {updatingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#D6DCE0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">Update Task Progress</h3>
              <button onClick={() => setUpdatingTask(null)} className="text-[#727A84] hover:text-[#0C1629]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateTask} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Task Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                >
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Final Incurred Cost (INR)</label>
                <input
                  type="number"
                  value={actualCost}
                  onChange={(e) => setActualCost(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Completion Notes / Spares Used</label>
                <textarea
                  rows={3}
                  placeholder="Record work completion details, warranty, or test run results..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#D6DCE0]">
                <button
                  type="button"
                  onClick={() => setUpdatingTask(null)}
                  className="px-4 py-2 border border-[#D6DCE0] rounded-md text-[#0C1629]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0C1629] text-white rounded-md font-semibold">
                  Save Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
