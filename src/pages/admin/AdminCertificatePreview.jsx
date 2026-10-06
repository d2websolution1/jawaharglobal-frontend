import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi, resolveMediaUrl } from "../../lib/adminApi";
import AdminLayout from "../../components/admin/AdminLayout";
import CertificateCard from "../../components/certificate/CertificateCard";

export default function AdminCertificatePreview() {
  const { certificateId } = useParams();
  const navigate = useNavigate();

  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoError, setPhotoError] = useState(false);
  const [certificateName, setCertificateName] = useState("Diploma");
  const [selectedType, setSelectedType] = useState(null); // 'certificate' | 'diploma'

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
    const fetchCertificate = async () => {
      try {
        const res = await adminApi.get(`/api/admin/certificates/${certificateId}`);
        setCertificate(res.data);
      } catch (e) {
        console.error('Error fetching certificate:', e);
        setError(e?.response?.data?.message || "Failed to load certificate");
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [certificateId]);

  if (loading) {
    return (
      <AdminLayout title={`${certificateName} Preview`} subtitle={`Loading ${certificateName.toLowerCase()}...`}>
        <div className="p-6 text-gray-500">Loading...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title={`${certificateName} Preview`} subtitle="Error">
        <div className="p-6 text-red-700">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-[#7B1C1C] text-white px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </AdminLayout>
    );
  }

  if (!certificate) {
    return (
      <AdminLayout title={`${certificateName} Preview`} subtitle="Not found">
        <div className="p-6 text-gray-500">Certificate data unavailable.</div>
      </AdminLayout>
    );
  }

  let meta = certificate.meta || {};
  if (typeof meta === 'string') {
    try {
      meta = JSON.parse(meta);
    } catch (e) {
      console.error('Failed to parse certificate.meta:', e);
      meta = {};
    }
  }

  let resolvedPhotoUrl = null;
  if (meta.photoUrl) {
    if (meta.photoUrl.startsWith('http://') || meta.photoUrl.startsWith('https://')) {
      resolvedPhotoUrl = meta.photoUrl;
    } else if (meta.photoUrl.startsWith('/uploads/')) {
      resolvedPhotoUrl = resolveMediaUrl(meta.photoUrl);
    } else if (!meta.photoUrl.includes('/')) {
      resolvedPhotoUrl = resolveMediaUrl(`/uploads/certificates/${meta.photoUrl}`);
    } else {
      resolvedPhotoUrl = resolveMediaUrl(meta.photoUrl);
    }
  }

  const docType = selectedType || (
    meta.certificateType === "diploma" || certificateName.toLowerCase() === "diploma"
      ? "diploma"
      : "certificate"
  );
  const isDiploma = docType === "diploma";
  const activeDiplomaNumber = certificate.diplomaNumber || meta.diplomaNumber;
  const activeCertificateNumber = certificate.certificateNumber;
  const currentNumber = isDiploma ? (activeDiplomaNumber || activeCertificateNumber) : activeCertificateNumber;
  const currentDisplayName = isDiploma ? "Diploma" : "Certificate";

  const displayCertificate = {
    ...certificate,
    id: certificate.id,
    certificateNumber: activeCertificateNumber,
    diplomaNumber: activeDiplomaNumber,
    certificateType: docType,
    fullName: certificate.fullName,
    courseSlug: certificate.courseSlug,
    issuedAt: certificate.issuedAt,
    meta: {
      ...meta,
      certificateType: docType,
      diplomaNumber: activeDiplomaNumber,
      courseTitle: meta.courseTitle || certificate.courseSlug,
      signatoryName: meta.signatoryName || "Director, Jawahar Global Foundation",
      guardianRelation: meta.guardianRelation || "S/O",
      guardianName: meta.guardianName || "",
      dob: meta.dob || "",
      duration: meta.duration || "",
      grade: meta.grade || "",
      enrollmentNo: meta.enrollmentNo || certificate.certificateNumber,
      branchCode: meta.branchCode || "",
      place: meta.place || "",
      photoUrl: resolvedPhotoUrl,
      photoError: photoError,
    },
  };

  return (
    <AdminLayout 
      title={`${currentDisplayName} Preview`} 
      subtitle={`Print or download this ${currentDisplayName.toLowerCase()}`}
    >
      <div className="flex items-center justify-between mb-6 print:hidden flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">{currentDisplayName} Preview</h2>
          <p className="text-sm text-gray-500">Print or save the {currentDisplayName.toLowerCase()} as PDF for the student.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedType("certificate")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isDiploma
                  ? "bg-[#0B2545] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Certificate View
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("diploma")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isDiploma
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Skill Diploma View
            </button>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-[#7B1C1C] hover:bg-[#5f1515] text-white font-bold px-4 py-2 rounded-lg text-sm"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      <CertificateCard
        certificate={displayCertificate}
        qrValue={`${typeof window !== 'undefined' ? window.location.origin : ''}/certificates/${currentNumber || certificate.id}`}
        printId="certificate-print"
      />

      <p className="mt-5 text-xs text-gray-400 text-center print:hidden">
        {currentDisplayName} No.: {currentNumber} · Issued by Jawahar Global Foundation
      </p>

      <style>{`
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          #certificate-print,
          #certificate-print * {
            visibility: visible;
          }
          #certificate-print {
            position: absolute;
            top: 0;
            left: 0;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>
    </AdminLayout>
  );
}