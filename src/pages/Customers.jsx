import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Users,
  Mail,
  Building2,
  ChevronDown,
  Check,
} from "lucide-react";
import { 
  getCustomers, 
  getCustomerStats, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer 
} from "../services/customer.service";
import { phone } from "phone";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";
import MainLayout from "../layout/MainLayout";
import ConfirmationModal from "../components/ConfirmationModal";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    customersWithGST: 0,
  });
  const [gstFilter, setGstFilter] = useState("All"); // All, With GST, Without GST
  const [statusFilter, setStatusFilter] = useState("All"); // All, Active, Inactive
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gstError, setGstError] = useState("");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gstNumber: "",
    address: "",
    status: "Active",
  });

  useEffect(() => {
    fetchData();
  }, [gstFilter, statusFilter]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Map frontend filter values to API parameters
      const gstParam = gstFilter === "With GST" ? "true" : gstFilter === "Without GST" ? "false" : null;

      const [customersData, statsData] = await Promise.all([
        getCustomers(statusFilter, gstParam),
        getCustomerStats()
      ]);
      setCustomers(customersData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);

    return matchesSearch;
  });

  const avatarColors = [
    "from-indigo-500 to-purple-600",
    "from-emerald-400 to-teal-600",
    "from-rose-400 to-pink-600",
    "from-amber-400 to-orange-500",
    "from-sky-400 to-blue-600",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetCustomerForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      gstNumber: "",
      address: "",
      status: "Active",
    });
    setGstError("");
    setEditCustomerId(null);
  };

  const handleOpenAddCustomer = () => {
    resetCustomerForm();
    setIsAddModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      gstNumber: customer.gstNumber || "",
      address: customer.address || "",
      status: customer.status || "Active",
    });
    setEditCustomerId(customer.id);
    setIsAddModalOpen(true);
  };

  const handleSaveCustomer = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.gstNumber) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(formData.gstNumber)) {
        setGstError("Invalid GST format (e.g. 22AAAAA0000A1Z5)");
        return;
      }
    }
    setGstError("");

    // Normalize phone number (adding + if missing for phone library)
    const phoneToValidate = formData.phone.startsWith("+") ? formData.phone : `+${formData.phone}`;

    // Phone Validation & Normalization
    const phoneResult = phone(phoneToValidate, { country: "IND" });
    if (!phoneResult.isValid) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    const payload = {
      ...formData,
      phone: phoneResult.phoneNumber // Normalized to E.164 format
    };

    try {
      if (editCustomerId) {
        const response = await updateCustomer(editCustomerId, payload);
        if (response.success) {
          await fetchData(); // Refresh both list and stats
          setIsAddModalOpen(false);
          resetCustomerForm();
          toast.success("Customer updated successfully!");
        } else {
          if (response.message?.toLowerCase().includes("gst")) {
            setGstError(response.message);
          } else {
            toast.error(response.message || "Failed to update customer");
          }
        }
      } else {
        const response = await createCustomer(payload);
        if (response.success) {
          await fetchData();
          setIsAddModalOpen(false);
          resetCustomerForm();
          toast.success("Customer added successfully!");
        } else {
          if (response.message?.toLowerCase().includes("gst")) {
            setGstError(response.message);
          } else {
            toast.error(response.message || "Failed to add customer");
          }
        }
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error("Something went wrong while saving.");
    }
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;

    try {
      const response = await deleteCustomer(customerToDelete.id);
      if (response.success) {
        await fetchData();
        toast.success("Customer deleted successfully!");
      } else {
        toast.error(response.message || "Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Something went wrong while deleting.");
    } finally {
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Customers</h1>
          <p className="text-sm text-slate-500">
            Manage your client directory and contact details
          </p>
        </div>

        <button
          onClick={handleOpenAddCustomer}
          className="flex items-center gap-2 bg-[#0F3A53] hover:bg-[#0F3A53] text-white px-5 py-2.5 rounded-lg shadow text-sm font-semibold"
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-lg flex items-center justify-center">
            <Users className="text-indigo-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Total Customers</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg flex items-center justify-center">
            <Building2 className="text-green-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Active</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.activeCustomers}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-lg flex items-center justify-center">
            <Mail className="text-yellow-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">With GST</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {stats.customersWithGST}
            </p>
          </div>
        </div>

      </div>

      {/* TABLE CARD */}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        {/* SEARCH */}

        <div className="flex items-center justify-between p-6 border-b border-slate-200">

          <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2 w-80 bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-500">

            <Search size={16} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search by name, email or phone..."
              className="ml-2 outline-none text-sm w-full bg-slate-50 text-slate-700 placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 border ${
                gstFilter !== "All" || statusFilter !== "All"
                  ? "border-[#0F3A53] bg-blue-50 text-[#0F3A53]"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              } px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm`}
            >
              <Filter size={16} />
              Filter
              {(gstFilter !== "All" || statusFilter !== "All") && (
                <span className="w-2 h-2 bg-[#0F3A53] rounded-full animate-pulse"></span>
              )}
            </button>

            {isFilterOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsFilterOpen(false)}
                ></div>
                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 overflow-hidden transform origin-top-right transition-all">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-700">Filter Customers</h3>
                      <Filter size={14} className="text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                        Account Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["All", "Active", "Inactive"].map((status) => (
                          <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              statusFilter === status 
                              ? "bg-[#0F3A53] text-white shadow-lg shadow-blue-100" 
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                        GST Registration
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["All", "With GST", "Without GST"].map((gst) => (
                          <button
                            key={gst}
                            onClick={() => setGstFilter(gst)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              gstFilter === gst 
                              ? "bg-[#0F3A53] text-white shadow-lg shadow-blue-100" 
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {gst}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {(statusFilter !== "All" || gstFilter !== "All") && (
                    <div className="p-3 border-t border-slate-50 bg-slate-50/30">
                      <button 
                        onClick={() => {
                          setStatusFilter("All");
                          setGstFilter("All");
                        }}
                        className="w-full py-2 text-xs text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold flex items-center justify-center gap-2"
                      >
                        Reset All Filters
                      </button>
                    </div>
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
                <th className="text-left px-6 py-3 border-b border-slate-200">Customer</th>
                <th className="text-left px-6 py-3 border-b border-slate-200">Email</th>
                <th className="text-left px-6 py-3 border-b border-slate-200">Phone</th>
                <th className="text-left px-6 py-3 border-b border-slate-200">Address</th>
                <th className="text-left px-6 py-3 border-b border-slate-200">GST Number</th>
                <th className="text-left px-6 py-3 border-b border-slate-200">Status</th>
                <th className="text-right px-6 py-3 border-b border-slate-200">Actions</th>
              </tr>
            </thead>

            <tbody>

              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500">
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className="border-b border-slate-200 hover:bg-slate-50"
                  >

                    <td className="px-6 py-4 flex items-center gap-3">

                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                      avatarColors[index % avatarColors.length]
                    } text-white flex items-center justify-center text-sm font-bold`}
                  >
                    {customer.name.charAt(0)}
                      </div>

                      <span className="font-semibold text-slate-700">
                        {customer.name}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {customer.email}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {customer.phone}
                    </td>

                    <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]" title={customer.address}>
                      {customer.address || "—"}
                    </td>

                    <td className="px-6 py-4">
                      {customer.gstNumber ? (
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-slate-700">{customer.gstNumber}</span>
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full w-fit font-bold uppercase">
                            GST Registered
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-400">—</span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full w-fit font-bold uppercase">
                            Unregistered
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full inline-flex items-center gap-1 font-medium ${
                        customer.status === "Active" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-slate-100 text-slate-600"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          customer.status === "Active" ? "bg-green-600" : "bg-slate-400"
                        }`}></span>
                        {customer.status || "Active"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="p-2 hover:bg-indigo-50 rounded text-slate-400 hover:text-indigo-600"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDeleteClick(customer)}
                          className="p-2 hover:bg-red-50 rounded text-slate-400 hover:text-red-500"
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
            Showing <span className="font-semibold">{filteredCustomers.length}</span> of <span className="font-semibold">{customers.length}</span> customers
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

      {/* ADD CUSTOMER MODAL */}

      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 space-y-6">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {editCustomerId ? "Edit Customer" : "Add New Customer"}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Fill in the details below
                </p>
              </div>

              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetCustomerForm();
                }}
                className="text-slate-400 hover:text-slate-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Business Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Traders"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Email Address
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@email.com"
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Phone Number
                  </label>
                  <PhoneInput
                    country={"in"}
                    value={formData.phone}
                    onChange={(phone) => setFormData({ ...formData, phone })}
                    containerClass="!w-full"
                    inputClass="!w-full !py-3 !pl-12 !pr-4 !text-sm !border-slate-200 !rounded-lg focus:!ring-2 focus:!ring-indigo-500 !outline-none !bg-white !placeholder-slate-400"
                    buttonClass="!bg-white !border-slate-200 !rounded-l-lg"
                    dropdownClass="!bg-white !border-slate-200 !rounded-lg !shadow-xl"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  rows="2"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white placeholder-slate-400"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  GST Number <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={(e) => {
                    handleChange(e);
                    if (gstError) setGstError("");
                  }}
                  placeholder="e.g. 22AAAAA0000A1Z5"
                  className={`w-full border ${
                    gstError ? "border-red-500 shadow-sm shadow-red-100" : "border-slate-200"
                  } rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white placeholder-slate-400 transition-all`}
                />
                {gstError && (
                  <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {gstError}
                  </p>
                )}
              </div>

              {editCustomerId && (
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Account Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                    className="w-full flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all hover:border-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${formData.status === "Active" ? "bg-green-500" : "bg-slate-400"}`}></span>
                      <span className="font-medium text-slate-700">{formData.status}</span>
                    </div>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isStatusOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isStatusOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)}></div>
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-20 overflow-hidden py-1 transform origin-top animate-in fade-in zoom-in duration-200">
                        {["Active", "Inactive"].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, status });
                              setIsStatusOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${status === "Active" ? "bg-green-500" : "bg-slate-400"}`}></span>
                              <span className={`${formData.status === status ? "text-[#0F3A53] font-bold" : "text-slate-600"}`}>
                                {status}
                              </span>
                            </div>
                            {formData.status === status && <Check size={14} className="text-[#0F3A53]" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveCustomer}
                className="px-6 py-2.5 bg-[#0F3A53] text-white text-sm font-semibold rounded-lg hover:bg-[#0F3A53]"
              >
                {editCustomerId ? "Update Customer" : "Save Customer"}
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
        title="Delete Customer"
        message={`Are you sure you want to delete "${customerToDelete?.name}"? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete Customer"
      />
    </div>
  );
};

export default Customers;