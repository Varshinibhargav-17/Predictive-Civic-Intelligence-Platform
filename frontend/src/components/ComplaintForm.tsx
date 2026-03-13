import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import { classifyImage } from "../api/api";

const CATEGORIES = [
  "Road & Potholes",
  "Drainage",
  "Sanitation & Garbage",
  "Streetlight",
  "Water Supply",
  "Encroachment",
  "Other"
];

const ComplaintForm: React.FC = (): React.JSX.Element => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    predicted_category: string;
    confidence: number;
    needs_manual_confirmation: boolean;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsAnalyzing(true);
    setResult(null);
    setSuccess(false);

    try {
      const response = await classifyImage(selectedFile);
      setResult(response.data);
      setSelectedCategory(response.data.predicted_category);
    } catch (error) {
      console.error("Classification error:", error);
      // Mock result if backend is unavailable
      setTimeout(() => {
        const isLowConfidence = Math.random() > 0.5;
        const mockResult = {
          predicted_category: "Road & Potholes",
          confidence: isLowConfidence ? 0.45 : 0.88,
          needs_manual_confirmation: isLowConfidence
        };
        setResult(mockResult);
        setSelectedCategory(mockResult.predicted_category);
        setIsAnalyzing(false);
      }, 1500);
      return;
    }
    
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedCategory) return;
    
    setIsSubmitting(true);
    
    // Simulate submission to backend
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        if (success) { // only reset if still on success screen
            setFile(null);
            setResult(null);
            setSelectedCategory("");
            setDescription("");
            setSuccess(false);
        }
      }, 3000);
    }, 1000);
  };

  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
        <div style={{ 
          width: "80px", height: "80px", 
          backgroundColor: "var(--success-light)", 
          color: "var(--success)", 
          borderRadius: "50%", 
          display: "flex", alignItems: "center", justifyContent: "center", 
          fontSize: "2.5rem", margin: "0 auto 1.5rem" 
        }}>
          ✅
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>
          Complaint Submitted Successfully
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          Your civic issue has been recorded and routed to the {selectedCategory} department.
        </p>
        <button 
          onClick={() => {
            setFile(null);
            setResult(null);
            setSelectedCategory("");
            setDescription("");
            setSuccess(false);
          }}
          className="btn btn-primary"
        >
          Submit Another Issue
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>1. Photo Evidence</h3>
        <ImageUploader onFileSelect={handleFileSelect} isLoading={isAnalyzing} />
      </div>

      {result && (
        <div style={{ 
          backgroundColor: result.needs_manual_confirmation ? "var(--warning-light)" : "var(--primary-light)",
          border: `1px solid ${result.needs_manual_confirmation ? "var(--warning)" : "var(--primary)"}`,
          padding: "1.5rem",
          borderRadius: "var(--radius-md)",
          animation: "fadeIn 0.3s ease-in-out"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div style={{ fontSize: "1.5rem", marginTop: "0.25rem" }}>
              {result.needs_manual_confirmation ? "⚠️" : "🤖"}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.25rem", color: result.needs_manual_confirmation ? "var(--warning-hover)" : "var(--primary-hover)" }}>
                AI Analysis Complete
              </h4>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", fontSize: "0.875rem" }}>
                Confidence Score: <strong style={{ color: "var(--text-primary)" }}>{(result.confidence * 100).toFixed(1)}%</strong>
              </p>

              {result.needs_manual_confirmation ? (
                <div>
                  <p style={{ marginBottom: "0.75rem", fontSize: "0.875rem", color: "var(--warning-hover)" }}>
                    We're not entirely sure about this one. Please confirm or change the category:
                  </p>
                  <select 
                    className="form-select" 
                    value={selectedCategory} 
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                    style={{ backgroundColor: "white", borderColor: "var(--warning)" }}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "white", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--primary-light)" }}>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Detected Category:</span>
                    <span style={{ fontWeight: "600", color: "var(--primary-hover)" }}>{result.predicted_category}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setResult({ ...result, needs_manual_confirmation: true })}
                    style={{ display: "block", marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--text-secondary)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Incorrect category? Change it manually.
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {file && (
        <div style={{ opacity: result ? 1 : 0.5, pointerEvents: result ? "auto" : "none", transition: "opacity 0.3s" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>2. Additional Details</h3>
          
          <div className="form-group">
            <label className="form-label" htmlFor="description">Description (Optional)</label>
            <textarea 
              id="description"
              className="form-input" 
              rows={4} 
              placeholder="Add any specific details about the location or issue severity..."
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>

          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting || !selectedCategory}
              style={{ padding: "0.75rem 2rem", fontSize: "1.125rem", opacity: (isSubmitting || !selectedCategory) ? 0.7 : 1 }}
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default ComplaintForm;
