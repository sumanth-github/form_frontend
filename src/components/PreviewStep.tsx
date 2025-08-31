import React, { useState, useEffect } from 'react';
import { Eye, Download, CheckCircle } from 'lucide-react';
import { ProductData } from '../types/Product';
import { getCategoryColor } from '../utils/categories';
import { api } from '../api/productApi';

interface PreviewStepProps {
  data: ProductData;
  isSubmitted: boolean;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({ data, isSubmitted }) => {
  const [downloading, setDownloading] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Fetch AI summary preview once product is submitted
  useEffect(() => {
    const fetchSummary = async () => {
      if (!isSubmitted || !data._id) return;

      setLoadingSummary(true);
      try {
        const res = await api.get(`/reports/preview/${data._id}`);
        setSummary(res.data.summary || 'No summary available');
      } catch (err) {
        console.error('❌ Failed to fetch summary preview', err);
        setSummary('Failed to load AI-generated summary.');
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchSummary();
  }, [isSubmitted, data._id]);

  // Download PDF - Fixed to use the same api instance
  const handleDownloadReport = async () => {
    if (!data._id) return;

    try {
      setDownloading(true);
      console.log(`🔄 Downloading PDF for product ID: ${data._id}`);
      
      // Use the same api instance with proper configuration
      const response = await api.post(
        `/reports/generate/${data._id}`,
        {},
        { 
          responseType: 'blob',
          timeout: 60000 // 60 second timeout for PDF generation
        }
      );

      // Verify we got a blob response
      if (!(response.data instanceof Blob)) {
        throw new Error('Invalid response format - expected PDF blob');
      }

      console.log('✅ PDF blob received, size:', response.data.size);

      // Create download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Product_Summary_${data.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('✅ PDF download initiated successfully');
    } catch (err: any) {
      console.error('❌ Failed to download PDF:', err);
      
      // More specific error messages
      if (err.code === 'ECONNABORTED') {
        alert('PDF generation timed out. Please try again.');
      } else if (err.response?.status === 404) {
        alert('Product not found. Please refresh and try again.');
      } else if (err.response?.status === 500) {
        alert('Server error while generating PDF. Please try again in a moment.');
      } else {
        alert(`Failed to download report: ${err.message || 'Unknown error'}. Please try again.`);
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isSubmitted ? 'bg-green-100' : 'bg-purple-100'
          }`}
        >
          {isSubmitted ? <CheckCircle className="w-8 h-8 text-green-600" /> : <Eye className="w-8 h-8 text-purple-600" />}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isSubmitted ? 'Submission Complete!' : 'Review & Submit'}
        </h2>
        <p className="text-gray-600">
          {isSubmitted
            ? 'Your product has been successfully submitted for review'
            : 'Please review your information before submitting'}
        </p>
      </div>

      {/* Product Info */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Name & Category */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Product Name
              </h4>
              <p className="text-lg font-medium text-gray-900">{data.name}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Category
              </h4>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                  data.category
                )}`}
              >
                {data.category}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Description
            </h4>
            <p className="text-gray-700 leading-relaxed">{data.description}</p>
          </div>

          {/* Follow-Up Questions - Only show answered questions */}
          {data.questions && data.questions.filter(q => q.answer?.trim()).length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Follow-Up Questions
              </h4>
              <div className="space-y-4">
                {data.questions
                  .filter(q => q.answer?.trim()) // Only show answered questions
                  .map((q, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Q{idx + 1}: {q.question}
                      </p>
                      <p className="text-gray-800">
                        <strong>A:</strong> {q.answer}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Summary Preview */}
      {isSubmitted && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">AI-Generated Summary</h4>
          {loadingSummary ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <p className="text-blue-700">Generating summary preview…</p>
            </div>
          ) : (
            <p className="text-blue-700 whitespace-pre-line">{summary}</p>
          )}
        </div>
      )}

      {/* Download PDF */}
      {isSubmitted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-green-800 mb-1">
                Ready for Download
              </h4>
              <p className="text-green-700">
                Your product analysis summary is ready. Download it to review AI-generated insights.
              </p>
            </div>
            <button
              onClick={handleDownloadReport}
              disabled={downloading || !data._id}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {downloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating PDF...
                </>
              ) : (
                'Download Summary'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
