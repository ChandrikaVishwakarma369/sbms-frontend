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
} from "lucide-react";
import { getCustomersMock } from "../services/customer.service";
import MainLayout from "../layout/MainLayout";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gst: "",
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomersMock();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to load customers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

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
      gst: "",
    });
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
      gst: customer.gst || "",
    });
    setEditCustomerId(customer.id);
    setIsAddModalOpen(true);
  };

  const handleSaveCustomer = () => {
    if (!formData.name || !formData.email || !formData.phone) return;

    if (editCustomerId) {
      const updated = customers.map((c) =>
        c.id === editCustomerId
          ? { ...c, ...formData, status: c.status || "Active" }
          : c
      );
      setCustomers(updated);
    } else {
      const newCustomer = {
        id: Date.now(),
        ...formData,
        status: "Active",
      };
      setCustomers([...customers, newCustomer]);
    }

    resetCustomerForm();
    setIsAddModalOpen(false);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (confirmDelete) {
      const updated = customers.filter((c) => c.id !== id);
      setCustomers(updated);
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
            <p className="text-2xl font-bold text-slate-800 mt-1">{customers.length}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg flex items-center justify-center">
            <Building2 className="text-green-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Active</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{customers.length}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-lg flex items-center justify-center">
            <Mail className="text-yellow-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">With GST</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {customers.filter((c) => c.gst).length}
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
                <th className="text-left px-6 py-3 border-b border-slate-200">Customer</th>
                <th className="text-left px-6 py-3 border-b border-slate-200">Email</th>
                <th className="text-left px-6 py-3 border-b border-slate-200">Phone</th>
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

                    <td className="px-6 py-4">
                      {customer.gst ? (
                        <span className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded">
                          {customer.gst}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 inline-flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Active
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
                          onClick={() => handleDelete(customer.id)}
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
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98XXXXXXXX"
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  GST Number <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  placeholder="e.g. 22AAAAA0000A1Z5"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white placeholder-slate-400"
                />
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
                onClick={handleSaveCustomer}
                className="px-6 py-2.5 bg-[#0F3A53] text-white text-sm font-semibold rounded-lg hover:bg-[#0F3A53]"
              >
                {editCustomerId ? "Update Customer" : "Save Customer"}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;