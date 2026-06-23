// Wahi mock data jo Products.jsx mein hai
const PRODUCTS_MOCK = [
  // ... aapka purana sara mock data yaha rahega ...
  {
    id: 1,
    name: "Smartphone X",
    category: "Electronics",
    price: 19900.0,
    status: "Active",
    stock: 45,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=56&h=56&fit=crop",
  },
  // ... baki items
];

export const getProducts = () => {
  return PRODUCTS_MOCK.filter((p) => p.status !== "Inactive");
};

// 👇 YE NAYA FUNCTION ADD KARNA HAI 👇

// Agar aap Axios use kar rahi hain (jo ki MERN stack mein common hai):
import axios from "axios"; 

export const searchProducts = async ({ keyword, category, minPrice, maxPrice }) => {
  try {
    // Yahan apni backend API ka base URL set karein, e.g., 'https://sbms-backend.onrender.com/api/products/search'
    // Agar proxy set hai to direct '/api/products/search' likh sakti hain
    
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (category) params.append("category", category);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    const response = await axios.get(`/api/products/search?${params.toString()}`);
    
    // Aapke backend controller ke hisab se response.data mein { success: true, products: [...] } aayega
    return response.data; 
  } catch (error) {
    console.error("Error searching products from backend:", error);
    return { success: false, products: [] };
  }
};