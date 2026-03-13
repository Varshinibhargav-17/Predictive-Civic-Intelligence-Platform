import React, { useState, useRef } from "react";

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    } else {
      alert("Please upload an image file.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? "var(--primary)" : "var(--border-color)"}`,
          backgroundColor: isDragging ? "var(--primary-light)" : "var(--bg-surface-hover)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          textAlign: "center",
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: "none" }} 
          disabled={isLoading}
        />
        
        {preview ? (
          <div style={{ position: "relative", height: "100%", minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "var(--radius-md)", objectFit: "contain", opacity: isLoading ? 0.5 : 1 }} 
            />
            {isLoading && (
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "rgba(255,255,255,0.9)", padding: "0.5rem 1rem", borderRadius: "var(--radius-full)", fontWeight: "600", color: "var(--primary)", boxShadow: "var(--shadow-md)" }}>
                Analyzing Image...
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", color: "var(--text-secondary)" }}>
            <div style={{ width: "64px", height: "64px", backgroundColor: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-sm)", fontSize: "2rem" }}>
              📸
            </div>
            <div>
              <p style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "1.125rem", marginBottom: "0.25rem" }}>
                Click or drag an image here
              </p>
              <p style={{ fontSize: "0.875rem" }}>
                Upload a photo of the civic issue (pothole, garbage, etc.)
              </p>
            </div>
          </div>
        )}
      </div>
      
      {preview && !isLoading && (
        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <button 
            type="button" 
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              setPreview(null);
            }} 
            className="btn btn-outline"
            style={{ fontSize: "0.875rem", padding: "0.25rem 0.75rem" }}
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
