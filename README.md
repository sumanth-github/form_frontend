# **Product Transparency App**

A Full Stack + AI-powered application that collects product details and generates AI-guided follow-up questions to ensure complete transparency for **Food, Eco, and Wellness products**.

---

## **Frontend – `form_frontend`**

### **Setup Instructions**

1. Clone the repository:

```bash
git clone https://github.com/sumanth-github/form_frontend.git
cd form_frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
VITE_BACKEND_API=https://backend-delta-orpin-20.vercel.app
```

4. Start the development server:

```bash
npm run dev
```

5. Visit `http://localhost:5173` to access the app.

---

### **Features**

* Multi-step product submission form
* AI-powered follow-up questions for product transparency
* Review and edit previous answers
* Progress summary for answered questions
* Fully responsive UI with real-time updates

---

### **AI Service Documentation**

* AI questions are generated dynamically using the backend AI service (`/api/ai/generate-next-question`).
* For each product, the AI creates follow-up questions based on **name, category, description**, and previous answers.
* Categories supported: `Food`, `Eco`, `Wellness`.

---

### **Sample Product Entry**

```json
{
  "name": "Organic Almond Butter",
  "category": "Food",
  "description": "Raw organic almond butter made without preservatives.",
  "questions": [
    { "question": "Does it contain any added sugar?", "answer": "No, 100% natural almonds only." },
    { "question": "Is it processed in a facility with nuts?", "answer": "Yes, contains cross-contact warnings." }
  ]
}
```

**Example Report:**

* All ingredients listed
* Allergens disclosed
* Product certifications displayed
* AI-driven follow-up questions answered

---

### **Reflection**

During development, AI tools were used to dynamically generate context-aware follow-up questions for each product. This ensures that users provide complete, relevant details without manually creating long forms for each category.

Architectural principles focused on **modularity**, **separation of concerns**, and **scalability**. The frontend communicates with a dedicated AI backend service, keeping AI logic separate from UI rendering. Product transparency logic was guided by **user-centered design**, ensuring clarity, accountability, and completeness of product information.

---
