import { useState } from "react";
import { useEffect } from "react";
import API from "../utils/api";
import { X } from "lucide-react";

function EditProductModal({ product, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: product.name,
    category: product.category,
    price: product.price,
    stock: product.stock,
    gst: product.gst || 0,
    status: product.status || "Active",
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // Form reload prevent karne ke liye
    onUpdate(product._id, form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              placeholder="e.g. Wireless Mouse"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#0F3A53] focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#0F3A53] focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Units
              </label>
              <input
                type="number"
                placeholder="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#0F3A53] focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* GST */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST (%)
              </label>
              <input
                type="number"
                placeholder="0"
                value={form.gst}
                onChange={(e) => setForm({ ...form, gst: e.target.value })}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#0F3A53] focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-[#0F3A53] outline-none bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#0F3A53] text-white font-medium rounded-lg hover:bg-[#164a69] shadow-md transition-all active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const CATEGORIES = [
  "All",
  "Electronics",
  "Accessories",
  "Computers",
  "Wearables",
  "Cameras",
];
const STATUSES = ["All", "Active", "Low Stock", "Inactive"];
const ITEMS_PER_PAGE = 8;

const statusConfig = {
  Active: { bg: "bg-teal-500/20", text: "text-teal-600", dot: "bg-teal-500" },
  "Low Stock": {
    bg: "bg-[#d97706]/20",
    text: "text-[#d97706]",
    dot: "bg-[#d97706]",
  },
  Inactive: {
    bg: "bg-[#dc2626]/20",
    text: "text-[#dc2626]",
    dot: "bg-[#dc2626]",
  },
};

// Add Product Modal
function AddProductModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    gst: "",
    status: "Active",
  });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.price || !form.gst) return;
    onAdd({
      ...form,
      id: Date.now(),
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      gst: parseFloat(form.gst) || 0,
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=56&h=56&fit=crop",
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div className="bg-slate-100 border border-[#0F3A53]/20 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#0F3A53]">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[#0F3A53] hover:cursor-pointer transition text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {[
            { label: "Product Name", key: "name", type: "text", placeholder: "Enter product name" },
            { label: "Price (₹)", key: "price", type: "number", placeholder: "0.00" },
            { label: "Stock Quantity", key: "stock", type: "number", placeholder: "0" },
            { label: "GST (%)", key: "gst", type: "number", placeholder: "0" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-white border border-[#0F3A53]/20 rounded-xl px-4 py-2.5 text-sm text-[#0F3A53] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53]/30 transition"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-white border border-[#0F3A53]/20 rounded-xl px-4 py-2.5 text-sm text-[#0F3A53] focus:outline-none focus:ring-2 focus:ring-[#0F3A53]/30 transition"
            >
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-white border border-[#0F3A53]/20 rounded-xl px-4 py-2.5 text-sm text-[#0F3A53] focus:outline-none focus:ring-2 focus:ring-[#0F3A53]/30 transition"
            >
              {STATUSES.filter((s) => s !== "All").map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-[#0F3A53]/20 text-gray-500 hover:cursor-pointer rounded-xl py-2.5 text-sm font-semibold hover:bg-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#0F3A53] hover:cursor-pointer text-white rounded-xl py-2.5 text-sm font-semibold transition shadow-lg"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Products Component ──
export default function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const [editProduct, setEditProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = products.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchStat = status === "All" || p.status === status;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStat && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleAdd = async (product) => {
    try {
      const res = await API.post("/products/add", product);
      setProducts((prev) => [res.data.product, ...prev]);
      setPage(1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await API.put(`/products/${id}`, updatedData);

      setProducts((prev) =>
        prev.map((p) => (p._id === id ? res.data.product : p))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const totalProducts = products.length;
  const activeCount = products.filter((p) => p.status === "Active").length;
  const lowStockCount = products.filter((p) => p.status === "Low Stock").length;
  const inactiveCount = products.filter((p) => p.status === "Inactive").length;

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-[#0F3A53]">
      {/*  Page Header  */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F3A53] tracking-tight">
            Products
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage your product inventory
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#0F3A53] hover:bg-[#0a2e42] hover:cursor-pointer text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg"
        >
          <span className="text-lg leading-none">+</span>
          Add Product
        </button>
      </div>

      {/*  Stats Cards  */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Products",
            value: totalProducts,
            color: "text-[#0F3A53]",
            icon: "📦",
          },
          {
            label: "Active",
            value: activeCount,
            color: "text-teal-600",
            icon: "✅",
          },
          {
            label: "Low Stock",
            value: lowStockCount,
            color: "text-[#d97706]",
            icon: "⚠️",
          },
          {
            label: "Inactive",
            value: inactiveCount,
            color: "text-[#dc2626]",
            icon: "🚫",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-[#0F3A53]/10 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm"
          >
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/*  Filters  */}
      <div className="bg-white border border-[#0F3A53]/10 rounded-2xl px-5 py-4 mb-4 flex flex-wrap gap-4 items-end shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="bg-slate-100 border border-[#0F3A53]/20 rounded-xl px-3 py-2 text-sm text-[#0F3A53] focus:outline-none focus:ring-2 focus:ring-[#0F3A53]/30 transition min-w-36"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="bg-slate-100 border border-[#0F3A53]/20 rounded-xl px-3 py-2 text-sm text-[#0F3A53] focus:outline-none focus:ring-2 focus:ring-[#0F3A53]/30 transition min-w-36"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-w-48">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Search
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-100 border border-[#0F3A53]/20 rounded-xl pl-9 pr-4 py-2 text-sm text-[#0F3A53] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F3A53]/30 transition"
            />
          </div>
        </div>

        <div className="ml-auto self-end">
          <span className="text-sm text-gray-500">
            <span className="text-[#0F3A53] font-semibold">
              {filtered.length}
            </span>{" "}
            products found
          </span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-[#0F3A53]/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#0F3A53]/10 bg-slate-50">
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-right px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-center px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="text-center px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  GST %
                </th>
                <th className="text-center px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0F3A53]/5">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500">
                    <div className="text-4xl mb-3">📭</div>
                    <div>No products match your filters</div>
                  </td>
                </tr>
              ) : (
                paginated.map((product) => {
                  const sc =
                    statusConfig[product.status] || statusConfig["Inactive"];
                  return (
                    <tr
                  key={product._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-[#0F3A53]/10 shrink-0"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                product.name
                              )}&size=40&background=0F3A53&color=ffffff`;
                            }}
                          />
                          <span className="font-semibold text-[#0F3A53]">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-gray-500">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="font-bold text-[#0F3A53]">
                        {product.price.toFixed(2)} 
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`font-semibold ${
                            product.stock === 0
                              ? "text-[#dc2626]"
                              : product.stock < 10
                              ? "text-[#d97706]"
                              : "text-gray-500"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-semibold text-gray-500">
                          {product.gst || 0}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${sc.bg} ${sc.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                          ></span>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditProduct(product);
                              setShowEditModal(true);
                            }}
                            className="text-xs px-3 py-1.5 rounded-lg border border-[#0F3A53]/30 text-[#0F3A53] hover:bg-[#0F3A53]/10 transition font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-[#dc2626]/30 text-[#dc2626] hover:bg-[#dc2626]/10 transition font-medium"
                          >
                            Delete
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
      </div>

      {/*  Pagination  */}
      <div className="flex items-center justify-between mt-4 px-1">
        <span className="text-sm text-gray-500">
          Showing{" "}
          <span className="text-[#0F3A53] font-medium">
            {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
            {Math.min(page * ITEMS_PER_PAGE, filtered.length)}
          </span>{" "}
          of{" "}
          <span className="text-[#0F3A53] font-medium">{filtered.length}</span>
        </span>

        <div className="flex items-center gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-sm rounded-xl border border-[#0F3A53]/20 hover:cursor-pointer text-gray-500 hover:bg-white disabled:opacity-30 transition"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 text-sm rounded-xl font-semibold transition ${
                p === page
                  ? "bg-[#0F3A53] text-white shadow-lg"
                  : "border border-[#0F3A53]/20 text-gray-500 hover:bg-white"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-sm rounded-xl border border-[#0F3A53]/20 hover:cursor-pointer text-gray-500 hover:bg-white disabled:opacity-30 transition"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
      {showEditModal && editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}