import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { MessageCircleQuestion, ChevronRight, CheckCircle2 } from "lucide-react";
import { ProductData, FollowUpQuestion, QA } from "../types/Product";
import { generateNextQuestion } from "../api/aiApi";

const MAX_QUESTIONS = 5;

interface FollowUpStepProps {
  data: ProductData;
  onUpdate: (updates: Partial<ProductData>) => void;
  productId: string | null;
}

export type FollowUpStepRef = {
  saveAllProgress: () => void;
};

export const FollowUpStep = forwardRef<FollowUpStepRef, FollowUpStepProps>(
  ({ data, onUpdate }, ref) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [answerBuffer, setAnswerBuffer] = useState("");
    const [isGeneratingNext, setIsGeneratingNext] = useState(false);

    // Initialize answer buffer when switching questions
    useEffect(() => {
      const currentQuestion = data.questions?.[currentQuestionIndex];
      if (currentQuestion) {
        setAnswerBuffer(currentQuestion.answer || "");
      }
    }, [currentQuestionIndex, data.questions]);

    // Fetch first question only once
    useEffect(() => {
      if (!data.name || !data.category || !data.description) return;
      if (data.questions?.length) return; // already have questions

      const fetchFirstQuestion = async () => {
        setLoading(true);
        try {
          const questionText = await generateNextQuestion({
            name: data.name,
            category: data.category,
            description: data.description,
            previousAnswer: null,
          });

          if (!questionText) return;

          onUpdate({
            aiQuestions: [questionText],
            questions: [{ question: questionText, answer: "" }],
          });
        } catch (err) {
          console.error("Failed to fetch first question:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchFirstQuestion();
    }, [data.name, data.category, data.description, onUpdate]);

    // Save current answer to the questions array
    const saveCurrentAnswer = () => {
      if (!answerBuffer.trim() || !data.questions?.[currentQuestionIndex]) return;

      const updatedQuestions = [...(data.questions || [])];
      updatedQuestions[currentQuestionIndex] = {
        ...updatedQuestions[currentQuestionIndex],
        answer: answerBuffer.trim(),
      };

      // Also update followUpAnswers for backward compatibility
      const updatedFollowUpAnswers = {
        ...data.followUpAnswers,
        [`q${currentQuestionIndex}`]: answerBuffer.trim(),
      };

      onUpdate({
        questions: updatedQuestions,
        followUpAnswers: updatedFollowUpAnswers,
      });
    };

    // Save all progress (exposed via ref for external navigation)
    const saveAllProgress = () => {
      saveCurrentAnswer();
    };

    useImperativeHandle(ref, () => ({
      saveAllProgress,
    }));

    const handleNextQuestion = async () => {
      // Save current answer first
      saveCurrentAnswer();

      // If we've reached max questions, don't generate more
      if ((data.questions?.length || 0) >= MAX_QUESTIONS) {
        return;
      }

      setIsGeneratingNext(true);
      try {
        const lastAnswer = answerBuffer.trim();
        const nextQuestionText = await generateNextQuestion({
          name: data.name,
          category: data.category,
          description: data.description,
          previousAnswer: lastAnswer,
        });

        if (nextQuestionText) {
          const updatedQuestions = [...(data.questions || [])];
          const newQuestion: QA = { question: nextQuestionText, answer: "" };
          updatedQuestions.push(newQuestion);

          onUpdate({
            aiQuestions: [...(data.aiQuestions || []), nextQuestionText],
            questions: updatedQuestions,
          });

          // Move to the next question
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setAnswerBuffer(""); // Clear buffer for new question
        }
      } catch (err) {
        console.error("Failed to generate next question:", err);
      } finally {
        setIsGeneratingNext(false);
      }
    };

    const handlePreviousQuestion = () => {
      if (currentQuestionIndex > 0) {
        saveCurrentAnswer(); // Save current before moving
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    };

    const currentQuestion = data.questions?.[currentQuestionIndex];
    const totalQuestions = data.questions?.length || 0;
    const answeredQuestions = data.questions?.filter(q => q.answer?.trim()).length || 0;
    const canGenerateMore = totalQuestions < MAX_QUESTIONS;
    const hasCurrentAnswer = answerBuffer.trim().length > 0;

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircleQuestion className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Follow-up Questions</h2>
          <p className="text-gray-600">
            Help us understand your {data.category?.toLowerCase()} product better
          </p>
          
          {/* Progress indicator */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {Math.min(totalQuestions + (canGenerateMore ? 1 : 0), MAX_QUESTIONS)}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-sm text-green-600 font-medium">
              {answeredQuestions} answered
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-500">Generating your first question...</p>
          </div>
        ) : currentQuestion ? (
          <div className="space-y-6">
            {/* Question Navigation */}
            {totalQuestions > 1 && (
              <div className="flex justify-between items-center py-2">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`text-sm px-3 py-1 rounded transition-all ${
                    currentQuestionIndex === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  ← Previous Question
                </button>
                <span className="text-xs text-gray-500">
                  Navigate between questions to review your answers
                </span>
                <div className="w-20"></div> {/* Spacer for balance */}
              </div>
            )}

            {/* Current Question */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
              <div className="flex items-start justify-between">
                <p className="font-semibold text-gray-700 flex-1">
                  {currentQuestion.question}
                </p>
                {currentQuestion.answer?.trim() && currentQuestionIndex !== (data.questions?.length || 0) - 1 && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" />
                )}
              </div>
              
              <textarea
                value={answerBuffer}
                onChange={(e) => setAnswerBuffer(e.target.value)}
                onBlur={saveCurrentAnswer} // Auto-save on blur
                placeholder="Please provide details..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
              />
              
              {/* Next Question Button - only show if we can generate more and have an answer */}
              {canGenerateMore && hasCurrentAnswer && (
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={handleNextQuestion}
                    disabled={isGeneratingNext || !hasCurrentAnswer}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isGeneratingNext ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating Next Question...</span>
                      </>
                    ) : (
                      <>
                        <span>Ask Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    This will save your current answer and generate the next question
                  </p>
                </div>
              )}
            </div>

            {/* Answered Questions Summary */}
            {answeredQuestions > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Progress Summary
                </h4>
                <p className="text-sm text-green-700">
                  You've answered {answeredQuestions} question{answeredQuestions !== 1 ? 's' : ''} so far.
                  {!canGenerateMore && " You've reached the maximum number of questions."}
                </p>
                {answeredQuestions > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    Click "Next" below when you're ready to review and submit your answers.
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">All follow-up questions completed!</p>
            <p className="text-sm text-gray-500">
              You can proceed to review your submission or go back to modify your answers.
            </p>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">💡 How it works</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Answer the current question in the text area above</li>
            <li>• Click "Ask Next Question" to generate and move to the next question</li>
            <li>• Use "Previous Question" to review or edit earlier answers</li>
            <li>• Click "Next Step" below to proceed to review (saves all progress)</li>
          </ul>
        </div>
      </div>
    );
  }
);

FollowUpStep.displayName = "FollowUpStep";