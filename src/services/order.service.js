const API_URL = "http://localhost:5000/api/orders";

// 📥 GET ALL ORDERS
export const getOrdersMock = async () => {
  try {
    const res = await fetch(`${API_URL}/`);
    if (!res.ok) throw new Error("Failed to fetch orders");
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Orders fetch error:", error);
    throw error;
  }
};

// 📖 GET SINGLE ORDER
export const getOrderById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch order");
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Order fetch error:", error);
    throw error;
  }
};

// ➕ CREATE NEW ORDER
export const createOrder = async (orderData) => {
  try {
    console.log("Creating order with data:", orderData);
    console.log("API URL:", `${API_URL}/`);
    
    const res = await fetch(`${API_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    
    const data = await res.json();
    console.log("Response status:", res.status);
    console.log("Response data:", data);
    
    if (!res.ok) {
      throw new Error(data.message || "Failed to create order");
    }
    
    return data.data;
  } catch (error) {
    console.error("Order creation error:", error.message);
    throw error;
  }
};

// ✏️ UPDATE ORDER
export const updateOrder = async (id, orderData) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error("Failed to update order");
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Order update error:", error);
    throw error;
  }
};

// ❌ DELETE ORDER
export const deleteOrder = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete order");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Order deletion error:", error);
    throw error;
  }
};

// 📊 GET ORDER STATISTICS
export const getOrderStats = async () => {
  try {
    const res = await fetch(`${API_URL}/stats`);
    if (!res.ok) throw new Error("Failed to fetch order statistics");
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Order stats fetch error:", error);
    throw error;
  }
};