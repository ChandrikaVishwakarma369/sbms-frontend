export const getCustomersMock = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  try {
    const response = await fetch('/mock/customers.json');
    if (!response.ok) throw new Error("Failed to fetch customers");
    return await response.json();
  } catch (error) {
    console.error("Customers mock fetch error:", error);
    throw new Error("Could not load customers data");
  }
};
