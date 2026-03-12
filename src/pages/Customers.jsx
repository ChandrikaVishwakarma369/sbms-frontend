import React, { useState, useEffect } from "react";
import {Search,Plus,Filter,Edit2,Trash2,Users,Mail,Building2,} from "lucide-react";
import { getCustomersMock } from "../services/customer.service";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const handleAddCustomer = () => {
    if (!formData.name || !formData.email || !formData.phone) return;

    const newCustomer = {
      id: Date.now(),
      ...formData,
    };

    setCustomers([...customers, newCustomer]);

    setFormData({
      name: "",
      email: "",
      phone: "",
      gst: "",
    });

    setIsAddModalOpen(false);
  };

  const handleDelete = (id) => {
    const updated = customers.filter((c) => c.id !== id);
    setCustomers(updated);
  };

  return (
    <div className="flex flex-col gap-6 w-full p-8 bg-slate-100 min-h-screen">
      
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Customers</h1>
          <p className="text-sm text-slate-500">
            Manage your client directory and contact details
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white shadow-sm border rounded-xl p-5 flex items-center gap-4">
          <Users className="text-indigo-600" />
          <div>
            <p className="text-xs text-slate-500">Total Customers</p>
            <p className="text-2xl font-bold">{customers.length}</p>
          </div>
        </div>

        <div className="bg-white shadow-sm border rounded-xl p-5 flex items-center gap-4">
          <Building2 className="text-emerald-600" />
          <div>
            <p className="text-xs text-slate-500">Active</p>
            <p className="text-2xl font-bold">{customers.length}</p>
          </div>
        </div>

        <div className="bg-white shadow-sm border rounded-xl p-5 flex items-center gap-4">
          <Mail className="text-amber-600" />
          <div>
            <p className="text-xs text-slate-500">With GST</p>
            <p className="text-2xl font-bold">
              {customers.filter((c) => c.gst).length}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN TABLE */}

      <div className="bg-white shadow-sm border rounded-xl overflow-hidden">

        {/* SEARCH */}

        <div className="flex items-center justify-between p-5 border-b">

          <div className="flex items-center border rounded-lg px-3 py-2 w-72 bg-slate-50">
            <Search size={16} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search customers..."
              className="ml-2 outline-none text-sm w-full bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-slate-50 text-sm">
            <Filter size={16} />
            Filter
          </button>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left px-6 py-3">Customer</th>
                <th className="text-left px-6 py-3">Email</th>
                <th className="text-left px-6 py-3">Phone</th>
                <th className="text-left px-6 py-3">GST</th>
                <th className="text-right px-6 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>

              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-500">
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">

                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${
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
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {customer.gst}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button className="p-2 hover:bg-indigo-50 rounded">
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="p-2 hover:bg-red-50 rounded text-red-500"
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
      </div>

      {/* MODAL */}

      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4 shadow-lg">

            <h2 className="text-lg font-semibold text-slate-700">
              Add Customer
            </h2>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Business Name"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-indigo-500"
            />

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            <input
              name="gst"
              value={formData.gst}
              onChange={handleChange}
              placeholder="GST (optional)"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            <div className="flex justify-end gap-3 pt-2">

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleAddCustomer}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
              >
                Save Customer
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;