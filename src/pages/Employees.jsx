import { useState, useEffect } from "react";
import { Edit2, Search, Plus, X, ChevronLeft, ChevronRight, UserCog, Mail, Shield, Circle, MoreHorizontal, Trash2 } from "lucide-react";

const INITIAL_EMPLOYEES = [
  { id: 1, name: "Amit Verma", email: "amit.verma@example.com", role: "admin", status: "Active", avatar: "https://i.pravatar.cc/150?u=amit" },
  { id: 2, name: "Priya Sharma", email: "priya.sharma@example.com", role: "manager", status: "Active", avatar: "https://i.pravatar.cc/150?u=priya" },
  { id: 3, name: "Rahul Singh", email: "rahul.singh@example.com", role: "sales", status: "Active", avatar: "https://i.pravatar.cc/150?u=rahul" },
  { id: 4, name: "Anjali Mehta", email: "anjali.mehta@example.com", role: "support", status: "Active", avatar: "https://i.pravatar.cc/150?u=anjali" },
  { id: 5, name: "Vikram Patel", email: "vikram.patel@example.com", role: "developer", status: "Active", avatar: "https://i.pravatar.cc/150?u=vikram" },
  { id: 6, name: "Neha Joshi", email: "neha.joshi@example.com", role: "sales", status: "Active", avatar: "https://i.pravatar.cc/150?u=neha" },
  { id: 7, name: "Arjun Desai", email: "arjun.desai@example.com", role: "support", status: "Offline", avatar: "https://i.pravatar.cc/150?u=arjun1" },
  { id: 8, name: "Vansh Sharma", email: "vansh.sharma@example.com", role: "developer", status: "Active", avatar: "https://i.pravatar.cc/150?u=vansh" },
  { id: 9, name: "Arjun Desai", email: "arjun.desai2@example.com", role: "support", status: "Inactive", avatar: "https://i.pravatar.cc/150?u=arjun2" },
  { id: 10, name: "Arjun Desai", email: "arjun.desai3@example.com", role: "support", status: "Active", avatar: "https://i.pravatar.cc/150?u=arjun3" },
];

const ROLES = ["admin", "manager", "sales", "support", "developer"];
const STATUSES = ["Active", "Inactive", "Offline"];
const ITEMS_PER_PAGE = 8;

const statusConfig = {
  Active:   { bg: "bg-emerald-500/10",    text: "text-emerald-600",     dot: "bg-emerald-500", shadow: "shadow-emerald-500/20" },
  Inactive: { bg: "bg-rose-500/10",       text: "text-rose-600",        dot: "bg-rose-500",    shadow: "shadow-rose-500/20" },
  Offline:  { bg: "bg-slate-500/10",      text: "text-slate-600",       dot: "bg-slate-500",   shadow: "shadow-slate-500/20" },
};

// ── Modals (Add & Edit) ──
function EmployeeModal({ onClose, onSave, employee = null }) {
  const [form, setForm] = useState(
    employee || { name: "", email: "", role: "support", status: "Active" }
  );
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    onSave({
      ...form,
      id: employee ? employee.id : Date.now(),
      avatar: employee ? employee.avatar : `https://i.pravatar.cc/150?u=${form.name}`,
    });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isAnimating ? "bg-slate-900/60 backdrop-blur-sm" : "bg-transparent"}`}>
      <div 
        className={`bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all duration-500 ${isAnimating ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-10"}`}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#0F3A53] tracking-tight">
              {employee ? "Edit Employee" : "New Team Member"}
            </h2>
            <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-bold opacity-60">
              Set permissions and details
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-rose-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-[#0F3A53] focus:ring-4 focus:ring-[#0F3A53]/5 rounded-2xl px-4 py-3 text-sm text-[#0F3A53] transition-all outline-none"
              />
            </div>
            
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-[#0F3A53] focus:ring-4 focus:ring-[#0F3A53]/5 rounded-2xl px-4 py-3 text-sm text-[#0F3A53] transition-all outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-[#0F3A53] rounded-2xl px-3 py-3 text-sm text-[#0F3A53] outline-none"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-[#0F3A53] rounded-2xl px-3 py-3 text-sm text-[#0F3A53] outline-none"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-500 rounded-2xl py-4 text-sm font-bold hover:bg-slate-200 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-br from-[#1E56A0] to-[#163172] text-white rounded-2xl py-4 text-sm font-bold shadow-xl shadow-blue-900/20 hover:shadow-blue-900/30 transition-all active:scale-95"
            >
              {employee ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Table Row Component for Animations ──
function EmployeeRow({ emp, onEdit, onDelete, index }) {
  const sc = statusConfig[emp.status] || statusConfig["Offline"];
  
  return (
    <tr 
      style={{ animationDelay: `${index * 50}ms` }}
      className="group hover:bg-slate-50/80 transition-all duration-300 border-b border-slate-100 last:border-0 animate-fade-in-up"
    >
      <td className="px-6 py-5">
        <div className="relative w-max">
          <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-[#1E56A0] focus:ring-offset-0 focus:ring-0 transition-all cursor-pointer appearance-none checked:bg-[#1E56A0] checked:border-transparent" />
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-white opacity-0 group-has-[:checked]:opacity-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><path d="M20 6L9 17L4 12" /></svg>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="relative group/avatar">
            <img
              src={emp.avatar}
              alt={emp.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 group-hover/avatar:ring-[#1E56A0]/30 transition-all duration-500"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${sc.dot} ${sc.shadow}`}></div>
          </div>
          <div>
            <span className="block font-black text-[#0F3A53] text-[15px] group-hover:text-[#1E56A0] transition-colors">{emp.name}</span>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
              <Shield size={10} className="text-slate-300" /> {emp.role}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-slate-500 hover:text-[#1E56A0] transition-colors cursor-default">
          <Mail size={14} className="opacity-40" />
          <span className="text-sm font-medium">{emp.email}</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest ${sc.bg} ${sc.text} transition-all group-hover:scale-105`}>
          <Circle size={8} fill="currentColor" className="animate-pulse" />
          {emp.status}
        </span>
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button 
            onClick={() => onEdit(emp)}
            title="Edit Employee"
            className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-[#1E56A0] hover:text-white transition-all shadow-sm hover:shadow-lg active:scale-90"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(emp.id)}
            title="Remove"
            className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm hover:shadow-lg active:scale-90"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function Employees() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [roleFilter, setRoleFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const filtered = employees.filter((emp) => {
    const matchRole = roleFilter === "All" || emp.role === roleFilter;
    const matchSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || 
                      emp.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSave = (emp) => {
    if (modalMode === 'edit') {
      setEmployees(prev => prev.map(p => p.id === emp.id ? emp : p));
    } else {
      setEmployees(prev => [emp, ...prev]);
    }
  };

  const handleEdit = (emp) => {
    setCurrentEmployee(emp);
    setModalMode('edit');
  };

  const handleDelete = (id) => {
    setEmployees((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 text-[#0F3A53] font-sans selection:bg-[#1E56A0]/10">
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}</style>

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-[#1E56A0]/10 rounded-xl text-[#1E56A0]">
              <UserCog size={24} />
            </div>
            <h1 className="text-3xl font-black text-[#0F3A53] tracking-tight">Your Team</h1>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest ml-11 opacity-70">
            {employees.length} Members total
          </p>
        </div>
        <button
          onClick={() => { setCurrentEmployee(null); setModalMode('add'); }}
          className="group flex items-center gap-3 bg-[#1E56A0] hover:bg-[#163172] text-white px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-2xl shadow-blue-900/40 hover:shadow-blue-900/60 hover:-translate-y-1 active:scale-95 animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          Add Employee
        </button>
      </div>

      {/* ── Search & Filter ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="md:col-span-8 group">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1E56A0] transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-white border-2 border-transparent focus:border-[#1E56A0]/20 rounded-3xl pl-16 pr-8 py-5 text-sm text-[#0F3A53] font-medium shadow-xl shadow-slate-200/50 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="md:col-span-4">
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="w-full bg-white border-2 border-transparent focus:border-[#1E56A0]/20 rounded-3xl px-8 py-5 text-sm text-[#0F3A53] font-black appearance-none shadow-xl shadow-slate-200/50 outline-none transition-all cursor-pointer"
          >
            <option value="All">All Roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(15,58,83,0.05)] border border-slate-100 overflow-hidden mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-6 w-10"></th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4 animate-bounce">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                        <Search size={32} />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matching members</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((emp, idx) => (
                  <EmployeeRow 
                    key={emp.id} 
                    emp={emp} 
                    index={idx}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between px-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center gap-4">
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
            Showing <span className="text-[#0F3A53]">{paginated.length}</span> of <span className="text-[#0F3A53]">{filtered.length}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-4 rounded-2xl border border-slate-200 text-slate-400 hover:bg-[#1E56A0] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-12 h-12 rounded-2xl text-xs font-black transition-all shadow-md active:scale-90 ${
                  page === i + 1 
                    ? "bg-[#1E56A0] text-white shadow-[#1E56A0]/20" 
                    : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="p-4 rounded-2xl border border-slate-200 text-slate-400 hover:bg-[#1E56A0] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all active:scale-90"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* ── Modal Rendering ── */}
      {modalMode && (
        <EmployeeModal 
          employee={currentEmployee}
          onClose={() => setModalMode(null)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
}
