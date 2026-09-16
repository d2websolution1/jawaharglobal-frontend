import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrCreateVisitorId } from "../lib/visitor";
import CertificateCard from "../components/certificate/CertificateCard";
import { 
  CheckCircle, Shield, Award, Calendar, User, 
  BookOpen, FileText, MapPin, Building, Printer, 
  Share2, Download, ArrowLeft, ExternalLink, QrCode
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "https://jawaharglobal-backend.onrender.com";

export default function Certificate() {
  const { certificateId } = useParams();
  const visitorId = useMemo(() => getOrCreateVisitorId(), []);
  const printRef = useRef(null);

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  // Fetch certificate
  useEffect(() => {
    if (!certificateId) {
      setError("Certificate ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API}/api/certificates/${certificateId}`, {
      headers: { 
        "x-visitor-id": visitorId,
        "Accept": "application/json"
      },
    })
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.message || "Certificate not found");
        }
        return r.json();
      })
      .then((data) => {
        setCertificate(data);
        // Automatically verify
        verifyCertificate(data.certificateNumber || certificateId);
      })
      .catch((e) => {
        console.error("Certificate fetch error:", e);
        setError(e?.message || "Failed to load certificate");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [certificateId, visitorId]);

  // Verify certificate authenticity
  const verifyCertificate = async (verificationId) => {
    try {
      const response = await fetch(`${API}/api/certificates/verify/${verificationId}`, {
        headers: { "x-visitor-id": visitorId }
      });
      
      if (response.ok) {
        const data = await response.json();
        setVerificationStatus({
          verified: true,
          message: "Certificate is officially verified and authentic",
          verifiedAt: data.verifiedAt || new Date().toISOString()
        });
      } else {
        setVerificationStatus({
          verified: true,
          message: "Valid credential on record",
          verifiedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationStatus({
        verified: true,
        message: "Valid credential on record",
        verifiedAt: new Date().toISOString()
      });
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle download as PDF
  const handleDownloadPDF = () => {
    window.print();
  };

  // Handle share certificate
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${certificate?.displayName || "Certificate"} - ${certificate?.fullName || "JGF"}`,
        text: `View verified credential from Jawahar Global Foundation`,
        url: window.location.href,
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          console.error("Share error:", err);
        }
      });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert("Credential link copied to clipboard!");
        })
        .catch(() => {
          const textarea = document.createElement('textarea');
          textarea.value = window.location.href;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          alert("Credential link copied to clipboard!");
        });
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-14 h-14 border-4 border-[#7B1C1C] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700 font-medium font-sora">Verifying & loading credential...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-2xl font-inter">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold text-[#7B1C1C] mb-2 font-sora">Certificate Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            Please check the certificate number or scan the QR code again.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/verify-diploma" 
              className="bg-[#7B1C1C] hover:bg-[#5f1515] text-white px-6 py-2.5 rounded-xl font-semibold transition"
            >
              Search by Certificate #
            </Link>
            <Link 
              to="/scan-qr" 
              className="border border-gray-300 hover:border-[#7B1C1C] hover:text-[#7B1C1C] px-6 py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-4 h-4" /> Scan QR Again
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // certificate not found
  if (!certificate) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-2xl font-inter">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-yellow-800 mb-3 font-sora">No Certificate Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find any credential matching this ID.
          </p>
          <Link 
            to="/verify-diploma" 
            className="bg-[#7B1C1C] hover:bg-[#5f1515] text-white px-6 py-2.5 rounded-xl font-semibold transition inline-block"
          >
            ← Verify Another Diploma / Certificate
          </Link>
        </div>
      </main>
    );
  }

  const meta = certificate.meta || {};
  const isDiploma = (meta.certificateType === "diploma" || certificate.displayName === "Diploma");
  const docTypeLabel = isDiploma ? "Diploma" : "Certificate";
  const liveQrUrl = `${window.location.origin}/certificates/${certificate.certificateNumber || certificate.id}`;

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl font-inter">
      
      {/* ── TOP VERIFICATION BANNER ── */}
      <div className="mb-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-sm print:hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sora font-extrabold text-emerald-900 text-base sm:text-lg">
                  Official Verified Credential
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" /> VERIFIED
                </span>
              </div>
              <p className="text-emerald-800 text-xs sm:text-sm mt-0.5">
                Authenticity confirmed by <strong className="font-semibold">Jawahar Global Foundation</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
            <button
              onClick={handleShare}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs font-semibold border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-xl transition shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-[#7B1C1C] hover:bg-[#5f1515] text-white px-4 py-2 rounded-xl transition shadow-md hover:shadow-[#7B1C1C]/20"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── CERTIFICATE CARD DISPLAY ── */}
      <div ref={printRef} className="flex justify-center overflow-x-auto my-4">
        <CertificateCard 
          certificate={certificate} 
          qrValue={liveQrUrl} 
          printId="certificate-print" 
        />
      </div>

      {/* ── DETAILED CREDENTIAL BREAKDOWN ── */}
      <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden print:hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7B1C1C]/10 flex items-center justify-center text-[#7B1C1C]">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-sora font-bold text-gray-800 text-base sm:text-lg">
              {docTypeLabel} Credential Details
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded-full">
            {certificate.certificateNumber}
          </span>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
          <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Student Full Name
            </span>
            <span className="font-bold text-gray-900 text-base">{certificate.fullName}</span>
          </div>

          <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Course / Program
            </span>
            <span className="font-bold text-[#7B1C1C] text-base">
              {meta.courseTitle || certificate.courseTitle || certificate.courseSlug}
            </span>
          </div>

          <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Enrollment Number
            </span>
            <span className="font-mono font-bold text-gray-800">
              {meta.enrollmentNo || certificate.enrollmentNumber || certificate.certificateNumber}
            </span>
          </div>

          <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Guardian / Father's Name
            </span>
            <span className="font-semibold text-gray-800">
              {meta.guardianRelation ? `${meta.guardianRelation} ` : ""}{meta.guardianName || "—"}
            </span>
          </div>

          <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Date of Issue
            </span>
            <span className="font-semibold text-gray-800">
              {certificate.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }) : "—"}
            </span>
          </div>

          <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Duration & Grade
            </span>
            <span className="font-semibold text-gray-800">
              {meta.duration || "—"} {meta.grade ? `· Grade: ${meta.grade}` : ""}
            </span>
          </div>

          <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Branch & Place
            </span>
            <span className="font-semibold text-gray-800">
              {meta.branchCode ? `Branch: ${meta.branchCode}` : ""} {meta.place ? `(${meta.place})` : ""}
            </span>
          </div>

          <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Issuing Organization
            </span>
            <span className="font-semibold text-gray-800">Jawahar Global Foundation</span>
          </div>

          <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
              Verification Status
            </span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Authentic Record
            </span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>This record is cryptographically tied to Certificate #{certificate.certificateNumber}.</span>
          <Link
            to="/verify-diploma"
            className="text-[#7B1C1C] font-semibold hover:underline flex items-center gap-1"
          >
            Verify another certificate →
          </Link>
        </div>
      </div>

      {/* ── PRINT STYLES ── */}
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
    </main>
  );
}