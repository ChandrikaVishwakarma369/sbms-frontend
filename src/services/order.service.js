export const getOrdersMock = async () => {
  await new Promise((res) => setTimeout(res, 500));

  try {
    const res = await fetch("/mock/orders.json");
    if (!res.ok) throw new Error("Failed to fetch orders");
    return await res.json();
  } catch (error) {
    console.error("Orders fetch error:", error);
    throw error;
  }
};