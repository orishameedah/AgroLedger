"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onFileNameChange: (name: string) => void;
  fileName: string | null;
}

export function ImageUpload({
  value,
  onChange,
  onFileNameChange,
  fileName,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    onFileNameChange(file.name);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "agroledger-marketplace"); // Hardcoded as requested

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/hameedah-images/image/upload`,
        { method: "POST", body: data }
      );
      const result = await res.json();
      if (result.secure_url) onChange(result.secure_url);
    } catch (error) {
      console.error("Upload Error", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="group relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-4xl p-8 text-center hover:border-emerald-500 transition-all bg-slate-50/30">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
      />
      <div className="relative z-0">
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-2" />
            <p className="text-sm font-bold text-slate-500">Uploading...</p>
          </div>
        ) : value ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="relative w-20 h-20 mb-2">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover rounded-xl border-2 border-emerald-500"
              />
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1">
                <CheckCircle2 size={14} />
              </div>
            </div>
            <p className="text-sm font-bold text-emerald-600 truncate max-w-50">
              Remove and change
            </p>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 mx-auto mb-2 text-slate-300 group-hover:text-emerald-500" />
            <p className="text-sm font-bold text-slate-500">
              Upload Produce Image
            </p>
          </>
        )}
      </div>
    </div>
  );
}
