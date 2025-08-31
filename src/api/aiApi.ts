import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_API || "http://localhost:5000"; // keep without trailing slash
export const api = axios.create({
  baseURL: `${API_BASE}/api`, // appends /api to the backend URL
});

interface GenerateQuestionPayload {
  name: string;
  category: string;
  description: string;
  previousAnswer?: string | null; // optional, for dynamic generation
  existingQuestionsCount?: number;
}

/**
 * Fetch the next follow-up question based on product details and previous answer.
 */
export const generateNextQuestion = async (payload: GenerateQuestionPayload): Promise<string> => {
  try {
    const res = await axios.post(`${API_BASE}/ai/generate-next-question`, payload);
    // backend returns { question: "..." } or null if no more questions
    return res.data.question;
  } catch (err: any) {
    console.error("❌ Failed to generate next question", err.response?.data || err.message);
    throw err;
  }
};
