import React, { useState, useRef } from "react";
import { ProductData, FormStep, QA } from "../types/Product";
import { ProductDetailsStep } from "./ProductDetailsStep";
import { FollowUpStepRef, FollowUpStep } from "./FollowUpStep";
import { PreviewStep } from "./PreviewStep";
import { StepNavigation } from "./StepNavigation";
import axios from "axios";
import { api } from "../api/aiApi";

const FORM_STEPS: FormStep[] = [
  { id: 1, title: "Product Details", description: "Basic information about your product" },
  { id: 2, title: "Follow-up Questions", description: "Answer questions one by one" },
  { id: 3, title: "Review & Submit", description: "Review your information before submission" },
];

export const ProductSubmissionForm: React.FC = () => {
  const followUpRef = useRef<FollowUpStepRef>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    category: "" as any,
    description: "",
    followUpAnswers: {},
    questions: [],
    aiQuestions: [],
  });
  const [productId, setProductId] = useState<string | null>(null);

  const updateProductData = (updates: Partial<ProductData>) => {
    setProductData((prev) => ({ ...prev, ...updates }));
  };

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 1:
        return !!(productData.name && productData.category && productData.description);
      case 2:
        // Can proceed from step 2 if we have at least one answered question
        return (productData.questions?.some((q: QA) => q.answer?.trim()) || false);
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    // For step 2 (Follow-up Questions), save all current progress before moving
    if (currentStep === 2) {
      followUpRef.current?.saveAllProgress();
    }

    if (canProceedFromStep(currentStep) && currentStep < FORM_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      console.log("📤 Submitting product data:", productData);

      // Filter out unanswered questions before submitting
      const answeredQuestions = (productData.questions || []).filter(q => q.answer?.trim());

      // Payload: include only answered questions
      const payload = {
        name: productData.name,
        category: productData.category,
        description: productData.description,
        questions: answeredQuestions,
        submitted:true,
      };

      const res = await api.post("/products", payload);
      setProductData((prev) => ({ ...prev, questions: res.data.questions || [], _id: res.data._id }));
      setProductId(res.data._id);
      setIsSubmitted(true);
      alert("✅ Product submitted successfully!");
    } catch (err: any) {
      console.error("❌ Failed to submit product", err.response?.data || err.message);
      alert("Failed to submit product. Please try again.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProductDetailsStep data={productData} onUpdate={updateProductData} />;
      case 2:
        return (
          <FollowUpStep
            ref={followUpRef}
            data={productData}
            onUpdate={updateProductData}
            productId={productId}
          />
        );
      case 3:
        return (
          <PreviewStep
            data={productData}
            isSubmitted={isSubmitted}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Progress Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Product Submission</h1>
              <span className="text-blue-100 text-sm font-medium">
                Step {currentStep} of {FORM_STEPS.length}
              </span>
            </div>
            <div className="w-full bg-blue-500 bg-opacity-30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / FORM_STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {FORM_STEPS[currentStep - 1]?.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {FORM_STEPS[currentStep - 1]?.description}
              </p>
            </div>

            <div className="min-h-[400px]">{renderStep()}</div>

            <StepNavigation
              currentStep={currentStep}
              totalSteps={FORM_STEPS.length}
              onNext={handleNext}
              onBack={handleBack}
              canProceed={canProceedFromStep(currentStep)}
              isLastStep={currentStep === FORM_STEPS.length}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};