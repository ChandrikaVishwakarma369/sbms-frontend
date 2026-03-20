import { useState } from "react";
import { getInvoices, getInvoiceStats } from "../services/invoice.service";

// Status badge colors
const statusStyles = {
  PAID: "bg-green-100 text-green-700 border border-green-300",
  PENDING: "bg-yellow-100 text-[#d97706] border border-yellow-300",
  OVERDUE: "bg-red-100 text-[#dc2626] border border-red-300",
};

// Helpers
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatAmount = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;

// CSV Download
const downloadCSV = (data) => {
  const headers = [
    "Invoice ID",
    "Customer Name",
    "Date",
    "Subtotal",
    "GST",
    "Total",
    "Status",
  ];
  const rows = data.map((inv) => [
    inv.id,
    inv.customerName,
    new Date(inv.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    inv.subtotal,
    inv.gst,
    inv.total,
    inv.status,
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoices_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// Empty form
const emptyForm = {
  customerName: "",
  date: "",
  subtotal: "",
  gstPercent: "18",
  status: "PENDING",
};

// Main Component
export default function Invoices() {
  const [invoices, setInvoices] = useState(getInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // create modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // view modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // edit modal
  const [editInvoice, setEditInvoice] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});

  // Sirf state update karo (localStorage nahi)
  const updateInvoices = (newList) => {
    setInvoices(newList);
  };

  // Stats
  const { totalPaid, totalPending, totalOverdue } = getInvoiceStats(invoices);

  // Filtered list
  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All Status" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // GST preview (create)
  const subtotalNum = parseFloat(form.subtotal) || 0;
  const gstAmount = Math.round(
    (subtotalNum * (parseFloat(form.gstPercent) || 0)) / 100,
  );
  const totalPreview = subtotalNum + gstAmount;

  // GST preview (edit)
  const editSubtotalNum = parseFloat(editForm.subtotal) || 0;
  const editGstAmount = Math.round(
    (editSubtotalNum * (parseFloat(editForm.gstPercent) || 0)) / 100,
  );
  const editTotalPreview = editSubtotalNum + editGstAmount;

  // Create handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = "Customer name is required";
    if (!form.date) e.date = "Date is required";
    if (!form.subtotal || isNaN(form.subtotal) || Number(form.subtotal) <= 0)
      e.subtotal = "Enter a valid subtotal";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    updateInvoices([
      ...invoices,
      {
        id: `INV${String(invoices.length + 1).padStart(3, "0")}`,
        customerName: form.customerName.trim(),
        date: form.date,
        subtotal: subtotalNum,
        gst: gstAmount,
        total: totalPreview,
        status: form.status,
      },
    ]);
    setShowModal(false);
    setForm(emptyForm);
    setErrors({});
  };

  const handleClose = () => {
    setShowModal(false);
    setForm(emptyForm);
    setErrors({});
  };

  // Edit handlers
  const handleEditOpen = (inv) => {
    setEditInvoice(inv);
    setEditForm({
      customerName: inv.customerName,
      date: inv.date,
      subtotal: String(inv.subtotal),
      gstPercent:
        inv.gst > 0 ? String(Math.round((inv.gst / inv.subtotal) * 100)) : "18",
      status: inv.status,
    });
    setEditErrors({});
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    setEditErrors({ ...editErrors, [e.target.name]: "" });
  };

  const validateEdit = () => {
    const e = {};
    if (!editForm.customerName.trim())
      e.customerName = "Customer name is required";
    if (!editForm.date) e.date = "Date is required";
    if (
      !editForm.subtotal ||
      isNaN(editForm.subtotal) ||
      Number(editForm.subtotal) <= 0
    )
      e.subtotal = "Enter a valid subtotal";
    return e;
  };

  const handleEditSubmit = () => {
    const e = validateEdit();
    if (Object.keys(e).length) {
      setEditErrors(e);
      return;
    }

    updateInvoices(
      invoices.map((inv) =>
        inv.id === editInvoice.id
          ? {
              ...editInvoice,
              customerName: editForm.customerName.trim(),
              date: editForm.date,
              subtotal: editSubtotalNum,
              gst: editGstAmount,
              total: editTotalPreview,
              status: editForm.status,
            }
          : inv,
      ),
    );
    setEditInvoice(null);
    setEditForm({});
    setEditErrors({});
  };

  const handleEditClose = () => {
    setEditInvoice(null);
    setEditForm({});
    setEditErrors({});
  };

  // Reusable form fields
  const renderFormFields = (f, onChange, errs) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Customer Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="customerName"
          value={f.customerName}
          onChange={onChange}
          placeholder="e.g. Rahul Traders"
          className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] ${errs.customerName ? "border-red-400" : "border-gray-200"}`}
        />
        {errs.customerName && (
          <p className="text-red-500 text-xs mt-1">{errs.customerName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Invoice Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="date"
          value={f.date}
          onChange={onChange}
          className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] ${errs.date ? "border-red-400" : "border-gray-200"}`}
        />
        {errs.date && <p className="text-red-500 text-xs mt-1">{errs.date}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtotal (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="subtotal"
            value={f.subtotal}
            onChange={onChange}
            min="0"
            placeholder="e.g. 5000"
            className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] ${errs.subtotal ? "border-red-400" : "border-gray-200"}`}
          />
          {errs.subtotal && (
            <p className="text-red-500 text-xs mt-1">{errs.subtotal}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GST (%)
          </label>
          <select
            name="gstPercent"
            value={f.gstPercent}
            onChange={onChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] hover:cursor-pointer"
          >
            <option value="0">0%</option>
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18">18%</option>
            <option value="28">28%</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          name="status"
          value={f.status}
          onChange={onChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] hover:cursor-pointer"
        >
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="OVERDUE">OVERDUE</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        <p className="text-gray-500 text-sm mt-1">
          Create, view, and manage your billing transactions.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 flex items-center gap-2 bg-[#0F3A53] hover:cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <span className="text-lg leading-none">+</span> Create Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Paid (Month)</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {formatAmount(totalPaid)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Pending</p>
          <p className="text-2xl font-bold text-[#d97706] mt-1">
            {formatAmount(totalPending)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Overdue</p>
          <p className="text-2xl font-bold text-[#dc2626] mt-1">
            {formatAmount(totalOverdue)}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by ID or customer..."
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#0F3A53]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <select
              className="border border-gray-200 hover:cursor-pointer rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>PAID</option>
              <option>PENDING</option>
              <option>OVERDUE</option>
            </select>
            <button
              onClick={() => downloadCSV(filtered)}
              title="Download CSV"
              className="border border-gray-200 rounded-lg p-2 hover:cursor-pointer hover:bg-gray-50 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-8">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-gray-50 hover:bg-slate-100 transition"
                  >
                    <td className="py-3 px-4 font-medium text-gray-700">
                      {inv.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-300 text-[#0F3A53] flex items-center justify-center text-xs font-bold">
                          {inv.customerName.charAt(0)}
                        </div>
                        <span className="text-gray-700">
                          {inv.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {formatDate(inv.date)}
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-medium">
                      {formatAmount(inv.total)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[inv.status] || "bg-gray-100 text-gray-500"}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-3">
                        {/* View */}
                        <button
                          className="text-gray-400 hover:text-[#0F3A53] hover:cursor-pointer transition"
                          title="View"
                          onClick={() => setSelectedInvoice(inv)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        {/* Edit */}
                        <button
                          className="text-gray-400 hover:text-[#0F3A53] hover:cursor-pointer transition"
                          title="Edit"
                          onClick={() => handleEditOpen(inv)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>Showing {filtered.length} invoices</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#0F3A53] text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">
                Create New Invoice
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none hover:cursor-pointer"
              >
                ✕
              </button>
            </div>

            {renderFormFields(form, handleChange, errors)}

            {subtotalNum > 0 && (
              <div className="rounded-lg px-4 py-3 text-sm flex justify-between bg-slate-100 mt-4">
                <span className="text-gray-500">
                  GST ({form.gstPercent}%):{" "}
                  <strong>{formatAmount(gstAmount)}</strong>
                </span>
                <span className="font-bold text-[#0F3A53]">
                  Total: {formatAmount(totalPreview)}
                </span>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleClose}
                className="px-5 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 text-sm rounded-lg text-white bg-[#0F3A53] transition hover:opacity-90 hover:cursor-pointer"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW INVOICE DETAIL MODAL */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-[#0F3A53] flex items-center justify-center text-sm font-bold">
                  {selectedInvoice.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {selectedInvoice.customerName}
                  </h2>
                  <p className="text-xs text-gray-400">{selectedInvoice.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none hover:cursor-pointer"
              >
                ✕
              </button>
            </div>

            <hr className="border-gray-100 mb-4" />

            <div className="space-y-3 text-sm">
              {[
                ["Invoice ID", selectedInvoice.id],
                ["Customer", selectedInvoice.customerName],
                ["Date", formatDate(selectedInvoice.date)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-700">{value}</span>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[selectedInvoice.status] || "bg-gray-100 text-gray-500"}`}
                >
                  {selectedInvoice.status}
                </span>
              </div>
              <hr className="border-gray-100 my-1" />
              {[
                ["Subtotal", formatAmount(selectedInvoice.subtotal)],
                ["GST", formatAmount(selectedInvoice.gst)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-700">{value}</span>
                </div>
              ))}
              <div className="flex justify-between rounded-lg px-4 py-3 bg-slate-100 mt-2">
                <span className="font-semibold text-gray-700">
                  Total Amount
                </span>
                <span className="font-bold text-[#0F3A53] text-base">
                  {formatAmount(selectedInvoice.total)}
                </span>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 text-sm rounded-lg text-white bg-[#0F3A53] transition hover:opacity-90 hover:cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT INVOICE MODAL */}
      {editInvoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={handleEditClose}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Edit Invoice
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">{editInvoice.id}</p>
              </div>
              <button
                onClick={handleEditClose}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none hover:cursor-pointer"
              >
                ✕
              </button>
            </div>

            {renderFormFields(editForm, handleEditChange, editErrors)}

            {editSubtotalNum > 0 && (
              <div className="rounded-lg px-4 py-3 text-sm flex justify-between bg-slate-100 mt-4">
                <span className="text-gray-500">
                  GST ({editForm.gstPercent}%):{" "}
                  <strong>{formatAmount(editGstAmount)}</strong>
                </span>
                <span className="font-bold text-[#0F3A53]">
                  Total: {formatAmount(editTotalPreview)}
                </span>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleEditClose}
                className="px-5 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-5 py-2 text-sm rounded-lg text-white bg-[#0F3A53] transition hover:opacity-90 hover:cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
