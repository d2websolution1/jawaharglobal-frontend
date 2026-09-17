import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import isoLogo from "../../assets/logos/iso.jpg";
import certifiedLogo from "../../assets/logos/certified.jpg";
import guaranteeLogo from "../../assets/logos/gurantee.jpg";
import jgfLogo from "../../assets/logos/jgf-badge-logo.png";
import msme from "../../assets/logos/msme.jpg";
import directorSignature from "../../assets/signatures/director-signature.png";
import studyCenterSignature from "../../assets/signatures/studycenter-signature.png";
import { adminApi } from "../../lib/adminApi";

const API = import.meta.env.VITE_API_URL || "https://jawaharglobal-backend.onrender.com";

// ── QR Code Component ──
function QRCodeComponent({ value, size = 76, color = "#14306b" }) {
  return (
    <div
      style={{
        width: size + 8,
        height: size + 8,
        border: `1.5px solid ${color}`,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        padding: 3,
        flexShrink: 0,
      }}
    >
      <QRCodeSVG
        value={value}
        size={size}
        bgColor="#ffffff"
        fgColor={color}
        level="L"
        includeMargin={false}
      />
    </div>
  );
}

// ── Helper: Format Date ──
function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

// ── Resolve Photo URL ──
function getPhotoUrl(certificate) {
  const meta = certificate?.meta || {};
  let raw = meta?.photoUrl || certificate?.photoUrl;
  if (!raw) return null;
  raw = String(raw).trim();
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("blob:") || raw.startsWith("data:")) {
    return raw;
  }
  if (raw.startsWith("/uploads/")) {
    return `${API}${raw}`;
  }
  if (raw.startsWith("uploads/")) {
    return `${API}/${raw}`;
  }
  return `${API}/uploads/certificates/${raw.split("/").pop()}`;
}

// ── Shared Badges ──
function CertifiedBadge() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        border: "1.5px solid #15803D",
        borderRadius: 6,
        padding: "4px 8px",
        background: "#fff",
        height: 60,
        width: 125,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <img src={isoLogo} alt="ISO Logo" style={{ width: 40, height: 40, objectFit: "contain" }} />
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#15803D" }}>ISO</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#15803D" }}>9001:2015</div>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#15803D" }}>CERTIFIED</div>
      </div>
    </div>
  );
}

function RegistrationBadge() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, height: 110, width: 125 }}>
      <img
        src={msme}
        alt="MSME"
        style={{ width: 125, height: 110, objectFit: "contain" }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
    </div>
  );
}

// ── Shared Dotted Underline Style ──
const dotted = {
  borderBottom: "1.5px dotted #333",
  padding: "0 4px",
  fontWeight: 700,
  color: "#111",
  display: "inline-block",
  minWidth: 60,
};

const tiledPatternUrl =
  "data:image/svg+xml," +
  encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='220' height='110'>
      <text x='0' y='40' transform='rotate(-22 30 40)' font-family='Segoe UI, sans-serif' font-size='13' font-weight='700' fill='#14306b' opacity='0.05'>JAWAHAR GLOBAL FOUNDATION</text>
      <text x='0' y='95' transform='rotate(-22 30 95)' font-family='Segoe UI, sans-serif' font-size='13' font-weight='700' fill='#14306b' opacity='0.05'>JAWAHAR GLOBAL FOUNDATION</text>
    </svg>
  `);

// ─────────────────────────────────────────────────────────────
// ── DIPLOMA CORNER RIBBON ──
// ─────────────────────────────────────────────────────────────
function DiplomaCornerRibbon({ corner }) {
  const rotations = {
    "top-left": 0,
    "top-right": 90,
    "bottom-right": 180,
    "bottom-left": 270,
  };

  const positions = {
    "top-left": { top: 0, left: 0 },
    "top-right": { top: 0, right: 0 },
    "bottom-right": { bottom: 0, right: 0 },
    "bottom-left": { bottom: 0, left: 0 },
  };

  return (
    <div
      style={{
        position: "absolute",
        width: 100,
        height: 100,
        zIndex: 10,
        pointerEvents: "none",
        ...positions[corner],
      }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        style={{ transform: `rotate(${rotations[corner]}deg)`, display: "block" }}
      >
        <defs>
          <linearGradient id={`diplomaRibbonFace-${corner}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFEA85" />
            <stop offset="45%" stopColor="#FBC02D" />
            <stop offset="100%" stopColor="#E8A400" />
          </linearGradient>
          <linearGradient id={`diplomaRibbonFold-${corner}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D68A00" />
            <stop offset="100%" stopColor="#9A5F00" />
          </linearGradient>
          <filter id={`diplomaRibbonShadow-${corner}`} x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0a1a3a" floodOpacity="0.35" />
          </filter>
        </defs>

        <path d="M0,0 H120 V16 H16 V120 H0 Z" fill="#0B4EA2" />

        <g filter={`url(#diplomaRibbonShadow-${corner})`}>
          <g transform="translate(46,46) rotate(-45)">
            <rect x="-95" y="-21" width="190" height="42" rx="3" fill={`url(#diplomaRibbonFace-${corner})`} />
            <rect x="-95" y="-21" width="190" height="10" rx="3" fill="#FFF6C9" opacity="0.55" />
            <rect x="-95" y="13" width="190" height="8" rx="3" fill="#B87800" opacity="0.35" />
            <path d="M -70,21 L -40,21 L -70,51 Z" fill={`url(#diplomaRibbonFold-${corner})`} />
            <path d="M -70,21 L -40,21 L -70,51 Z" fill="none" stroke="#7A4A00" strokeWidth="0.75" opacity="0.6" />
          </g>
        </g>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ── CERTIFICATE CORNER RIBBON & ORNAMENTS ──
// ─────────────────────────────────────────────────────────────
function CertCornerRibbon({ corner }) {
  const rotations = {
    "top-left": 0,
    "top-right": 90,
    "bottom-right": 180,
    "bottom-left": 270,
  };

  const positions = {
    "top-left": { top: 0, left: 0 },
    "top-right": { top: 0, right: 0 },
    "bottom-right": { bottom: 0, right: 0 },
    "bottom-left": { bottom: 0, left: 0 },
  };

  return (
    <div
      style={{
        position: "absolute",
        width: 105,
        height: 105,
        zIndex: 10,
        pointerEvents: "none",
        ...positions[corner],
      }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        style={{ transform: `rotate(${rotations[corner]}deg)`, display: "block" }}
      >
        <defs>
          <linearGradient id={`certRibbonFace-${corner}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE57F" />
            <stop offset="35%" stopColor="#DFB135" />
            <stop offset="70%" stopColor="#F5D77F" />
            <stop offset="100%" stopColor="#B38600" />
          </linearGradient>
          <linearGradient id={`certRibbonFold-${corner}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8A660B" />
            <stop offset="100%" stopColor="#4A3400" />
          </linearGradient>
          <filter id={`certRibbonShadow-${corner}`} x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#040d1a" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer Corner Frame in Rich Navy with Gold Accent */}
        <path d="M0,0 H120 V16 H16 V120 H0 Z" fill="#0B2545" />
        <path d="M16,16 H40 V18 H18 V40 H16 Z" fill="#D4AF37" />

        {/* Floating Diagonal Gold Ribbon */}
        <g filter={`url(#certRibbonShadow-${corner})`}>
          <g transform="translate(46,46) rotate(-45)">
            <rect x="-95" y="-20" width="190" height="40" rx="3" fill={`url(#certRibbonFace-${corner})`} stroke="#8A660B" strokeWidth="0.5" />
            <rect x="-95" y="-20" width="190" height="8" rx="2" fill="#FFFBE6" opacity="0.65" />
            <rect x="-95" y="12" width="190" height="8" rx="2" fill="#8A660B" opacity="0.3" />
            <path d="M -70,20 L -40,20 L -70,50 Z" fill={`url(#certRibbonFold-${corner})`} />
            <path d="M -70,20 L -40,20 L -70,50 Z" fill="none" stroke="#5A4000" strokeWidth="0.75" />
          </g>
        </g>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ── CERTIFICATE VIEW (Same Structure as Diploma, Refined Styling) ──
// ─────────────────────────────────────────────────────────────
function CertificateView({ certificate, qrValue, printId }) {
  const meta = certificate.meta || {};
  const photoUrl = getPhotoUrl(certificate);
  const targetId = certificate?.certificateNumber || certificate?.id;
  const baseUrl = typeof window !== "undefined" && window.location.origin ? window.location.origin : "https://jawaharglobal-frontend-4q7wj1eyf-dipak13.vercel.app";
  const qrCodeUrl = qrValue && qrValue.startsWith("http") ? qrValue : `${baseUrl}/certificates/${targetId}`;

  const courseTitle = meta?.courseTitle || certificate?.courseTitle || certificate?.courseSlug || "—";
  const guardianRelation = meta?.guardianRelation || "S/O";
  const guardianName = meta?.guardianName || "—";
  const dob = meta?.dob ? formatDate(meta.dob) : "—";
  const duration = meta?.duration || "—";
  const grade = meta?.grade || "—";
  const enrollmentNo = meta?.enrollmentNo || certificate?.enrollmentNumber || certificate?.certificateNumber || "—";
  const branchCode = meta?.branchCode || "—";
  const place = meta?.place || "—";
  const signatoryName = meta?.signatoryName || "Director, Jawahar Global Foundation";
  const issuedDate = certificate?.issuedAt ? formatDate(certificate?.issuedAt) : "—";
  const certificateNumber = certificate?.certificateNumber || meta?.certificateNumber || "—";

  return (
    <div
      id={printId}
      style={{
        background: "#0B2545",
        border: "10px solid #0B2545",
        padding: 6,
        boxSizing: "border-box",
        display: "inline-block",
        width: "297mm",
        height: "210mm",
      }}
    >
      <style>{`
        @media print {
          #${printId}, #${printId} * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #${printId} {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            border-width: 10px !important;
            padding: 6px !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            display: block !important;
          }
          #${printId} > div {
            width: 100% !important;
            height: 100% !important;
          }
          #${printId} img {
            -webkit-user-select: none;
            user-select: none;
            max-width: 100% !important;
          }
          .no-print {
            display: none !important;
          }
        }
        @page {
          size: A4 landscape;
          margin: 0;
        }
      `}</style>

      {/* Inner Certificate Sheet with Fine Gold Inset Border */}
      <div
        style={{
          position: "relative",
          background: "#FFFFFF",
          border: "2px solid #0B2545",
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          padding: "16mm 18mm 0",
          fontFamily: "'Segoe UI', sans-serif",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          zIndex: 1,
        }}
      >
        {/* Subtle Inner Gold Frame Border */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "5px",
            border: "1px solid #D4AF37",
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.85,
          }}
        />

        {/* Tiled Watermark */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("${tiledPatternUrl}")`,
            backgroundRepeat: "repeat",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* 4 Corner Ribbons */}
        <CertCornerRibbon corner="top-left" />
        <CertCornerRibbon corner="top-right" />
        <CertCornerRibbon corner="bottom-left" />
        <CertCornerRibbon corner="bottom-right" />

        {/* Certificate Content */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          
          {/* Header (Same Structure as Diploma) */}
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 60px", columnGap: 12, alignItems: "start" }}>
            {/* JGF Seal Logo */}
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                border: "2.5px solid #C62828",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={jgfLogo}
                alt="JGF Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            </div>

            {/* Title & Institute Header Info */}
            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  fontSize: 30,
                  fontWeight: 900,
                  color: "#C62828",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 4,
                  fontFamily: "'Segoe UI', sans-serif",
                }}
              >
                Jawahar Global Foundation
              </h1>
              <p style={{ fontSize: 15, color: "#0B2545", fontWeight: 700, marginBottom: 4 }}>
                RZ-1241, TUGHLAKABAD EXTENSION, NEW DELHI 110019
              </p>
              <p style={{ fontSize: 17, color: "#0B2545", fontWeight: 700, marginBottom: 4 }}>
                Skill Development &amp; Vocational Training Institute
              </p>
              <p style={{ fontSize: 11.5, color: "#0B2545", fontStyle: "italic", fontWeight: 600, lineHeight: 1.5 }}>
                Reg. Office: RZ-1241, Tughlakabad Extension, New Delhi - 110019 &nbsp;|&nbsp; Email: info@jawaharglobalfoundation.in &nbsp;|&nbsp; Contact: +91 78384 89517
              </p>
            </div>

            <div style={{ width: 60 }} />
          </div>

          {/* Body Section (3 Columns: Left Badges | Center Text | Right Photo & QR) */}
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 100px", columnGap: 16, marginTop: 14, flex: 1 }}>
            
            {/* LEFT COLUMN - Badges (MSME & ISO only - Skill India removed) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, width: 100, flexShrink: 0, paddingTop: 10 }}>
              <RegistrationBadge />
              <CertifiedBadge />
            </div>

            {/* CENTER COLUMN - Certificate Ribbon & Verification Text */}
            <div style={{ textAlign: "center", padding: "0 2px", marginTop: 22 }}>
              {/* Certificate Ribbon Banner */}
              <svg viewBox="0 0 340 48" width="100%" height="50" style={{ maxWidth: 360, margin: "0 auto", display: "block" }}>
                <defs>
                  <linearGradient id="certCenterRibbonGrad" x1="0%" y1="0%" x2="1" y2="0%">
                    <stop offset="0%" stopColor="#DFB135" />
                    <stop offset="20%" stopColor="#FFE885" />
                    <stop offset="50%" stopColor="#DFB135" />
                    <stop offset="80%" stopColor="#FFE885" />
                    <stop offset="100%" stopColor="#DFB135" />
                  </linearGradient>
                  <filter id="certRibbonDrop" x="-10%" y="-20%" width="120%" height="150%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#040d1a" floodOpacity="0.25" />
                  </filter>
                </defs>
                <g filter="url(#certRibbonDrop)">
                  <polygon points="0,8 20,24 0,40 14,24" fill="#8A660B" />
                  <polygon points="340,8 320,24 340,40 326,24" fill="#8A660B" />
                  <rect x="14" y="4" width="312" height="40" fill="url(#certCenterRibbonGrad)" stroke="#8A660B" strokeWidth="0.8" rx="2" />
                  <line x1="20" y1="8" x2="320" y2="8" stroke="#FFF" strokeWidth="0.8" opacity="0.6" />
                  <line x1="20" y1="40" x2="320" y2="40" stroke="#8A660B" strokeWidth="0.8" opacity="0.4" />
                </g>
                <text
                  x="170"
                  y="30"
                  textAnchor="middle"
                  fontSize="17.5"
                  fontWeight="900"
                  fontFamily="Georgia, 'Times New Roman', serif"
                  fill="#0B2545"
                  letterSpacing="1.5"
                >
                  Certificate of Completion
                </text>
              </svg>

              {/* Certificate Text with Dotted Blanks */}
              <div style={{ marginTop: 18, padding: "0 6px" }}>
                <p style={{ fontSize: 16, color: "#0B2545", lineHeight: 2.1, fontWeight: 700, marginBottom: 2 }}>
                  This is to certify that Mr. / Miss. / Mrs.{" "}
                  <span style={{ ...dotted, minWidth: 190, fontSize: 19, color: "#0B2545" }}>{certificate.fullName}</span>{" "}
                  {guardianRelation}
                </p>

                <p style={{ fontSize: 16, color: "#0B2545", lineHeight: 2.1, fontWeight: 700, marginBottom: 10 }}>
                  <span style={{ ...dotted, minWidth: 170, fontSize: 16, color: "#0B2545" }}>{guardianName}</span>{" "}
                  &nbsp;Date of Birth:{" "}
                  <span style={{ ...dotted, minWidth: 120, fontSize: 16, color: "#0B2545" }}>{dob}</span>
                </p>

                <p style={{ fontSize: 16, color: "#0B2545", lineHeight: 2.1, fontWeight: 700, marginBottom: 2 }}>
                  has successfully completed the course{" "}
                  <span style={{ ...dotted, minWidth: 230, fontSize: 16.5, color: "#0B2545" }}>{courseTitle}</span>
                </p>

                <p style={{ fontSize: 16, color: "#0B2545", lineHeight: 2.1, fontWeight: 700, marginBottom: 2 }}>
                  at{" "}
                  <span style={{ ...dotted, minWidth: 210, fontSize: 16, color: "#0B2545" }}>Jawahar Global Foundation</span>{" "}
                  of duration{" "}
                  <span style={{ ...dotted, minWidth: 80, fontSize: 16, color: "#0B2545" }}>{duration}</span>
                </p>

                <p style={{ fontSize: 16, color: "#0B2545", lineHeight: 2.1, fontWeight: 700, marginBottom: 4 }}>
                  and has achieved the grade{" "}
                  <span style={{ ...dotted, minWidth: 70, fontSize: 18, color: "#0B2545" }}>{grade}</span>
                </p>
              </div>

              {/* Enrollment & Certificate Details Grid */}
              <div
                style={{
                  marginTop: 22,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  columnGap: 24,
                  rowGap: 10,
                  fontSize: 14.5,
                  textAlign: "left",
                  marginLeft: 110,
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "#0B2545", fontWeight: 800 }}>Enrollment No :</strong>{" "}
                  <span style={{ color: "#111" }}>{enrollmentNo}</span>
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "#0B2545", fontWeight: 800 }}>Certificate No. :</strong>{" "}
                  <span style={{ color: "#111" }}>{certificateNumber}</span>
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "#0B2545", fontWeight: 800 }}>Date of Issue :</strong>{" "}
                  <span style={{ color: "#111" }}>{issuedDate}</span>
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "#0B2545", fontWeight: 800 }}>Branch Code :</strong>{" "}
                  <span style={{ color: "#111" }}>{branchCode}</span>
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "#0B2545", fontWeight: 800 }}>Place :</strong>{" "}
                  <span style={{ color: "#111" }}>{place}</span>
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN - Photo + QR */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 100,
                flexShrink: 0,
                gap: 10,
                justifyContent: "flex-start",
                paddingTop: 0,
              }}
            >
              {photoUrl ? (
                <div
                  style={{
                    width: 88,
                    height: 100,
                    border: "2px solid #0B2545",
                    background: "#fff",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={photoUrl}
                    alt={certificate.fullName}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: 88,
                    height: 100,
                    border: "2px dashed #0B2545",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    color: "#64748b",
                    textAlign: "center",
                    padding: 4,
                  }}
                >
                  📷 No Photo
                </div>
              )}

              <div style={{ marginTop: 80, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <QRCodeComponent value={qrCodeUrl} size={78} color="#0B2545" />
              </div>
            </div>
          </div>

          {/* Bottom Signatures Row */}
          <div
            style={{
              marginTop: "auto",
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              columnGap: 24,
              alignItems: "end",
              paddingTop: 14,
              width: "100%",
              flexShrink: 0,
            }}
          >
            {/* Left - Study Center */}
            <div style={{ textAlign: "center", minWidth: 120 }}>
              <img
                src={studyCenterSignature}
                alt="Study Center Signature"
                style={{ width: 140, height: 70, objectFit: "contain", display: "block", margin: "0 auto" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div style={{ width: 130, height: 1.5, background: "#0B2545", margin: "4px auto 6px", display: "block" }} />
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0B2545", margin: 0 }}>Study Center</p>
            </div>

            {/* Center - Logos */}
            <div style={{ display: "flex", gap: 15, alignItems: "center", marginBottom: 15 }}>
              <img src={certifiedLogo} alt="Certified" style={{ width: 75, height: 75, objectFit: "contain", display: "block" }} />
              <img src={guaranteeLogo} alt="Guarantee" style={{ width: 75, height: 75, objectFit: "contain", display: "block" }} />
            </div>

            {/* Right - Director */}
            <div style={{ textAlign: "center", minWidth: 150 }}>
              <img
                src={directorSignature}
                alt="Director Signature"
                style={{ width: 150, height: 55, objectFit: "contain", display: "block", margin: "0 auto" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div style={{ width: 150, height: 1.5, background: "#0B2545", margin: "2px auto 6px", display: "block" }} />
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0B2545", margin: 0 }}>Director</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0B2545", margin: 0 }}>{signatoryName}</p>
            </div>
          </div>

          {/* Certificate Verification Banner */}
          <div
            style={{
              marginTop: 12,
              marginLeft: "-18mm",
              marginRight: "-18mm",
              width: "calc(100% + 36mm)",
              background: "#0B2545",
              borderTop: "2px solid #D4AF37",
              textAlign: "center",
              padding: "8px 10px",
              fontSize: 13,
              color: "#FDF0A6",
              fontWeight: 700,
              position: "relative",
              zIndex: 2,
              flexShrink: 0,
              letterSpacing: 0.3,
            }}
          >
            This certificate may be verified online using Certificate No. {certificateNumber}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ── DIPLOMA VIEW (Original Layout - Skill India Logo Removed) ──
// ─────────────────────────────────────────────────────────────
function DiplomaView({ certificate, qrValue, printId }) {
  const meta = certificate.meta || {};
  const photoUrl = getPhotoUrl(certificate);
  const targetId = certificate?.certificateNumber || certificate?.id;
  const baseUrl = typeof window !== "undefined" && window.location.origin ? window.location.origin : "https://jawaharglobal-frontend-4q7wj1eyf-dipak13.vercel.app";
  const qrCodeUrl = qrValue && qrValue.startsWith("http") ? qrValue : `${baseUrl}/certificates/${targetId}`;

  const courseTitle = meta?.courseTitle || certificate?.courseTitle || certificate?.courseSlug || "—";
  const guardianRelation = meta?.guardianRelation || "S/O";
  const guardianName = meta?.guardianName || "—";
  const dob = meta?.dob ? formatDate(meta.dob) : "—";
  const duration = meta?.duration || "—";
  const grade = meta?.grade || "—";
  const enrollmentNo = meta?.enrollmentNo || certificate?.enrollmentNumber || certificate?.certificateNumber || "—";
  const branchCode = meta?.branchCode || "—";
  const place = meta?.place || "—";
  const signatoryName = meta?.signatoryName || "Jawahar Global Foundation";
  const issuedDate = certificate?.issuedAt ? formatDate(certificate?.issuedAt) : "—";

  return (
    <div
      id={printId}
      style={{
        background: "#14306b",
        border: "10px solid #14306b",
        padding: 6,
        boxSizing: "border-box",
        display: "inline-block",
        width: "297mm",
        height: "210mm",
      }}
    >
      <style>{`
        @media print {
          #${printId}, #${printId} * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #${printId} {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            border-width: 10px !important;
            padding: 6px !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            display: block !important;
          }
          #${printId} > div {
            width: 100% !important;
            height: 100% !important;
          }
          #${printId} img {
            -webkit-user-select: none;
            user-select: none;
            max-width: 100% !important;
          }
          .no-print {
            display: none !important;
          }
        }
        @page {
          size: A4 landscape;
          margin: 0;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          background: "#fff",
          border: "1.5px solid #14306b",
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          padding: "16mm 18mm 0",
          fontFamily: "'Segoe UI', sans-serif",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          zIndex: 1,
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("${tiledPatternUrl}")`,
            backgroundRepeat: "repeat",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <DiplomaCornerRibbon corner="top-left" />
        <DiplomaCornerRibbon corner="top-right" />
        <DiplomaCornerRibbon corner="bottom-left" />
        <DiplomaCornerRibbon corner="bottom-right" />

        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 60px", columnGap: 12, alignItems: "start" }}>
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                border: "2.5px solid #C62828",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <img
                src={jgfLogo}
                alt="JGF Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  fontSize: 30,
                  fontWeight: 900,
                  color: "#C62828",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Jawahar Global Foundation
              </h1>
              <p style={{ fontSize: 15, color: "#14306b", fontWeight: 700, marginBottom: 4 }}>
                RZ-1241, TUGHLAKABAD EXTENSION, NEW DELHI 110019
              </p>
              <p style={{ fontSize: 17, color: "#14306b", fontWeight: 700, marginBottom: 4 }}>
                Skill Development &amp; Vocational Training Institute
              </p>
              <p style={{ fontSize: 11.5, color: "#14306b", fontStyle: "italic", fontWeight: 600, lineHeight: 1.5 }}>
                Reg. Office: RZ-1241, Tughlakabad Extension, New Delhi - 110019 &nbsp;|&nbsp; Email: info@jawaharglobalfoundation.in &nbsp;|&nbsp; Contact: +91 78384 89517
              </p>
            </div>

            <div style={{ width: 60 }} />
          </div>

          {/* Body */}
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 100px", columnGap: 16, marginTop: 14, flex: 1 }}>
            {/* LEFT COLUMN - Badges (MSME & ISO only - Skill India removed) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, width: 100, flexShrink: 0, paddingTop: 10 }}>
              <RegistrationBadge />
              <CertifiedBadge />
            </div>

            {/* CENTER COLUMN - Diploma Text */}
            <div style={{ textAlign: "center", padding: "0 2px", marginTop: 26 }}>
              <svg viewBox="0 0 320 46" width="100%" height="50" style={{ maxWidth: 340, margin: "0 auto", display: "block" }}>
                <defs>
                  <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="1" y2="0%">
                    <stop offset="0%" stopColor="#F6D365" />
                    <stop offset="100%" stopColor="#E8A824" />
                  </linearGradient>
                </defs>
                <polygon points="0,8 20,23 0,38 14,23" fill="#B8860B" />
                <polygon points="320,8 300,23 320,38 306,23" fill="#B8860B" />
                <rect x="14" y="4" width="292" height="38" fill="url(#ribbonGrad)" />
                <text
                  x="160"
                  y="29"
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="900"
                  fontFamily="Georgia, 'Times New Roman', serif"
                  fill="#7B1C1C"
                  letterSpacing="1.5"
                >
                  Skill Diploma
                </text>
              </svg>

              <div style={{ marginTop: 20, padding: "0 6px" }}>
                <p style={{ fontSize: 16, color: "#14306b", lineHeight: 2.1, fontWeight: 700, marginBottom: 2 }}>
                  This is to certify that Mr. / Miss. / Mrs.{" "}
                  <span style={{ ...dotted, minWidth: 190, fontSize: 19 }}>{certificate.fullName}</span>{" "}
                  {guardianRelation}
                </p>

                <p style={{ fontSize: 16, color: "#14306b", lineHeight: 2.1, fontWeight: 700, marginBottom: 10 }}>
                  <span style={{ ...dotted, minWidth: 170, fontSize: 16 }}>{guardianName}</span>{" "}
                  &nbsp;Date of Birth:{" "}
                  <span style={{ ...dotted, minWidth: 120, fontSize: 16 }}>{dob}</span>
                </p>

                <p style={{ fontSize: 16, color: "#14306b", lineHeight: 2.1, fontWeight: 700, marginBottom: 2 }}>
                  has successfully completed the course{" "}
                  <span style={{ ...dotted, minWidth: 230, fontSize: 16.5 }}>{courseTitle}</span>
                </p>

                <p style={{ fontSize: 16, color: "#14306b", lineHeight: 2.1, fontWeight: 700, marginBottom: 2 }}>
                  at{" "}
                  <span style={{ ...dotted, minWidth: 210, fontSize: 16 }}>Jawahar Global Foundation</span>{" "}
                  of duration{" "}
                  <span style={{ ...dotted, minWidth: 80, fontSize: 16 }}>{duration}</span>
                </p>

                <p style={{ fontSize: 16, color: "#14306b", lineHeight: 2.1, fontWeight: 700, marginBottom: 4 }}>
                  and has achieved the grade{" "}
                  <span style={{ ...dotted, minWidth: 70, fontSize: 18 }}>{grade}</span>
                </p>
              </div>

              {/* Enrollment / details */}
              <div
                style={{
                  marginTop: 22,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  columnGap: 24,
                  rowGap: 10,
                  fontSize: 14.5,
                  textAlign: "left",
                  marginLeft: 110,
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "#14306b", fontWeight: 800 }}>Enrollment No :</strong>{" "}
                  <span style={{ color: "#111" }}>{enrollmentNo}</span>
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "#14306b", fontWeight: 800 }}>Certificate No. :</strong>{" "}
                  <span style={{ color: "#111" }}>{certificate.certificateNumber}</span>
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "#14306b", fontWeight: 800 }}>Date of Issue :</strong>{" "}
                  <span style={{ color: "#111" }}>{issuedDate}</span>
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "#14306b", fontWeight: 800 }}>Branch Code :</strong>{" "}
                  <span style={{ color: "#111" }}>{branchCode}</span>
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "#14306b", fontWeight: 800 }}>Place :</strong>{" "}
                  <span style={{ color: "#111" }}>{place}</span>
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN - Photo + QR */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 100,
                flexShrink: 0,
                gap: 10,
                justifyContent: "flex-start",
                paddingTop: 0,
              }}
            >
              {photoUrl ? (
                <div
                  style={{
                    width: 88,
                    height: 100,
                    border: "2px solid #14306b",
                    background: "#fff",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={photoUrl}
                    alt={certificate.fullName}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: 88,
                    height: 100,
                    border: "2px dashed #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    color: "#aaa",
                    textAlign: "center",
                    padding: 4,
                  }}
                >
                  📷 No Photo
                </div>
              )}

              <div style={{ marginTop: 80 }}>
                <QRCodeComponent value={qrCodeUrl} size={78} color="#14306b" />
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div
            style={{
              marginTop: "auto",
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              columnGap: 24,
              alignItems: "end",
              paddingTop: 14,
              width: "100%",
              flexShrink: 0,
            }}
          >
            {/* Left - Study Center */}
            <div style={{ textAlign: "center", minWidth: 120 }}>
              <img
                src={studyCenterSignature}
                alt="Study Center Signature"
                style={{ width: 140, height: 70, objectFit: "contain", display: "block", margin: "0 auto" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div style={{ width: 130, height: 1, background: "#555", margin: "4px auto 6px", display: "block" }} />
              <p style={{ fontSize: 13, fontWeight: 800, color: "#14306b", margin: 0 }}>Study Center</p>
            </div>

            {/* Center - Logos */}
            <div style={{ display: "flex", gap: 15, alignItems: "center", marginBottom: 15 }}>
              <img src={certifiedLogo} alt="Certified" style={{ width: 75, height: 75, objectFit: "contain", display: "block" }} />
              <img src={guaranteeLogo} alt="Guarantee" style={{ width: 75, height: 75, objectFit: "contain", display: "block" }} />
            </div>

            {/* Right - Director */}
            <div style={{ textAlign: "center", minWidth: 150 }}>
              <img
                src={directorSignature}
                alt="Director Signature"
                style={{ width: 150, height: 55, objectFit: "contain", display: "block", margin: "0 auto" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div style={{ width: 150, height: 1, background: "#555", margin: "2px auto 6px", display: "block" }} />
              <p style={{ fontSize: 13, fontWeight: 800, color: "#14306b", margin: 0 }}>Director</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#14306b", margin: 0 }}>{signatoryName}</p>
            </div>
          </div>

          {/* Verify banner */}
          <div
            style={{
              marginTop: 12,
              marginLeft: "-18mm",
              marginRight: "-18mm",
              width: "calc(100% + 36mm)",
              background: "#FDE9A0",
              borderTop: "1px solid #E8C767",
              textAlign: "center",
              padding: "8px 10px",
              fontSize: 13,
              color: "#5f4b12",
              fontWeight: 800,
              position: "relative",
              zIndex: 2,
              flexShrink: 0,
            }}
          >
            This diploma may be verified online using Diploma No. {certificate.certificateNumber}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ── MAIN EXPORT: Switches between Certificate & Diploma ──
// ─────────────────────────────────────────────────────────────
export default function CertificateCard({ certificate, qrValue, printId = "certificate-print" }) {
  const [certificateName, setCertificateName] = useState("Certificate");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (certificate?.meta?.certificateType) {
          const type = certificate.meta.certificateType;
          setCertificateName(type === "diploma" ? "Diploma" : "Certificate");
          return;
        }

        const res = await adminApi.get("/api/admin/settings");
        const data = res.data;
        setCertificateName(data.certificate_name || "Certificate");
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        if (certificate?.meta?.certificateType) {
          const type = certificate.meta.certificateType;
          setCertificateName(type === "diploma" ? "Diploma" : "Certificate");
        } else {
          setCertificateName("Certificate");
        }
      }
    };
    fetchSettings();
  }, [certificate]);

  if (!certificate) return null;

  const isDiploma =
    certificate?.meta?.certificateType === "diploma" ||
    certificateName.toLowerCase() === "diploma";

  if (isDiploma) {
    return <DiplomaView certificate={certificate} qrValue={qrValue} printId={printId} />;
  }

  return <CertificateView certificate={certificate} qrValue={qrValue} printId={printId} />;
}