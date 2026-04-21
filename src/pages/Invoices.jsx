import { useState, useEffect, useCallback } from "react";
import {
  getInvoices,
  getInvoiceStats,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../services/invoice.service";
import { getCustomers } from "../services/customer.service";
import { getProducts } from "../services/product.service";
import toast from "react-hot-toast";

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

const calcSubtotal = (items) =>
  items.reduce((sum, item) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    return sum + qty * rate;
  }, 0);

const emptyItem = () => ({ name: "", qty: "1", rate: "", showDropdown: false });

const downloadCSV = (data) => {
  const headers = [
    "Invoice ID", "Customer Name", "Customer GST", "Date", "Due Date",
    "Items", "Subtotal", "GST", "Total", "Status", "Payment Method", "Notes",
  ];
  const rows = data.map((inv) => [
    inv.invoiceId || inv._id,
    inv.customerName,
    inv.customerGst || "",
    new Date(inv.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "",
    (inv.items || []).map((it) => `${it.name} x${it.qty} @₹${it.rate}`).join(" | "),
    inv.subtotal, inv.gst, inv.total, inv.status,
    inv.paymentMethod || "", inv.notes || "",
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
  customerName: "", customerGst: "", date: "", dueDate: "",
  items: [emptyItem()], gstPercent: "18", status: "PENDING",
  paymentMethod: "", notes: "",
};

export default function Invoices() {
  // ✅ API se data
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({ totalPaid: 0, totalPending: 0, totalOverdue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const LIMIT = 10;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editInvoice, setEditInvoice] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [editCustomerSearch, setEditCustomerSearch] = useState("");
  const [showEditCustomerDropdown, setShowEditCustomerDropdown] = useState(false);

  const [products, setProducts] = useState([]);

  // ✅ Invoices + Stats fetch — search/filter/page change pe re-fetch
  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const [invoiceRes, statsRes] = await Promise.all([
        getInvoices({ search, status: statusFilter, page, limit: LIMIT }),
        getInvoiceStats(),
      ]);
      setInvoices(invoiceRes.invoices || []);
      setPagination(invoiceRes.pagination || null);
      setStats(statsRes);
    } catch (err) {
      console.error("Failed to load invoices", err);
      toast.error("Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // ✅ Customers + Products ek baar load
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [customersData, productsData] = await Promise.all([
          getCustomers(),
          getProducts(),
        ]);
        setCustomers(customersData || []);
        setProducts(productsData || []);
      } catch (err) {
        console.error("Failed to load dropdown data", err);
      }
    };
    loadDropdownData();
  }, []);

  // ✅ Search/filter change pe page 1 pe jaao
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const subtotalNum = Math.round(calcSubtotal(form.items || []));
  const gstAmount = Math.round((subtotalNum * (parseFloat(form.gstPercent) || 0)) / 100);
  const totalPreview = subtotalNum + gstAmount;

  const editSubtotalNum = Math.round(calcSubtotal(editForm.items || []));
  const editGstAmount = Math.round((editSubtotalNum * (parseFloat(editForm.gstPercent) || 0)) / 100);
  const editTotalPreview = editSubtotalNum + editGstAmount;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCustomerSelect = (customer) => {
    setForm({ ...form, customerName: customer.name, customerGst: customer.gstNumber || "" });
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
    setErrors({ ...errors, customerName: "" });
  };

  const handleEditCustomerSelect = (customer) => {
    setEditForm({ ...editForm, customerName: customer.name, customerGst: customer.gstNumber || "" });
    setEditCustomerSearch(customer.name);
    setShowEditCustomerDropdown(false);
    setEditErrors({ ...editErrors, customerName: "" });
  };

  const handleItemChange = (index, field, value) => {
    const updated = form.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setForm({ ...form, items: updated });
    if (errors[`item_${index}_${field}`]) {
      setErrors({ ...errors, [`item_${index}_${field}`]: "" });
    }
  };

  const handleProductSelect = (index, product, isEdit = false) => {
    const price = product.price ? String(product.price) : "";
    if (isEdit) {
      const updated = editForm.items.map((item, i) =>
        i === index ? { ...item, name: product.name, rate: price, showDropdown: false } : item,
      );
      setEditForm({ ...editForm, items: updated });
    } else {
      const updated = form.items.map((item, i) =>
        i === index ? { ...item, name: product.name, rate: price, showDropdown: false } : item,
      );
      setForm({ ...form, items: updated });
    }
  };

  const handleItemDropdownToggle = (index, val, isEdit = false) => {
    if (isEdit) {
      const updated = editForm.items.map((item, i) =>
        i === index ? { ...item, showDropdown: val } : item,
      );
      setEditForm({ ...editForm, items: updated });
    } else {
      const updated = form.items.map((item, i) =>
        i === index ? { ...item, showDropdown: val } : item,
      );
      setForm({ ...form, items: updated });
    }
  };

  const handleAddItem = () => setForm({ ...form, items: [...form.items, emptyItem()] });

  const handleRemoveItem = (index) => {
    if (form.items.length === 1) return;
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = "Customer name is required";
    if (!form.date) e.date = "Date is required";
    if (form.dueDate && form.date && new Date(form.dueDate) < new Date(form.date))
      e.dueDate = "Due date cannot be before invoice date";
    form.items.forEach((item, i) => {
      if (!item.name.trim()) e[`item_${i}_name`] = "Product name required";
      if (!item.qty || isNaN(item.qty) || Number(item.qty) <= 0) e[`item_${i}_qty`] = "Invalid qty";
      if (!item.rate || isNaN(item.rate) || Number(item.rate) <= 0) e[`item_${i}_rate`] = "Invalid rate";
    });
    return e;
  };

  // ✅ CREATE — API call
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setIsSubmitting(true);
    try {
      const cleanItems = form.items.map((item) => ({
        name: item.name.trim(),
        qty: parseFloat(item.qty),
        rate: parseFloat(item.rate),
        amount: Math.round(parseFloat(item.qty) * parseFloat(item.rate)),
      }));

      const payload = {
        customerName: form.customerName.trim(),
        customerGst: form.customerGst || null,
        date: form.date,
        dueDate: form.dueDate || null,
        items: cleanItems,
        gstPercent: parseFloat(form.gstPercent),
        status: form.status,
        paymentMethod: form.paymentMethod || null,
        notes: form.notes.trim() || null,
      };

      const res = await createInvoice(payload);
      if (res.success) {
        toast.success("Invoice created successfully!");
        setShowModal(false);
        setForm(emptyForm);
        setCustomerSearch("");
        setErrors({});
        fetchInvoices(); // ✅ List refresh
      } else {
        toast.error(res.message || "Failed to create invoice");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setForm(emptyForm);
    setCustomerSearch("");
    setErrors({});
  };

  const handleEditOpen = (inv) => {
    setEditInvoice(inv);
    setEditCustomerSearch(inv.customerName);
    setEditForm({
      customerName: inv.customerName,
      customerGst: inv.customerGst || "",
      date: inv.date ? inv.date.slice(0, 10) : "",
      dueDate: inv.dueDate ? inv.dueDate.slice(0, 10) : "",
      items: inv.items && inv.items.length > 0
        ? inv.items.map((it) => ({ name: it.name, qty: String(it.qty), rate: String(it.rate), showDropdown: false }))
        : [{ name: "Service", qty: "1", rate: String(inv.subtotal), showDropdown: false }],
      gstPercent: inv.gstPercent ? String(inv.gstPercent) : (inv.gst > 0 ? String(Math.round((inv.gst / inv.subtotal) * 100)) : "18"),
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

  const handleEditAddItem = () => setEditForm({ ...editForm, items: [...editForm.items, emptyItem()] });

  const handleEditRemoveItem = (index) => {
    if (editForm.items.length === 1) return;
    setEditForm({ ...editForm, items: editForm.items.filter((_, i) => i !== index) });
  };

  const validateEdit = () => {
    const e = {};
    if (!editForm.customerName.trim()) e.customerName = "Customer name is required";
    if (!editForm.date) e.date = "Date is required";
    if (editForm.dueDate && editForm.date && new Date(editForm.dueDate) < new Date(editForm.date))
      e.dueDate = "Due date cannot be before invoice date";
    editForm.items.forEach((item, i) => {
      if (!item.name.trim()) e[`item_${i}_name`] = "Product name required";
      if (!item.qty || isNaN(item.qty) || Number(item.qty) <= 0) e[`item_${i}_qty`] = "Invalid qty";
      if (!item.rate || isNaN(item.rate) || Number(item.rate) <= 0) e[`item_${i}_rate`] = "Invalid rate";
    });
    return e;
  };

  // ✅ UPDATE — API call
const handleEditSubmit = async () => {
  const e = validateEdit();
  if (Object.keys(e).length) {
    setEditErrors(e);
    return;
  }

  setIsSubmitting(true);
  try {
    const cleanItems = editForm.items.map((item) => ({
      name: item.name.trim(),
      qty: parseFloat(item.qty),
      rate: parseFloat(item.rate),
      amount: Math.round(parseFloat(item.qty) * parseFloat(item.rate)),
    }));

    const payload = {
      customerName: editForm.customerName.trim(),
      customerGst: editForm.customerGst || null,
      date: editForm.date,
      dueDate: editForm.dueDate || null,
      items: cleanItems,
      gstPercent: parseFloat(editForm.gstPercent),
      status: editForm.status,
      paymentMethod: editForm.paymentMethod || null,
      notes: editForm.notes.trim() || null,
    };

    const res = await updateInvoice(editInvoice._id, payload);

    if (res.success) {
      toast.success("Invoice updated successfully!");

      // ✅ IMPORTANT: Local state update (instant UI change)
      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === editInvoice._id
            ? { ...inv, ...payload }
            : inv
        )
      );

      // ✅ Optional: stats bhi update kar sakti hai (ya refetch)
      fetchInvoices();

      setEditInvoice(null);
      setEditForm({});
      setEditCustomerSearch("");
      setEditErrors({});
    } else {
      toast.error(res.message || "Failed to update invoice");
    }
  } catch (err) {
    toast.error("Something went wrong");
  } finally {
    setIsSubmitting(false);
  }
};
  const handleEditClose = () => {
    setEditInvoice(null);
    setEditForm({});
    setEditCustomerSearch("");
    setEditErrors({});
  };

  const renderLineItems = (items, onItemChange, onAdd, onRemove, errs, isEdit = false) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Products / Services <span className="text-red-500">*</span>
        </label>
        <button type="button" onClick={onAdd}
          className="text-xs text-[#0F3A53] font-medium hover:underline hover:cursor-pointer">
          + Add Item
        </button>
      </div>
      <div className="grid grid-cols-12 gap-1 mb-1 px-1">
        <span className="col-span-5 text-xs text-gray-400">Product / Service</span>
        <span className="col-span-2 text-xs text-gray-400">Qty</span>
        <span className="col-span-3 text-xs text-gray-400">Rate (₹)</span>
        <span className="col-span-2 text-xs text-gray-400 text-right">Amt</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => {
          const amt = Math.round((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0));
          const hasErr = errs[`item_${i}_name`] || errs[`item_${i}_qty`] || errs[`item_${i}_rate`];
          const filteredProducts = products.filter((p) =>
            p.name.toLowerCase().includes((item.name || "").toLowerCase())
          );
          return (
            <div key={i}>
              <div className="grid grid-cols-12 gap-1 items-center">
                <div className="col-span-5 relative">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      onItemChange(i, "name", e.target.value);
                      handleItemDropdownToggle(i, true, isEdit);
                    }}
                    onFocus={() => handleItemDropdownToggle(i, true, isEdit)}
                    onBlur={() => setTimeout(() => handleItemDropdownToggle(i, false, isEdit), 200)}
                    placeholder="e.g. Web Design"
                    className={`w-full border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F3A53] ${errs[`item_${i}_name`] ? "border-red-400" : "border-gray-200"}`}
                  />
                  {item.showDropdown && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-0.5 bg-white border border-gray-200 rounded-lg shadow-lg max-h-36 overflow-y-auto">
                      {filteredProducts.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-gray-400">No products found</div>
                      ) : (
                        filteredProducts.map((p) => (
                          <button key={p.id || p._id} type="button"
                            onMouseDown={() => handleProductSelect(i, p, isEdit)}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 hover:cursor-pointer transition border-b border-gray-50 last:border-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-700">{p.name}</span>
                              <span className="text-xs text-[#0F3A53] font-semibold">
                                ₹{Number(p.price).toLocaleString("en-IN")}
                              </span>
                            </div>
                            {p.category && <span className="text-xs text-gray-400">{p.category}</span>}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <input type="number" value={item.qty}
                  onChange={(e) => onItemChange(i, "qty", e.target.value)}
                  min="0.01" step="0.01"
                  className={`col-span-2 border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F3A53] ${errs[`item_${i}_qty`] ? "border-red-400" : "border-gray-200"}`}
                />
                <input type="number" value={item.rate}
                  onChange={(e) => onItemChange(i, "rate", e.target.value)}
                  min="0" placeholder="0"
                  className={`col-span-3 border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F3A53] ${errs[`item_${i}_rate`] ? "border-red-400" : "border-gray-200"}`}
                />
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <span className="text-xs font-medium text-gray-700">
                    {amt > 0 ? `₹${amt.toLocaleString("en-IN")}` : "—"}
                  </span>
                  {items.length > 1 && (
                    <button type="button" onClick={() => onRemove(i)}
                      className="text-gray-300 hover:text-red-400 hover:cursor-pointer text-base leading-none ml-1" title="Remove">
                      ×
                    </button>
                  )}
                </div>
              </div>
              {hasErr && (
                <p className="text-red-500 text-xs mt-0.5 pl-1">
                  {errs[`item_${i}_name`] || errs[`item_${i}_qty`] || errs[`item_${i}_rate`]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCustomerField = (searchVal, setSearchVal, showDropdown, setShowDropdown, onSelect, selectedGst, errs) => {
    const filteredCustomers = customers.filter((c) =>
      c.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      (c.gstNumber || "").toLowerCase().includes(searchVal.toLowerCase())
    );
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Customer Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input type="text" value={searchVal}
            onChange={(e) => { setSearchVal(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Search customer..."
            className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] ${errs.customerName ? "border-red-400" : "border-gray-200"}`}
          />
          {showDropdown && searchVal && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredCustomers.length === 0 ? (
                <div className="px-4 py-3 text-xs text-gray-400">No customers found</div>
              ) : (
                filteredCustomers.map((c) => (
                  <button key={c._id || c.id} type="button" onMouseDown={() => onSelect(c)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 hover:cursor-pointer transition border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{c.name}</span>
                      {c.gstNumber
                        ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">GST</span>
                        : <span className="text-xs text-gray-300">No GST</span>}
                    </div>
                    {c.gstNumber && <div className="text-xs text-gray-400 mt-0.5">{c.gstNumber}</div>}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        {errs.customerName && <p className="text-red-500 text-xs mt-1">{errs.customerName}</p>}
        {selectedGst && (
          <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <span className="text-xs text-green-700 font-medium">GST:</span>
            <span className="text-xs text-green-800 font-bold tracking-wide">{selectedGst}</span>
            <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Auto-filled</span>
          </div>
        )}
        {searchVal && !selectedGst && customers.find(c => c.name === searchVal) && (
          <div className="mt-2 flex items-center gap-2 bg-slate-50 border border-gray-200 rounded-lg px-3 py-2">
            <span className="text-xs text-gray-400">This customer has no GST number registered</span>
          </div>
        )}
      </div>
    );
  };

  const renderFormFields = (f, onChange, errs, onItemChange, onAdd, onRemove, isEdit = false) => {
    const sub = Math.round(calcSubtotal(f.items || []));
    const gst = Math.round((sub * (parseFloat(f.gstPercent) || 0)) / 100);
    const tot = sub + gst;
    return (
      <div className="space-y-4">
        {isEdit
          ? renderCustomerField(editCustomerSearch, setEditCustomerSearch, showEditCustomerDropdown, setShowEditCustomerDropdown, handleEditCustomerSelect, f.customerGst, errs)
          : renderCustomerField(customerSearch, setCustomerSearch, showCustomerDropdown, setShowCustomerDropdown, handleCustomerSelect, f.customerGst, errs)}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Date <span className="text-red-500">*</span>
            </label>
            <input type="date" name="date" value={f.date} onChange={onChange}
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] ${errs.date ? "border-red-400" : "border-gray-200"}`} />
            {errs.date && <p className="text-red-500 text-xs mt-1">{errs.date}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input type="date" name="dueDate" value={f.dueDate} onChange={onChange}
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] ${errs.dueDate ? "border-red-400" : "border-gray-200"}`} />
            {errs.dueDate && <p className="text-red-500 text-xs mt-1">{errs.dueDate}</p>}
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl p-3 bg-slate-50">
          {renderLineItems(f.items, onItemChange, onAdd, onRemove, errs, isEdit)}
          {sub > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span><span>{formatAmount(sub)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>GST ({f.gstPercent}%)</span><span>{formatAmount(gst)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#0F3A53]">
                <span>Total</span><span>{formatAmount(tot)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST (%)</label>
            <select name="gstPercent" value={f.gstPercent} onChange={onChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] hover:cursor-pointer">
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={f.status} onChange={onChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] hover:cursor-pointer">
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="OVERDUE">OVERDUE</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select name="paymentMethod" value={f.paymentMethod} onChange={onChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] hover:cursor-pointer">
            <option value="">— Select —</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Description</label>
          <textarea name="notes" value={f.notes} onChange={onChange} rows={2}
            placeholder="e.g. Thank you for your business"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53] resize-none" />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        <p className="text-gray-500 text-sm mt-1">Create, view, and manage your billing transactions.</p>
        <button onClick={() => setShowModal(true)}
          className="mt-4 flex items-center gap-2 bg-[#0F3A53] hover:cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <span className="text-lg leading-none">+</span> Create Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{formatAmount(stats.totalPaid)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Pending</p>
          <p className="text-2xl font-bold text-[#d97706] mt-1">{formatAmount(stats.totalPending)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Overdue</p>
          <p className="text-2xl font-bold text-[#dc2626] mt-1">{formatAmount(stats.totalOverdue)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <input type="text" placeholder="Search by ID or customer..."
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#0F3A53]"
            value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <select className="border border-gray-200 hover:cursor-pointer rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A53]"
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>All Status</option>
              <option>PAID</option>
              <option>PENDING</option>
              <option>OVERDUE</option>
            </select>
            <button onClick={() => downloadCSV(invoices)} title="Download CSV"
              className="border border-gray-200 rounded-lg p-2 hover:cursor-pointer hover:bg-gray-50 transition">
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
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="text-center text-gray-400 py-8">Loading invoices...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-gray-400 py-8">No invoices found.</td></tr>
              ) : (
                invoices.map((inv) => {
                  const effectiveStatus = getEffectiveStatus(inv);
                  const isAutoOverdue = effectiveStatus === "OVERDUE" && inv.status === "PENDING";
                  const daysOverdue = isAutoOverdue && inv.dueDate ? getDaysOverdue(inv.dueDate) : 0;
                  return (
                    <tr key={inv._id} className="border-b border-gray-50 hover:bg-slate-100 transition">
                      {/* ✅ Backend se invoiceId field aata hai */}
                      <td className="py-3 px-4 font-medium text-gray-700">{inv.invoiceId}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-300 text-[#0F3A53] flex items-center justify-center text-xs font-bold">
                            {inv.customerName.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-700">{inv.customerName}</span>
                            {inv.customerGst && <span className="text-xs text-gray-400">{inv.customerGst}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {inv.items && inv.items.length > 0 ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-gray-700 text-xs">
                              {inv.items[0].name}
                              {inv.items[0].qty !== 1 && <span className="text-gray-400"> ×{inv.items[0].qty}</span>}
                            </span>
                            {inv.items.length > 1 && <span className="text-gray-400 text-xs">+{inv.items.length - 1} more</span>}
                          </div>
                        ) : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(inv.date)}</td>
                      <td className="py-3 px-4">
                        {inv.dueDate ? (
                          <div className="flex flex-col gap-0.5">
                            <span className={effectiveStatus === "OVERDUE" ? "text-[#dc2626] font-medium" : "text-gray-500"}>
                              {formatDate(inv.dueDate)}
                            </span>
                            {isAutoOverdue && daysOverdue > 0 && <span className="text-xs text-[#dc2626]">{daysOverdue}d overdue</span>}
                          </div>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">{formatAmount(inv.total)}</td>
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

        {/* ✅ Real pagination from backend */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>
            Showing {invoices.length} of {pagination?.total || 0} invoices
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-40">
              Previous
            </button>
            {pagination && Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${p === page ? "bg-[#0F3A53] text-white" : "border border-gray-200 hover:bg-gray-50"}`}>
                {p}
              </button>
            ))}
            <button
              disabled={!pagination || page === pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={handleClose}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Invoice</h2>
                <p className="text-sm text-gray-400 mt-1">Fill in the details below</p>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none hover:cursor-pointer">✕</button>
            </div>
            {renderFormFields(form, handleChange, errors, handleItemChange, handleAddItem, handleRemoveItem, false)}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button onClick={handleClose} className="px-6 py-2.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition hover:cursor-pointer font-semibold">Cancel</button>
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="px-6 py-2.5 text-sm rounded-lg text-white bg-[#0F3A53] transition hover:opacity-90 hover:cursor-pointer font-semibold disabled:opacity-60">
                {isSubmitting ? "Creating..." : "Create Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200 text-[#0F3A53] flex items-center justify-center text-base font-bold">
                  {selectedInvoice.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedInvoice.customerName}</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{selectedInvoice.invoiceId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none hover:cursor-pointer">✕</button>
            </div>
            <hr className="border-gray-100 mb-6" />
            <div className="space-y-4 text-sm">
              {[
                ["Invoice ID", selectedInvoice.invoiceId],
                ["Customer", selectedInvoice.customerName],
                ["Invoice Date", formatDate(selectedInvoice.date)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500 font-medium">{label}</span>
                  <span className="font-semibold text-gray-800">{value}</span>
                </div>
              ))}
              {selectedInvoice.customerGst && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Customer GST</span>
                  <span className="font-semibold text-gray-800 font-mono text-xs tracking-wide">{selectedInvoice.customerGst}</span>
                </div>
              )}
              {selectedInvoice.dueDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Due Date</span>
                  <span className={`font-semibold ${getEffectiveStatus(selectedInvoice) === "OVERDUE" ? "text-[#dc2626]" : "text-gray-800"}`}>
                    {formatDate(selectedInvoice.dueDate)}
                    {getEffectiveStatus(selectedInvoice) === "OVERDUE" && selectedInvoice.status === "PENDING" && (
                      <span className="ml-1 text-xs">({getDaysOverdue(selectedInvoice.dueDate)}d overdue)</span>
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[getEffectiveStatus(selectedInvoice)] || "bg-gray-100 text-gray-500"}`}>
                  {getEffectiveStatus(selectedInvoice)}
                </span>
              </div>
              {selectedInvoice.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Payment Method</span>
                  <span className="font-semibold text-gray-800">{selectedInvoice.paymentMethod}</span>
                </div>
              )}
              {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                <div className="mt-2">
                  <p className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-2">Items</p>
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-gray-400">
                          <th className="text-left px-4 py-2.5 font-semibold">Product</th>
                          <th className="text-center px-3 py-2.5 font-semibold">Qty</th>
                          <th className="text-right px-4 py-2.5 font-semibold">Rate</th>
                          <th className="text-right px-4 py-2.5 font-semibold">Amt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items.map((item, i) => (
                          <tr key={i} className="border-t border-gray-50">
                            <td className="px-4 py-2.5 text-gray-700 font-medium">{item.name}</td>
                            <td className="px-3 py-2.5 text-gray-500 text-center">{item.qty}</td>
                            <td className="px-4 py-2.5 text-gray-500 text-right">{formatAmount(item.rate)}</td>
                            <td className="px-4 py-2.5 text-gray-800 font-semibold text-right">{formatAmount(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <hr className="border-gray-100" />
              {[
                ["Subtotal", formatAmount(selectedInvoice.subtotal)],
                ["GST", formatAmount(selectedInvoice.gst)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500 font-medium">{label}</span>
                  <span className="font-semibold text-gray-800">{value}</span>
                </div>
              ))}
              <div className="flex justify-between rounded-xl px-5 py-4 bg-slate-50 border border-gray-100 mt-2">
                <span className="font-bold text-gray-800 text-base">Total Amount</span>
                <span className="font-bold text-[#0F3A53] text-lg">{formatAmount(selectedInvoice.total)}</span>
              </div>
              {selectedInvoice.notes && (
                <div className="mt-2">
                  <p className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-2">Notes</p>
                  <p className="text-gray-700 text-sm bg-slate-50 rounded-xl px-4 py-3 border border-gray-100">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
              <button onClick={() => setSelectedInvoice(null)} className="px-6 py-2.5 text-sm rounded-lg text-white bg-[#0F3A53] transition hover:opacity-90 hover:cursor-pointer font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={handleEditClose}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Invoice</h2>
                <p className="text-sm text-gray-400 mt-1">{editInvoice.invoiceId}</p>
              </div>
              <button onClick={handleEditClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none hover:cursor-pointer">✕</button>
            </div>
            {renderFormFields(editForm, handleEditChange, editErrors, handleEditItemChange, handleEditAddItem, handleEditRemoveItem, true)}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button onClick={handleEditClose} className="px-6 py-2.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition hover:cursor-pointer font-semibold">Cancel</button>
              <button onClick={handleEditSubmit} disabled={isSubmitting}
                className="px-6 py-2.5 text-sm rounded-lg text-white bg-[#0F3A53] transition hover:opacity-90 hover:cursor-pointer font-semibold disabled:opacity-60">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}