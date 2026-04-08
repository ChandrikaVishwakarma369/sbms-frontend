import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  ShoppingCart,
  Truck,
  Clock,
  Eye,
  Download,
  ChevronDown,
  Check,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getOrdersMock, createOrder, updateOrder, deleteOrder } from "../services/order.service";
import { phone } from "phone";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import MainLayout from "../layout/MainLayout";
import ConfirmationModal from "../components/ConfirmationModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOrderId, setEditOrderId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const [formData, setFormData] = useState({
    customer: "",
    contact: "",
    product: "",
    date: "",
    address: "",
    amount: "",
    status: "Pending",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await getOrdersMock(statusFilter);
        setOrders(data);
      } catch (err) {
        console.error("Error loading orders", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter]);

  // 🔍 FILTER
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orderId.toString().includes(searchTerm);

    return matchesSearch;
  });

  // 🎨 STATUS STYLE
  const getStatusStyle = (status) => {
    switch (status) {
      case "Shipped":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Delivered":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusDotStyle = (status) => {
    switch (status) {
      case "Shipped":
        return "bg-green-600";
      case "Pending":
        return "bg-yellow-600";
      case "Delivered":
        return "bg-blue-600";
      case "Cancelled":
        return "bg-red-600";
      default:
        return "bg-slate-400";
    }
  };

  // 🧾 FORM HANDLE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetOrderForm = () => {
    setFormData({
      customer: "",
      contact: "",
      product: "",
      date: "",
      address: "",
      amount: "",
      status: "Pending",
    });
    setEditOrderId(null);
  };

  const handleOpenAddOrder = () => {
    resetOrderForm();
    setIsAddModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setFormData({
      customer: order.customer || "",
      contact: order.contact || "",
      product: order.product || "",
      date: order.date || "",
      address: order.address || "",
      amount: order.amount || "",
      status: order.status || "Pending",
    });
    setEditOrderId(order.id);
    setIsAddModalOpen(true);
  };

  const handleSaveOrder = async () => {
    if (!formData.customer || !formData.contact || !formData.product || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Contact Validation & Normalization (adding + if missing)
    const phoneToValidate = formData.contact.startsWith("+") ? formData.contact : `+${formData.contact}`;
    const phoneResult = phone(phoneToValidate, { country: "IND" });
    if (!phoneResult.isValid) {
      toast.error("Please enter a valid contact number");
      return;
    }

    const payload = {
      ...formData,
      contact: phoneResult.phoneNumber // Normalized to E.164 format
    };

    try {
      if (editOrderId) {
        // Update existing order
        await updateOrder(editOrderId, payload);
        const updated = orders.map((o) =>
          o.id === editOrderId
            ? { ...o, ...payload }
            : o
        );
        setOrders(updated);
      } else {
        // Create new order
        const newOrder = await createOrder(payload);
        setOrders([...orders, newOrder]);
      }

      resetOrderForm();
      setIsAddModalOpen(false);
      toast.success(editOrderId ? "Order updated successfully!" : "Order created successfully!");
    } catch (error) {
      console.error("Error saving order:", error);
      const errorMessage = error.message || "Error saving order. Please try again.";
      toast.error(`❌ ${errorMessage}`);
    }
  };

  // ❌ DELETE
  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      await deleteOrder(orderToDelete.id);
      setOrders(orders.filter((o) => o.id !== orderToDelete.id));
      toast.success("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order. Please try again.");
    } finally {
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  // 👁️ VIEW ORDER
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  // 📥 DOWNLOAD ORDER PDF
  const handleDownloadOrder = (order) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Order Details", 40, 60);

    doc.setLineWidth(1);
    doc.line(40, 70, 555, 70);

    const addLine = (label, value, y) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`${label}:`, 40, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`${value}`, 150, y);
    };

    let y = 95;
    const lineHeight = 18;

    addLine("Order ID", `#${order.orderId}`, y);
    y += lineHeight;

    addLine("Customer", order.customer, y);
    y += lineHeight;

    addLine("Contact", order.contact, y);
    y += lineHeight;

    addLine("Product", order.product, y);
    y += lineHeight;

    addLine("Date", order.date, y);
    y += lineHeight;

    // Wrap long address text
    const addressLines = doc.splitTextToSize(order.address, 360);
    addLine("Address", addressLines[0], y);
    y += lineHeight;
    for (let i = 1; i < addressLines.length; i += 1) {
      doc.setFont("helvetica", "normal");
      doc.text(addressLines[i], 150, y);
      y += lineHeight;
    }

    addLine("Amount", `Rs. ${order.amount}`, y);
    y += lineHeight;

    addLine("Status", order.status, y);

    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("Generated by SBMS", 40, 780);

    doc.save(`Order-${order.orderId}.pdf`);
  };

  return (
    <div className="flex flex-col gap-6 w-full p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Orders</h1>
          <p className="text-sm text-slate-500">
            Manage and track all your business orders
          </p>
        </div>

        <button
          onClick={handleOpenAddOrder}
          className="flex items-center gap-2 bg-[#0F3A53] hover:bg-[#0b2d44] text-white px-5 py-2.5 rounded-lg shadow-md text-sm font-semibold"
        >
          <Plus size={16} />
          Create Order
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <ShoppingCart className="text-indigo-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase">Total Orders</p>
            <p className="text-2xl font-bold text-slate-800">
              {orders.length}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <Truck className="text-green-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase">Shipped</p>
            <p className="text-2xl font-bold text-slate-800">
              {orders.filter((o) => o.status === "Shipped").length}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-lg">
            <Clock className="text-yellow-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase">Pending</p>
            <p className="text-2xl font-bold text-slate-800">
              {orders.filter((o) => o.status === "Pending").length}
            </p>
          </div>
        </div>

      </div>

      {/* TABLE CARD */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        {/* SEARCH */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2 w-80 bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-500">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer or status..."
              className="ml-2 outline-none text-sm w-full bg-slate-50 text-slate-700 placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 border ${
                statusFilter !== "All"
                  ? "border-[#0F3A53] bg-blue-50 text-[#0F3A53]"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              } px-4 py-2 rounded-lg text-sm transition-all`}
            >
              <Filter size={16} />
              {statusFilter === "All" ? "Filter" : statusFilter}
            </button>

            {isFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsFilterOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2">
                  {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                          statusFilter === status
                            ? "text-[#0F3A53] font-bold bg-blue-50/50"
                            : "text-slate-600"
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm">

            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="text-left px-6 py-3 border-b border-slate-200">Order ID</th>
                <th className="text-left px-6 py-3 border-b border-slate-200">Customer</th>
                <th className="text-left px-6 py-3 border-b border-slate-200">Contact</th>
                <th className="text-left px-6 py-3 border-b border-slate-200">Product</th>
                <th className="text-left px-6 py-3 border-b border-slate-200">Date</th>
                <th className="text-left px-6 py-3 border-b border-slate-200">Address</th>
                <th className="text-left px-6 py-3 border-b border-slate-200">Amount</th>
                <th className="text-left px-6 py-3 border-b border-slate-200">Status</th>
                <th className="text-right px-6 py-3 border-b border-slate-200">Actions</th>
              </tr>
            </thead>

            <tbody>

              {isLoading ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-slate-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-200 odd:bg-white even:bg-slate-50 hover:bg-slate-100">

                    <td className="px-6 py-4 font-medium text-slate-600">
                      #{order.orderId}
                    </td>

                    <td className="px-6 py-4 text-slate-600">{order.customer}</td>

                    <td className="px-6 py-4 text-slate-600">{order.contact}</td>

                    <td className="px-6 py-4 text-slate-600">{order.product}</td>

                    <td className="px-6 py-4 text-slate-600">{order.date}</td>

                    <td className="px-6 py-4 text-slate-600">
                      {order.address}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-600">
                      ₹{order.amount}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                        <span className={`w-2 h-2 rounded-full ${getStatusDotStyle(order.status)}`}></span>
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDownloadOrder(order)}
                          className="p-2 text-slate-400 hover:bg-green-50 hover:text-green-600 rounded relative group"
                          title="Download PDF"
                        >
                          <Download size={16} />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Download
                          </span>
                        </button>
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDeleteClick(order)}
                          className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold">{filteredOrders.length}</span> of <span className="font-semibold">{orders.length}</span> orders
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-2 text-sm bg-[#0F3A53] text-white rounded-lg hover:bg-[#0F3A53]">
              1
            </button>
            <button className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>

      </div>

      {/* ADD ORDER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 space-y-6">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {editOrderId ? "Edit Order" : "Add New Order"}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Fill in the order details below
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetOrderForm();
                }}
                className="text-slate-400 hover:text-slate-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Customer
                  </label>
                  <input
                    name="customer"
                    placeholder="Customer name"
                    value={formData.customer}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Contact
                  </label>
                  <PhoneInput
                    country={"in"}
                    value={formData.contact}
                    onChange={(contact) => setFormData({ ...formData, contact })}
                    containerClass="!w-full"
                    inputClass="!w-full !py-3 !pl-12 !pr-4 !text-sm !border-slate-200 !rounded-lg focus:!ring-2 focus:!ring-indigo-500 !outline-none !bg-white !placeholder-slate-400"
                    buttonClass="!bg-white !border-slate-200 !rounded-l-lg"
                    dropdownClass="!bg-white !border-slate-200 !rounded-lg !shadow-xl"
                    placeholder="Enter contact number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Product
                  </label>
                  <input
                    name="product"
                    placeholder="Product name"
                    value={formData.product}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Date
                  </label>
                  <input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Address
                </label>
                <input
                  name="address"
                  placeholder="Delivery address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Amount
                  </label>
                  <input
                    name="amount"
                    type="number"
                    placeholder="e.g. 3000"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsStatusOpen(!isStatusOpen)}
                      className="w-full flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all hover:border-slate-300"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusDotStyle(formData.status)}`}></span>
                        <span className="font-medium text-slate-700">{formData.status}</span>
                      </div>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${isStatusOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isStatusOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)}></div>
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-20 overflow-hidden py-1 transform origin-top animate-in fade-in zoom-in duration-200">
                          {[
                            { name: "Pending", icon: <Clock size={14} className="text-yellow-600" /> },
                            { name: "Shipped", icon: <Truck size={14} className="text-green-600" /> },
                            { name: "Delivered", icon: <CheckCircle size={14} className="text-blue-600" /> },
                            { name: "Cancelled", icon: <XCircle size={14} className="text-red-600" /> }
                          ].map((status) => (
                            <button
                              key={status.name}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, status: status.name });
                                setIsStatusOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                {status.icon}
                                <span className={`${formData.status === status.name ? "text-[#0F3A53] font-bold" : "text-slate-600"}`}>
                                  {status.name}
                                </span>
                              </div>
                              {formData.status === status.name && <Check size={14} className="text-[#0F3A53]" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveOrder}
                className="px-6 py-2.5 bg-[#0F3A53] text-white text-sm font-semibold rounded-lg hover:bg-[#0b2d44]"
              >
                {editOrderId ? "Update Order" : "Save Order"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-6">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Order Details</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Details for Order #{selectedOrder.orderId}
                </p>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Order ID
                </label>
                <p className="text-sm text-slate-600">#{selectedOrder.orderId}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Customer
                </label>
                <p className="text-sm text-slate-600">{selectedOrder.customer}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Contact
                </label>
                <p className="text-sm text-slate-600">{selectedOrder.contact}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Product
                </label>
                <p className="text-sm text-slate-600">{selectedOrder.product}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Date
                </label>
                <p className="text-sm text-slate-600">{selectedOrder.date}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Address
                </label>
                <p className="text-sm text-slate-600">{selectedOrder.address}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Amount
                </label>
                <p className="text-sm text-slate-600">₹{selectedOrder.amount}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Status
                </label>
                <span className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full ${getStatusStyle(selectedOrder.status)}`}>
                  <span className={`w-2 h-2 rounded-full ${getStatusDotStyle(selectedOrder.status)}`}></span>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="px-6 py-2.5 bg-[#0F3A53] text-white text-sm font-semibold rounded-lg hover:bg-[#0b2d44]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order #${orderToDelete?.orderId} for "${orderToDelete?.customer}"? This action cannot be undone.`}
        confirmText="Delete Order"
      />
    </div>
  );
};

export default Orders;