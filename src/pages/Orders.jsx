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
} from "lucide-react";
import { getOrdersMock } from "../services/order.service";
import jsPDF from "jspdf";
import MainLayout from "../layout/MainLayout";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOrderId, setEditOrderId] = useState(null);

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
        const data = await getOrdersMock();
        setOrders(data);
      } catch (err) {
        console.error("Error loading orders", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🔍 FILTER
  const filteredOrders = orders.filter(
    (o) =>
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orderId.toString().includes(searchTerm)
  );

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

  const handleSaveOrder = () => {
    if (!formData.customer || !formData.contact || !formData.product || !formData.amount) return;

    if (editOrderId) {
      const updated = orders.map((o) =>
        o.id === editOrderId
          ? { ...o, ...formData, orderId: o.orderId || Math.floor(1000 + Math.random() * 9000) }
          : o
      );
      setOrders(updated);
    } else {
      const newOrder = {
        id: Date.now(),
        orderId: Math.floor(1000 + Math.random() * 9000),
        ...formData,
      };
      setOrders([...orders, newOrder]);
    }

    resetOrderForm();
    setIsAddModalOpen(false);
  };

  // ❌ DELETE
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Delete this order?");
    if (confirmDelete) {
      setOrders(orders.filter((o) => o.id !== id));
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

          <button className="flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
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
                          onClick={() => handleDelete(order.id)}
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
                  <input
                    name="contact"
                    placeholder="Contact number"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white placeholder-slate-400"
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
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option>Pending</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
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

    </div>
  );
};

export default Orders;