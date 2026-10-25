import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  Search,
  Plus,
  UserCheck,
  UserX,
  History,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Building,
  Layers,
  LayoutGrid,
  List,
} from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { RoomRecord, RoomAllocation, StudentRecord } from '../types';
import { useAuth } from '../features/auth/AuthContext';

export const RoomsPage: React.FC = () => {
  const { role, currentUser } = useAuth();
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [allocations, setAllocations] = useState<RoomAllocation[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('ALL');
  const [floorFilter, setFloorFilter] = useState('ALL');

  // Modals
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Allocate form state
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [bedIdentifier, setBedIdentifier] = useState('Bed-1');
  const [allocateError, setAllocateError] = useState('');
  const [allocateSuccess, setAllocateSuccess] = useState('');

  // Add room form state
  const [newRoom, setNewRoom] = useState({
    building: 'Wing A',
    floor: 1,
    room_number: '',
    capacity: 2,
    room_type: 'Double' as RoomRecord['room_type'],
    notes: '',
  });

  const loadData = () => {
    setRooms(dataStore.getRooms());
    setAllocations(dataStore.getAllocations());
    setStudents(dataStore.getStudents());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('staynest_store_updated', loadData);
    return () => window.removeEventListener('staynest_store_updated', loadData);
  }, []);

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.room_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBuilding = buildingFilter === 'ALL' || r.building === buildingFilter;
    const matchesFloor = floorFilter === 'ALL' || String(r.floor) === floorFilter;
    return matchesSearch && matchesBuilding && matchesFloor;
  });

  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupied_beds, 0);
  const availableBeds = rooms.reduce((acc, r) => acc + r.available_beds, 0);

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    setAllocateError('');
    setAllocateSuccess('');

    if (!selectedStudentId || !selectedRoomId) {
      setAllocateError('Please select both a student and a target room.');
      return;
    }

    const result = dataStore.allocateStudentToRoom(
      selectedStudentId,
      selectedRoomId,
      bedIdentifier,
      currentUser?.full_name || 'Hostel Administrator'
    );

    if (result.success) {
      setAllocateSuccess(result.message);
      setTimeout(() => {
        setShowAllocateModal(false);
        setAllocateSuccess('');
      }, 1200);
    } else {
      setAllocateError(result.message);
    }
  };

  const handleRelease = (studentId: string, studentName: string) => {
    if (window.confirm(`Release bed allocation for ${studentName}?`)) {
      dataStore.releaseStudentBed(studentId);
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.room_number.trim()) {
      alert('Room number is required.');
      return;
    }

    dataStore.addRoom({
      building: newRoom.building,
      floor: Number(newRoom.floor),
      room_number: newRoom.room_number.trim(),
      capacity: Number(newRoom.capacity),
      room_type: newRoom.room_type,
      is_active: true,
      notes: newRoom.notes,
    });

    setShowAddRoomModal(false);
    setNewRoom({
      building: 'Wing A',
      floor: 1,
      room_number: '',
      capacity: 2,
      room_type: 'Double',
      notes: '',
    });
  };

  const handleExportCSV = () => {
    const headers = ['Room Number', 'Building', 'Floor', 'Capacity', 'Occupied Beds', 'Available Beds', 'Room Type', 'Status'];
    const rows = filteredRooms.map((r) => [
      r.room_number,
      r.building,
      r.floor,
      r.capacity,
      r.occupied_beds,
      r.available_beds,
      r.room_type,
      r.is_active ? 'Active' : 'Maintenance',
    ]);
    dataStore.exportToCSV('staynest_room_occupancy', headers, rows);
  };

  const activeAllocations = allocations.filter((a) => a.allocation_status === 'active');

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0C1629]">Room & Bed Management</h2>
          <p className="text-xs text-[#727A84]">
            {rooms.length} total rooms • {totalBeds} total beds ({occupiedBeds} occupied, {availableBeds} available)
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
            onClick={() => setShowHistoryModal(true)}
            className="px-3 py-2 bg-white hover:bg-[#F0F3F3] border border-[#D6DCE0] text-[#0C1629] rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-[#727A84]" />
            <span>Allocation History</span>
          </button>
          {(role === 'admin' || role === 'warden') && (
            <>
              <button
                onClick={() => setShowAddRoomModal(true)}
                className="px-3 py-2 bg-white hover:bg-[#F0F3F3] border border-[#D6DCE0] text-[#0C1629] rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#727A84]" />
                <span>Add Room</span>
              </button>
              <button
                onClick={() => {
                  setAllocateError('');
                  setAllocateSuccess('');
                  setShowAllocateModal(true);
                }}
                className="px-3.5 py-2 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Allocate Student</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Summary Stat Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#D6DCE0] shadow-xs">
          <span className="text-[11px] text-[#727A84]">Total Rooms</span>
          <p className="text-xl font-bold text-[#0C1629] mt-0.5">{rooms.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#D6DCE0] shadow-xs">
          <span className="text-[11px] text-[#727A84]">Total Bed Capacity</span>
          <p className="text-xl font-bold text-[#0C1629] mt-0.5">{totalBeds}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#D6DCE0] shadow-xs">
          <span className="text-[11px] text-[#727A84]">Occupied Beds</span>
          <p className="text-xl font-bold text-[#0C1629] mt-0.5">{occupiedBeds}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#D6DCE0] shadow-xs">
          <span className="text-[11px] text-[#727A84]">Available Beds</span>
          <p className="text-xl font-bold text-[#287A52] mt-0.5">{availableBeds}</p>
        </div>
      </div>

      {/* Filter and View Toggles */}
      <div className="bg-white p-3.5 rounded-xl border border-[#D6DCE0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#727A84] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search room number or wing..."
            className="w-full pl-9 pr-3 py-2 bg-[#F0F3F3]/60 border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden focus:border-[#0C1629]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-[#727A84]">Building:</span>
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F0F3F3] border border-[#D6DCE0] rounded-md text-xs text-[#0C1629]"
            >
              <option value="ALL">All Wings</option>
              <option value="Wing A">Wing A</option>
              <option value="Wing B">Wing B</option>
              <option value="Wing C">Wing C</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#727A84]">Floor:</span>
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F0F3F3] border border-[#D6DCE0] rounded-md text-xs text-[#0C1629]"
            >
              <option value="ALL">All Floors</option>
              <option value="1">1st Floor</option>
              <option value="2">2nd Floor</option>
              <option value="3">3rd Floor</option>
            </select>
          </div>

          <div className="flex items-center border border-[#D6DCE0] rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#0C1629] text-white' : 'bg-white text-[#727A84]'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 ${viewMode === 'table' ? 'bg-[#0C1629] text-white' : 'bg-white text-[#727A84]'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or Table View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const roomAllocations = activeAllocations.filter((a) => a.room_id === room.id);
            const isFull = room.available_beds === 0;

            return (
              <div
                key={room.id}
                className="bg-white rounded-xl border border-[#D6DCE0] p-4 shadow-xs flex flex-col justify-between hover:border-[#0C1629]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#D6DCE0]">
                    <div>
                      <span className="font-bold text-base text-[#0C1629]">{room.room_number}</span>
                      <span className="text-[11px] text-[#727A84] ml-2">
                        {room.building} • Fl {room.floor}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        isFull ? 'bg-[#B54747]/10 text-[#B54747]' : 'bg-[#287A52]/10 text-[#287A52]'
                      }`}
                    >
                      {isFull ? 'FULL' : `${room.available_beds} AVAILABLE`}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#727A84]">
                      <span>Type:</span>
                      <span className="font-semibold text-[#0C1629]">{room.room_type}</span>
                    </div>
                    <div className="flex justify-between text-[#727A84]">
                      <span>Bed Status:</span>
                      <span className="font-semibold text-[#0C1629]">
                        {room.occupied_beds} of {room.capacity} occupied
                      </span>
                    </div>
                  </div>

                  {/* Residents inside this room */}
                  <div className="mt-3 pt-2 border-t border-[#D6DCE0]">
                    <span className="text-[10px] font-semibold text-[#727A84] uppercase tracking-wider block mb-1">
                      Current Occupants
                    </span>
                    {roomAllocations.length === 0 ? (
                      <p className="text-[11px] text-[#727A84] italic">No active residents in this room.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {roomAllocations.map((alloc) => (
                          <div
                            key={alloc.id}
                            className="flex items-center justify-between p-1.5 rounded bg-[#F0F3F3] text-xs"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-medium text-[#0C1629] truncate leading-tight">{alloc.student_name}</p>
                              <p className="text-[10px] text-[#727A84]">{alloc.bed_identifier}</p>
                            </div>
                            {(role === 'admin' || role === 'warden') && (
                              <button
                                onClick={() => handleRelease(alloc.student_id, alloc.student_name)}
                                title="Release bed"
                                className="text-[10px] text-[#B54747] hover:underline shrink-0"
                              >
                                Release
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-[#D6DCE0] flex items-center justify-between text-[11px]">
                  <span className="text-[#727A84] truncate">{room.notes || 'No extra notes'}</span>
                  {!isFull && (role === 'admin' || role === 'warden') && (
                    <button
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        setShowAllocateModal(true);
                      }}
                      className="text-[#356B9A] font-semibold hover:underline shrink-0"
                    >
                      + Allocate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#D6DCE0] shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-[#0C1629]">
            <thead className="bg-[#F0F3F3] text-[#727A84] font-semibold border-b border-[#D6DCE0] uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Room No</th>
                <th className="py-3 px-4">Building & Floor</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Occupied</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4">Residents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6DCE0]/60">
              {filteredRooms.map((r) => {
                const occupants = activeAllocations.filter((a) => a.room_id === r.id);
                return (
                  <tr key={r.id} className="hover:bg-[#F0F3F3]/50">
                    <td className="py-3 px-4 font-bold text-[#0C1629]">{r.room_number}</td>
                    <td className="py-3 px-4">{r.building} • Floor {r.floor}</td>
                    <td className="py-3 px-4">{r.room_type}</td>
                    <td className="py-3 px-4">{r.capacity}</td>
                    <td className="py-3 px-4">{r.occupied_beds}</td>
                    <td className="py-3 px-4 font-bold text-[#287A52]">{r.available_beds}</td>
                    <td className="py-3 px-4">
                      {occupants.map((o) => o.student_name).join(', ') || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Allocate Student Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#D6DCE0] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">Allocate Student to Bed</h3>
              <button
                onClick={() => setShowAllocateModal(false)}
                className="p-1 rounded text-[#727A84] hover:text-[#0C1629]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {allocateError && (
              <div className="mt-3 p-2.5 rounded bg-[#B54747]/10 border border-[#B54747]/20 flex items-center gap-2 text-xs text-[#B54747]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{allocateError}</span>
              </div>
            )}

            {allocateSuccess && (
              <div className="mt-3 p-2.5 rounded bg-[#287A52]/10 border border-[#287A52]/20 flex items-center gap-2 text-xs text-[#287A52]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{allocateSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAllocate} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Select Student *</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs"
                >
                  <option value="">-- Choose Resident Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} ({s.student_code}) — Currently {s.room_number ? s.room_number : 'Unallocated'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Select Target Room *</label>
                <select
                  required
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs"
                >
                  <option value="">-- Choose Room with Available Bed --</option>
                  {rooms
                    .filter((r) => r.available_beds > 0)
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.room_number} ({r.building}, Fl {r.floor}) • {r.available_beds} beds free
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Bed Identifier *</label>
                <select
                  value={bedIdentifier}
                  onChange={(e) => setBedIdentifier(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs"
                >
                  <option value="Bed-1">Bed-1</option>
                  <option value="Bed-2">Bed-2</option>
                  <option value="Bed-3">Bed-3</option>
                  <option value="Bed-4">Bed-4</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#D6DCE0]">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="px-4 py-2 border border-[#D6DCE0] rounded-md text-[#0C1629]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0C1629] text-white rounded-md font-semibold hover:bg-[#1A2942]"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#D6DCE0] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">Add New Hostel Room</h3>
              <button
                onClick={() => setShowAddRoomModal(false)}
                className="p-1 rounded text-[#727A84] hover:text-[#0C1629]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Building Wing *</label>
                  <select
                    value={newRoom.building}
                    onChange={(e) => setNewRoom({ ...newRoom, building: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  >
                    <option value="Wing A">Wing A</option>
                    <option value="Wing B">Wing B</option>
                    <option value="Wing C">Wing C</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Floor Level *</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={newRoom.floor}
                    onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Room Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. C-303"
                  value={newRoom.room_number}
                  onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Bed Capacity *</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Room Type</label>
                  <select
                    value={newRoom.room_type}
                    onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                    <option value="Four Sharing">Four Sharing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Notes / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Attached washroom, study balcony"
                  value={newRoom.notes}
                  onChange={(e) => setNewRoom({ ...newRoom, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#D6DCE0]">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-4 py-2 border border-[#D6DCE0] rounded-md text-[#0C1629]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0C1629] text-white rounded-md font-semibold hover:bg-[#1A2942]"
                >
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocation History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-[#D6DCE0] animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">Historical Room Allocations</h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded text-[#727A84] hover:text-[#0C1629]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F0F3F3] text-[#727A84] text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Resident</th>
                    <th className="py-2.5 px-3">Room & Bed</th>
                    <th className="py-2.5 px-3">Allocated Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Allocated By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D6DCE0]/60">
                  {allocations.map((a) => (
                    <tr key={a.id} className="hover:bg-[#F0F3F3]/50">
                      <td className="py-2 px-3 font-semibold text-[#0C1629]">{a.student_name}</td>
                      <td className="py-2 px-3">{a.room_number} ({a.bed_identifier})</td>
                      <td className="py-2 px-3 text-[#727A84]">{new Date(a.allocated_at).toLocaleDateString()}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            a.allocation_status === 'active'
                              ? 'bg-[#287A52]/10 text-[#287A52]'
                              : 'bg-[#727A84]/15 text-[#727A84]'
                          }`}
                        >
                          {a.allocation_status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[#727A84]">{a.allocated_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
