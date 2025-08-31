import axios from "axios";

// Fix: Use VITE_BACKEND_API to match your .env file
const API_BASE = import.meta.env.VITE_BACKEND_API || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log(`🔄 Making API request to: ${config.baseURL}${config.url}`);
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ API error from ${error.config?.url}:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

interface Question {
  question: string;
  answer: string;
}

interface ProductPayload {
  name: string;
  category: string;
  description: string;
  questions?: Question[];
  submitted?: boolean;
}

// Create a new product
export const createProduct = async (data: ProductPayload) => {
  try {
    const res = await api.post("/products", data);
    return res.data;
  } catch (err: any) {
    console.error("❌ Failed to create product", err.response?.data || err.message);
    throw err;
  }
};

// Get all products
export const getProducts = async () => {
  try {
    const res = await api.get("/products");
    return res.data;
  } catch (err: any) {
    console.error("❌ Failed to fetch products", err.response?.data || err.message);
    throw err;
  }
};

// Get product by ID
export const getProductById = async (id: string) => {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("❌ Failed to fetch product by ID", err.response?.data || err.message);
    throw err;
  }
};