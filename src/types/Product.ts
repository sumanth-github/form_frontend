import mongoose, { Schema, Document } from "mongoose";

export interface ProductData {
  _id?: string;
  name: string;
  category: ProductCategory;
  description: string;
  followUpAnswers: Record<string, string>;
  aiQuestions?: string[];
  questions?: QA[];
}
export interface QA {
  question: string;
  answer: string;
}
export type ProductCategory ='Food' | 'Vegetable' | 'Fruit' | 'Wellness'| 'Eco'
  | 'Beauty'
  | 'Tech'
  | 'Fashion'
  | 'Fitness'
  | 'Home'
  | 'Education';

export interface FormStep {
  id: number;
  title: string;
  description: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  required: boolean;
}

export interface IProduct extends Document {
  name: string;
  category: string;
  description: string;
  questions: { question: string; answer: string }[]; // new field
  createdAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        answer: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
