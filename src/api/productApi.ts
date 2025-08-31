import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_API || "http://localhost:5000"; // keep without trailing slash
export const api = axios.create({
  baseURL: `${API_BASE}/api`, // appends /api to the backend URL
});
interface Question {
  question: string;
  answer: string;
}

interface ProductPayload {
  name: string;
  category: string;
  description: string;
  questions?: Question[];
  submitted:true;
}

// Create a new product
export const createProduct = async (data: ProductPayload) => {
  const res = await axios.post(`${API_BASE}/products`, data);
  return res.data;
};

// Get all products
export const getProducts = async () => {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
};

// Get product by ID
export const getProductById = async (id: string) => {
  const res = await axios.get(`${API_BASE}/products/${id}`);
  return res.data;
};
