const API_URL = "http://localhost:5000/api/invoices";

// ✅ Token helper — localStorage se JWT lena
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─── GET ALL INVOICES ─────────────────────────────────────────────────────────
export const getInvoices = async ({ search = "", status = "", page = 1, limit = 10 } = {}) => {
  try {
    const params = new URLSearchParams();
    if (search.trim()) params.append("search", search.trim());
    if (status && status !== "All Status") params.append("status", status);
    params.append("page", page);
    params.append("limit", limit);

    const response = await fetch(`${API_URL}?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    return data.success
      ? { invoices: data.data, pagination: data.pagination }
      : { invoices: [], pagination: null };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return { invoices: [], pagination: null };
  }
};

// ─── GET STATS ────────────────────────────────────────────────────────────────
export const getInvoiceStats = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    return data.success
      ? data.data
      : { totalPaid: 0, totalPending: 0, totalOverdue: 0 };
  } catch (error) {
    console.error("Error fetching invoice stats:", error);
    return { totalPaid: 0, totalPending: 0, totalOverdue: 0 };
  }
};

// ─── GET SINGLE ───────────────────────────────────────────────────────────────
export const getInvoiceById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return null;
  }
};

// ─── CREATE INVOICE ───────────────────────────────────────────────────────────
export const createInvoice = async (invoiceData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(invoiceData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

// ─── UPDATE INVOICE ───────────────────────────────────────────────────────────
export const updateInvoice = async (id, invoiceData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(invoiceData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

// ─── DELETE INVOICE ───────────────────────────────────────────────────────────
export const deleteInvoice = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};