import { useState } from "react";
import { getInvoices, getInvoiceStats } from "../services/invoice.service";

const statusStyles = {
  PAID: "bg-green-100 text-green-700 border border-green-300",
  PENDING: "bg-yellow-100 text-[#d97706] border border-yellow-300",
  OVERDUE: "bg-red-100 text-[#dc2626] border border-red-300",
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatAmount = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;

const getEffectiveStatus = (inv) => {
  if (
    inv.status === "PENDING" &&
    inv.dueDate &&
    new Date(inv.dueDate) < new Date(new Date().toDateString())
  ) {
    return "OVERDUE";
  }
  return inv.status;
};

const getDaysOverdue = (dueDate) => {
  const diff = new Date() - new Date(dueDate);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// ✅ Line items se subtotal calculate karo
const calcSubtotal = (items) =>
  items.reduce((sum, item) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    return sum + qty * rate;
  }, 0);

const emptyItem = () => ({ name: "", qty: "1", rate: "" });

const downloadCSV = (data) => {
  const headers = [
    "Invoice ID",
    "Customer Name",
    "Date",
    "Due Date",
    "Items",
    "Subtotal",
    "GST",
    "Total",
    "Status",
    "Payment Method",
    "Notes",
  ];
  const rows = data.map((inv) => [
    inv.id,
    inv.customerName,
    new Date(inv.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    inv.dueDate
      ? new Date(inv.dueDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",
    // ✅ Items ko readable format mein
    (inv.items || [])
      .map((it) => `${it.name} x${it.qty} @₹${it.rate}`)
      .join(" | "),
    inv.subtotal,
    inv.gst,
    inv.total,
    getEffectiveStatus(inv),
    inv.paymentMethod || "",
    inv.notes || "",
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

const emptyForm = {
  customerName: "",
  date: "",
  dueDate: "",
  items: [emptyItem()],   // ✅ subtotal hata, items aaya
  gstPercent: "18",
  status: "PENDING",
  paymentMethod: "",
  notes: "",
};

export default function Invoices() {
  const [invoices, setInvoices] = useState(getInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [editInvoice, setEditInvoice] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const updateInvoices = (newList) => setInvoices(newList);

  const { totalPaid, totalPending, totalOverdue } = getInvoiceStats(invoices);

  const filtered = invoices.filter((inv) => {
    const effectiveStatus = getEffectiveStatus(inv);
    const matchSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All Status" || effectiveStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  // ✅ Create form — subtotal ab items se
  const subtotalNum = Math.round(calcSubtotal(form.items || []));
  const gstAmount = Math.round(
    (subtotalNum * (parseFloat(form.gstPercent) || 0)) / 100,
  );
  const totalPreview = subtotalNum + gstAmount;

  // ✅ Edit form — subtotal ab items se
  const editSubtotalNum = Math.round(calcSubtotal(editForm.items || []));
  const editGstAmount = Math.round(
    (editSubtotalNum * (parseFloat(editForm.gstPercent) || 0)) / 100,
  );
  const editTotalPreview = editSubtotalNum + editGstAmount;

  // ── Create handlers ──────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Item field change handler
  const handleItemChange = (index, field, value) => {
    const updated = form.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setForm({ ...form, items: updated });
    // Clear item-level error on change
    if (errors[`item_${index}_${field}`]) {
      setErrors({ ...errors, [`item_${index}_${field}`]: "" });
    }
  };

  const handleAddItem = () => {
    setForm({ ...form, items: [...form.items, emptyItem()] });
  };

  const handleRemoveItem = (index) => {
    if (form.items.length === 1) return; // kam se kam 1 item zaroori
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = "Customer name is required";
    if (!form.date) e.date = "Date is required";
    if (
      form.dueDate &&
      form.date &&
      new Date(form.dueDate) < new Date(form.date)
    )
      e.dueDate = "Due date cannot be before invoice date";

    // ✅ Validate each item
    form.items.forEach((item, i) => {
      if (!item.name.trim())
        e[`item_${i}_name`] = "Product name required";
      if (!item.qty || isNaN(item.qty) || Number(item.qty) <= 0)
        e[`item_${i}_qty`] = "Invalid qty";
      if (!item.rate || isNaN(item.rate) || Number(item.rate) <= 0)
        e[`item_${i}_rate`] = "Invalid rate";
    });

    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    const cleanItems = form.items.map((item) => ({
      name: item.name.trim(),
      qty: parseFloat(item.qty),
      rate: parseFloat(item.rate),
      amount: Math.round(parseFloat(item.qty) * parseFloat(item.rate)),
    }));

    updateInvoices([
      ...invoices,
      {
        id: `INV${String(invoices.length + 1).padStart(3, "0")}`,
        customerName: form.customerName.trim(),
        date: form.date,
        dueDate: form.dueDate || null,
        items: cleanItems,              // ✅ items save
        subtotal: subtotalNum,
        gst: gstAmount,
        total: totalPreview,
        status: form.status,
        paymentMethod: form.paymentMethod || null,
        notes: form.notes.trim() || null,
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

  // ── Edit handlers ────────────────────────────────────────────
  const handleEditOpen = (inv) => {
    setEditInvoice(inv);
    setEditForm({
      customerName: inv.customerName,
      date: inv.date,
      dueDate: inv.dueDate || "",
      // ✅ Purane invoices mein items nahi hain toh subtotal se ek default item bana do
      items:
        inv.items && inv.items.length > 0
          ? inv.items.map((it) => ({
              name: it.name,
              qty: String(it.qty),
              rate: String(it.rate),
            }))
          : [{ name: "Service", qty: "1", rate: String(inv.subtotal) }],
      gstPercent:
        inv.gst > 0 ? String(Math.round((inv.gst / inv.subtotal) * 100)) : "18",
      status: inv.status,
      paymentMethod: inv.paymentMethod || "",
      notes: inv.notes || "",
    });
    setEditErrors({});
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    setEditErrors({ ...editErrors, [e.target.name]: "" });
  };

  const handleEditItemChange = (index, field, value) => {
    const updated = editForm.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setEditForm({ ...editForm, items: updated });
    if (editErrors[`item_${index}_${field}`]) {
      setEditErrors({ ...editErrors, [`item_${index}_${field}`]: "" });
    }
  };

  const handleEditAddItem = () => {
    setEditForm({ ...editForm, items: [...editForm.items, emptyItem()] });
  };

  const handleEditRemoveItem = (index) => {
    if (editForm.items.length === 1) return;
    setEditForm({
      ...editForm,
      items: editForm.items.filter((_, i) => i !== index),
    });
  };

  const validateEdit = () => {
    const e = {};
    if (!editForm.customerName.trim())
      e.customerName = "Customer name is required";
    if (!editForm.date) e.date = "Date is required";
    if (
      editForm.dueDate &&
      editForm.date &&
      new Date(editForm.dueDate) < new Date(editForm.date)
    )
      e.dueDate = "Due date cannot be before invoice date";

    editForm.items.forEach((item, i) => {
      if (!item.name.trim()) e[`item_${i}_name`] = "Product name required";
      if (!item.qty || isNaN(item.qty) || Number(item.qty) <= 0)
        e[`item_${i}_qty`] = "Invalid qty";
      if (!item.rate || isNaN(item.rate) || Number(item.rate) <= 0)
        e[`item_${i}_rate`] = "Invalid rate";
    });

    return e;
  };

  const handleEditSubmit = () => {
    const e = validateEdit();
    if (Object.keys(e).length) {
      setEditErrors(e);
      return;
    }

    const cleanItems = editForm.items.map((item) => ({
      name: item.name.trim(),
      qty: parseFloat(item.qty),
      rate: parseFloat(item.rate),
      amount: Math.round(parseFloat(item.qty) * parseFloat(item.rate)),
    }));

    updateInvoices(
      invoices.map((inv) =>
        inv.id === editInvoice.id
          ? {
              ...editInvoice,
              customerName: editForm.customerName.trim(),
              date: editForm.date,
              dueDate: editForm.dueDate || null,
              items: cleanItems,
              subtotal: editSubtotalNum,
              gst: editGstAmount,
              total: editTotalPreview,
              status: editForm.status,
              paymentMethod: editForm.paymentMethod || null,
              notes: editForm.notes.trim() || null,
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

  // ✅ Reusable line items section
  const renderLineItems = (items, onItemChange, onAdd, onRemove, errs) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Products / Services <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs text-[#0F3A53] font-medium hover:underline hover:cursor-pointer"
        >
          + Add Item
        </button>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-12 gap-1 mb-1 px-1">
        <span className="col-span-5 text-xs text-gray-400">Product / Service</span>
        <span className="col-span-2 text-xs text-gray-400">Qty</span>
        <span className="col-span-3 text-xs text-gray-400">Rate (₹)</span>
        <span className="col-span-2 text-xs text-gray-400 text-right">Amt</span>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => {
          const amt = Math.round((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0));
          const hasErr =
            errs[`item_${i}_name`] ||
            errs[`item_${i}_qty`] ||
            errs[`item_${i}_rate`];
          return (
            <div key={i}>
              <div className="grid grid-cols-12 gap-1 items-center">
                {/* Name */}
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => onItemChange(i, "name", e.target.value)}
                  placeholder="e.g. Web Design"
                  className={`col-span-5 border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F3A53] ${errs[`item_${i}_name`] ? "border-red-400" : "border-gray-200"}`}
                />
                {/* Qty */}
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => onItemChange(i, "qty", e.target.value)}
                  min="0.01"
                  step="0.01"
                  className={`col-span-2 border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F3A53] ${errs[`item_${i}_qty`] ? "border-red-400" : "border-gray-200"}`}
                />
                {/* Rate */}
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => onItemChange(i, "rate", e.target.value)}
                  min="0"
                  placeholder="0"
                  className={`col-span-3 border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F3A53] ${errs[`item_${i}_rate`] ? "border-red-400" : "border-gray-200"}`}
                />
                {/* Amount + remove */}
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <span className="text-xs font-medium text-gray-700">
                    {amt > 0 ? `₹${amt.toLocaleString("en-IN")}` : "—"}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemove(i)}
                      className="text-gray-300 hover:text-red-400 hover:cursor-pointer text-base leading-none ml-1"
                      title="Remove"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              {/* Inline errors per row */}
              {hasErr && (
                <p className="text-red-500 text-xs mt-0.5 pl-1">
                  {errs[`item_${i}_name`] ||
                    errs[`item_${i}_qty`] ||
                    errs[`item_${i}_rate`]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Reusable form fields
  const renderFormFields = (f, onChange, errs, onItemChange, onAdd, onRemove) => {
    const sub = Math.round(calcSubtotal(f.items || []));
    const gst = Math.round((sub * (parseFloat(f.gstPercent) || 0)) / 100);
    const tot = sub + gst;

    return (
      <div className="space-y-4">
        {/* Customer Name */}
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

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
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
            {errs.date && (
              <p className="text-red-500 text-xs mt-1">{errs.date}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={f.dueDate}
              onChange={onChange}
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] ${errs.dueDate ? "border-red-400" : "border-gray-200"}`}
            />
            {errs.dueDate && (
              <p className="text-red-500 text-xs mt-1">{errs.dueDate}</p>
            )}
          </div>
        </div>

        {/* ✅ Line Items */}
        <div className="border border-gray-100 rounded-xl p-3 bg-slate-50">
          {renderLineItems(f.items, onItemChange, onAdd, onRemove, errs)}

          {/* Subtotal preview inside items box */}
          {sub > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span>
                <span>{formatAmount(sub)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>GST ({f.gstPercent}%)</span>
                <span>{formatAmount(gst)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#0F3A53]">
                <span>Total</span>
                <span>{formatAmount(tot)}</span>
              </div>
            </div>
          )}
        </div>

        {/* GST + Status + Payment */}
        <div className="grid grid-cols-2 gap-3">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            name="paymentMethod"
            value={f.paymentMethod}
            onChange={onChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] hover:cursor-pointer"
          >
            <option value="">— Select —</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Card">Card</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes / Description
          </label>
          <textarea
            name="notes"
            value={f.notes}
            onChange={onChange}
            rows={2}
            placeholder="e.g. Thank you for your business"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] resize-none"
          />
        </div>
      </div>
    );
  };

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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
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
                <th className="py-3 px-4">Items</th>       {/* ✅ NEW */}
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-400 py-8">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const effectiveStatus = getEffectiveStatus(inv);
                  const isAutoOverdue =
                    effectiveStatus === "OVERDUE" && inv.status === "PENDING";
                  const daysOverdue =
                    isAutoOverdue && inv.dueDate
                      ? getDaysOverdue(inv.dueDate)
                      : 0;

                  return (
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
                          <span className="text-gray-700">{inv.customerName}</span>
                        </div>
                      </td>

                      {/* ✅ NEW: Items summary in table */}
                      <td className="py-3 px-4">
                        {inv.items && inv.items.length > 0 ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-gray-700 text-xs">
                              {inv.items[0].name}
                              {inv.items[0].qty !== 1 && (
                                <span className="text-gray-400"> ×{inv.items[0].qty}</span>
                              )}
                            </span>
                            {inv.items.length > 1 && (
                              <span className="text-gray-400 text-xs">
                                +{inv.items.length - 1} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-gray-500">
                        {formatDate(inv.date)}
                      </td>
                      <td className="py-3 px-4">
                        {inv.dueDate ? (
                          <div className="flex flex-col gap-0.5">
                            <span className={effectiveStatus === "OVERDUE" ? "text-[#dc2626] font-medium" : "text-gray-500"}>
                              {formatDate(inv.dueDate)}
                            </span>
                            {isAutoOverdue && daysOverdue > 0 && (
                              <span className="text-xs text-[#dc2626]">{daysOverdue}d overdue</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">
                        {formatAmount(inv.total)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[effectiveStatus] || "bg-gray-100 text-gray-500"}`}>
                          {effectiveStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-3">
                          <button className="text-gray-400 hover:text-[#0F3A53] hover:cursor-pointer transition" title="View" onClick={() => setSelectedInvoice(inv)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="text-gray-400 hover:text-[#0F3A53] hover:cursor-pointer transition" title="Edit" onClick={() => handleEditOpen(inv)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>Showing {filtered.length} invoices</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Previous</button>
            <button className="px-3 py-1 bg-[#0F3A53] text-white rounded-lg">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition">Next</button>
          </div>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={handleClose}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">Create New Invoice</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none hover:cursor-pointer">✕</button>
            </div>
            {renderFormFields(form, handleChange, errors, handleItemChange, handleAddItem, handleRemoveItem)}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleClose} className="px-5 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition hover:cursor-pointer">Cancel</button>
              <button onClick={handleSubmit} className="px-5 py-2 text-sm rounded-lg text-white bg-[#0F3A53] transition hover:opacity-90 hover:cursor-pointer">Create Invoice</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW INVOICE DETAIL MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-[#0F3A53] flex items-center justify-center text-sm font-bold">
                  {selectedInvoice.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{selectedInvoice.customerName}</h2>
                  <p className="text-xs text-gray-400">{selectedInvoice.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none hover:cursor-pointer">✕</button>
            </div>

            <hr className="border-gray-100 mb-4" />

            <div className="space-y-3 text-sm">
              {[
                ["Invoice ID", selectedInvoice.id],
                ["Customer", selectedInvoice.customerName],
                ["Invoice Date", formatDate(selectedInvoice.date)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-700">{value}</span>
                </div>
              ))}

              {selectedInvoice.dueDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Due Date</span>
                  <span className={`font-medium ${getEffectiveStatus(selectedInvoice) === "OVERDUE" ? "text-[#dc2626]" : "text-gray-700"}`}>
                    {formatDate(selectedInvoice.dueDate)}
                    {getEffectiveStatus(selectedInvoice) === "OVERDUE" && selectedInvoice.status === "PENDING" && (
                      <span className="ml-1 text-xs">({getDaysOverdue(selectedInvoice.dueDate)}d overdue)</span>
                    )}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[getEffectiveStatus(selectedInvoice)] || "bg-gray-100 text-gray-500"}`}>
                  {getEffectiveStatus(selectedInvoice)}
                </span>
              </div>

              {selectedInvoice.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium text-gray-700">{selectedInvoice.paymentMethod}</span>
                </div>
              )}

              {/* ✅ Line items table in view modal */}
              {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                <div className="mt-1">
                  <p className="text-gray-500 text-xs mb-2">Items</p>
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-gray-400">
                          <th className="text-left px-3 py-2 font-medium">Product</th>
                          <th className="text-center px-2 py-2 font-medium">Qty</th>
                          <th className="text-right px-3 py-2 font-medium">Rate</th>
                          <th className="text-right px-3 py-2 font-medium">Amt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items.map((item, i) => (
                          <tr key={i} className="border-t border-gray-50">
                            <td className="px-3 py-2 text-gray-700">{item.name}</td>
                            <td className="px-2 py-2 text-gray-500 text-center">{item.qty}</td>
                            <td className="px-3 py-2 text-gray-500 text-right">{formatAmount(item.rate)}</td>
                            <td className="px-3 py-2 text-gray-700 font-medium text-right">{formatAmount(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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
                <span className="font-semibold text-gray-700">Total Amount</span>
                <span className="font-bold text-[#0F3A53] text-base">{formatAmount(selectedInvoice.total)}</span>
              </div>

              {selectedInvoice.notes && (
                <div className="mt-2">
                  <p className="text-gray-500 text-xs mb-1">Notes</p>
                  <p className="text-gray-700 text-sm bg-slate-50 rounded-lg px-3 py-2 border border-gray-100">
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={() => setSelectedInvoice(null)} className="px-5 py-2 text-sm rounded-lg text-white bg-[#0F3A53] transition hover:opacity-90 hover:cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT INVOICE MODAL */}
      {editInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={handleEditClose}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Edit Invoice</h2>
                <p className="text-xs text-gray-400 mt-0.5">{editInvoice.id}</p>
              </div>
              <button onClick={handleEditClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none hover:cursor-pointer">✕</button>
            </div>
            {renderFormFields(editForm, handleEditChange, editErrors, handleEditItemChange, handleEditAddItem, handleEditRemoveItem)}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleEditClose} className="px-5 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition hover:cursor-pointer">Cancel</button>
              <button onClick={handleEditSubmit} className="px-5 py-2 text-sm rounded-lg text-white bg-[#0F3A53] transition hover:opacity-90 hover:cursor-pointer">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}