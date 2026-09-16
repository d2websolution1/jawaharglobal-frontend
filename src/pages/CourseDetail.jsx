import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "https://jawaharglobal-backend.onrender.com";

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Directly redirect to learn page
    navigate(`/courses/${slug}/learn`, { replace: true });
  }, [slug, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#F2A93B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Redirecting to course...</p>
      </div>
    </div>
  );
}