const API_URL = "http://localhost:5000/api/customers";

export const getCustomers = async (status, gst) => {
  try {
    let url = API_URL;
    const params = new URLSearchParams();
    
    if (status && status !== "All") params.append("status", status);
    if (gst === "true" || gst === "false") params.append("gst", gst);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const getCustomerStats = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`);
    const data = await response.json();
    return data.success ? data.data : { totalCustomers: 0, activeCustomers: 0, customersWithGST: 0 };
  } catch (error) {
    console.error("Error fetching customer stats:", error);
    return { totalCustomers: 0, activeCustomers: 0, customersWithGST: 0 };
  }
};

export const createCustomer = async (customerData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

export const getCustomersMock = getCustomers; // Keep for backward compatibility if needed
