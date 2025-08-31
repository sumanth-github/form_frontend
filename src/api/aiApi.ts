import { api } from "./productApi"; // reuse the same axios instance

interface GenerateQuestionPayload {
  name: string;
  category: string;
  description: string;
  previousAnswer?: string | null;
  existingQuestionsCount?: number;
}

/**
 * Fetch the next follow-up question based on product details and previous answer.
 */
export const generateNextQuestion = async (payload: GenerateQuestionPayload): Promise<string | null> => {
  try {
    const res = await api.post("/ai/generate-next-question", payload);
    // backend returns { question: "..." } or null if no more questions
    return res.data.question ?? null;
  } catch (err: any) {
    console.error("❌ Failed to generate next question", err.response?.data || err.message);
    return null; // fail gracefully
  }
};
