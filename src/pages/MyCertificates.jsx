import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getOrCreateVisitorId } from "../lib/visitor";
import { adminApi } from "../lib/adminApi";

const API = import.meta.env.VITE_API_URL || "https://jawaharglobal-backend.onrender.com";

export default function MyCertificates() {
  const visitorId = useMemo(() => getOrCreateVisitorId(), []);
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState(null);
  const [certificateName, setCertificateName] = useState("Diploma");

  // ✅ Fetch certificate name from settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminApi.get("/api/admin/settings");
        const data = res.data;
        setCertificateName(data.certificate_name || "Diploma");
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        setCertificateName("Diploma");
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    fetch(`${API}/api/certificates/me`, {
      headers: { "x-visitor-id": visitorId },
    })
      .then((r) => r.json())
      .then((data) => setCertificates(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load certificates"));
  }, [visitorId]);

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#0B2545] mb-2">
        My {certificateName}s
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        View all your issued {certificateName.toLowerCase()}s
      </p>
      {error && <p className="text-red-600 text-sm mb-6">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((c) => (
          <Link
            key={c.id}
            to={`/certificates/${c.id}`}
            className="block bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow hover:border-[#C62828]/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-extrabold text-gray-900 text-lg">{c.courseSlug}</div>
                <div className="text-sm text-gray-600 mt-1">{c.fullName}</div>
              </div>
              <span className="text-xs text-[#C62828] font-semibold bg-[#C62828]/10 px-2 py-1 rounded-full">
                {certificateName}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-3 font-mono">
              {certificateName} #: {c.certificateNumber}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Issued: {c.issuedAt ? new Date(c.issuedAt).toLocaleDateString('en-IN') : "—"}
            </div>
          </Link>
        ))}

        {certificates.length === 0 && !error && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📜</div>
            <p className="text-gray-500 font-medium">No {certificateName.toLowerCase()}s yet</p>
            <p className="text-gray-400 text-sm mt-1">Complete a course to generate one.</p>
            <Link 
              to="/courses" 
              className="inline-block mt-4 bg-[#F2A93B] hover:bg-[#e0993a] text-[#0B2545] font-bold px-6 py-2.5 rounded-xl transition"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}