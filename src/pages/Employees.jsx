import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  User,
  Mail,
  X,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../utils/api";

// --- Status Badge ---
const StatusBadge = ({ status }) => {
  const isActive = status?.toUpperCase() === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
        isActive
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-rose-50 text-rose-700 border-rose-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-2 ${
          isActive ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      {status}
    </span>
  );
};

// --- Stat Card Component ---
const StatCard = ({ title, count, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{count}</p>
    </div>
  </div>
);

// --- Modern Modal ---
function EmployeeModal({ onClose, onSave, initialData }) {
  const [form, setForm] = useState(
    initialData || { name: "", email: "", salary: "", status: "ACTIVE", role: "EMPLOYEE" }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    onSave({ ...form, salary: Number(form.salary) || 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#0F3A53]">
            {initialData ? "Edit Employee" : "Add New Employee"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />
              <input
                placeholder="Ex: Rahul Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3A53] outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />
              <input
                type="email"
                placeholder="rahul@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3A53] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">
                Salary (₹)
              </label>
              <input
                type="number"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3A53] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3A53] outline-none"
              >
                <option value="EMPLOYEE">EMPLOYEE</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0F3A53] outline-none"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="OFFLINE">OFFLINE</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#0F3A53] hover:bg-[#0a2e42] text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              {initialData ? "Save Changes" : "Confirm Add"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchEmployees();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const isAdmin = currentUser?.role?.toUpperCase() === "ADMIN";

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.employees || [];
      setEmployees(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setEmployees([]);
    }
  };

  const handleAdd = async (emp) => {
    try {
      const res = await API.post("/employees", emp);
      setEmployees((prev) => [res.data.employee || res.data, ...prev]);
    } catch (err) {
      console.error("ADD ERROR:", err);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const res = await API.put(`/employees/${id}`, data);
      setEmployees((prev) =>
        prev.map((e) => (e._id === id ? res.data.employee || res.data : e))
      );
    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await API.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  // --- Calculations for Stats ---
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status?.toUpperCase() === "ACTIVE").length;
  const inactiveEmployees = employees.filter(
    (e) => e.status?.toUpperCase() === "OFFLINE"
  ).length;

  const filtered = employees.filter(
    (e) =>
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0F3A53] tracking-tight">
              Employees
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your organization's workforce
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => {
                setEditEmp(null);
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 bg-[#0F3A53] hover:bg-[#0a2e42] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg w-full sm:w-auto"
            >
              <Plus size={18} /> Add Employee
            </button>
          )}
        </div>

        {/* --- Stats Cards Section --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            count={totalEmployees}
            icon={Users}
            colorClass="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Active Now"
            count={activeEmployees}
            icon={CheckCircle}
            colorClass="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            title="Offline"
            count={inactiveEmployees}
            icon={AlertCircle}
            colorClass="bg-rose-50 text-rose-600"
          />
        </div>

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-3.5 text-slate-400"
              size={20}
            />
            <input
              placeholder="Search employee by name or email..."
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 outline-none text-slate-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-[#0F3A53] uppercase">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#0F3A53] uppercase">
                    Role
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#0F3A53] uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#0F3A53] uppercase">
                    Salary
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-4 text-xs font-bold text-[#0F3A53] uppercase text-right">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence>
                  {filtered.map((emp) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={emp._id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#0F3A53]/10 text-[#0F3A53] flex items-center justify-center font-bold text-sm">
                            {emp.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">
                              {emp.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {emp.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {emp.role?.toUpperCase() || "EMPLOYEE"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={emp.status} />
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        ₹{(emp.salary || 0).toLocaleString()}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => {
                                setEditEmp(emp);
                                setShowModal(true);
                              }}
                              className="p-2 text-slate-400 hover:text-[#0F3A53] hover:bg-[#0F3A53]/5 rounded-lg transition-all"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(emp._id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <EmployeeModal
          onClose={() => setShowModal(false)}
          onSave={(data) =>
            editEmp ? handleUpdate(editEmp._id, data) : handleAdd(data)
          }
          initialData={editEmp}
        />
      )}
    </div>
  );
}