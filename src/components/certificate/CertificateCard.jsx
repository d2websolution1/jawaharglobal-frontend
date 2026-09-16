import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import isoLogo from "../../assets/logos/iso.jpg";
import certifiedLogo from "../../assets/logos/certified.jpg";
import guaranteeLogo from "../../assets/logos/gurantee.jpg";
import jgfLogo from "../../assets/logos/jgf-badge-logo.png";
import msme from "../../assets/logos/msme.jpg";
import skillLogo from "../../assets/logos/startupindia.png";
import directorSignature from "../../assets/signatures/director-signature.png";
import studyCenterSignature from "../../assets/signatures/studycenter-signature.png";
import { adminApi } from "../../lib/adminApi";

const API = import.meta.env.VITE_API_URL || "https://jhawarglobal-backend.onrender.com";

// ── QR Code Component ──
function QRCodeComponent({ value, size = 76 }) {
  return (
    <div
      style={{
        width: size + 10,
        height: size + 10,
        border: "1.5px solid #0B2545",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        padding: 4,
        flexShrink: 0,
      }}
    >
      <QRCodeSVG
        value={value}
        size={size}
        bgColor="#ffffff"
        fgColor="#0B2545"
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

// ─────────────────────────────────────────────────────────────
// ── CERTIFICATE SPECIFIC SVG COMPONENTS ──
// ─────────────────────────────────────────────────────────────

// ── Certificate 3D Royal Navy Ribbon Banner with Gold Trim ──
function CertificateRibbon({ title = "Certificate of Completion" }) {
  return (
    <div style={{ width: "100%", maxWidth: 500, margin: "2px auto 6px", display: "flex", justifyContent: "center" }}>
      <svg viewBox="0 0 540 56" width="100%" height="46" style={{ overflow: "visible", display: "block" }}>
        <defs>
          {/* Main Navy Gradient */}
          <linearGradient id="certNavyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E3E6F" />
            <stop offset="45%" stopColor="#0E2850" />
            <stop offset="100%" stopColor="#071731" />
          </linearGradient>
          {/* Gold Trim Gradient */}
          <linearGradient id="certGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="25%" stopColor="#FDF0A6" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="75%" stopColor="#FFF2B2" />
            <stop offset="100%" stopColor="#AA820A" />
          </linearGradient>
          {/* Dark fold shadow */}
          <linearGradient id="foldShadow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#040D1B" />
            <stop offset="100%" stopColor="#0B1F3D" />
          </linearGradient>
          <filter id="ribbonDropShadow" x="-10%" y="-20%" width="120%" height="150%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#040d1a" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Left Swallowtail Ribbon Tail */}
        <polygon points="30,8 60,8 50,48 10,48 24,28" fill="url(#certNavyGrad)" stroke="url(#certGoldGrad)" strokeWidth="1.5" />
        {/* Left Ribbon Under-fold Shadow */}
        <polygon points="46,38 60,38 52,52" fill="url(#foldShadow)" />

        {/* Right Swallowtail Ribbon Tail */}
        <polygon points="510,8 480,8 490,48 530,48 516,28" fill="url(#certNavyGrad)" stroke="url(#certGoldGrad)" strokeWidth="1.5" />
        {/* Right Ribbon Under-fold Shadow */}
        <polygon points="494,38 480,38 488,52" fill="url(#foldShadow)" />

        {/* Main Ribbon Center Body */}
        <g filter="url(#ribbonDropShadow)">
          <polygon
            points="50,4 490,4 482,44 58,44"
            fill="url(#certNavyGrad)"
            stroke="url(#certGoldGrad)"
            strokeWidth="1.8"
          />
          {/* Inner gold highlight border line */}
          <line x1="56" y1="8" x2="484" y2="8" stroke="url(#certGoldGrad)" strokeWidth="0.8" opacity="0.8" />
          <line x1="62" y1="40" x2="478" y2="40" stroke="url(#certGoldGrad)" strokeWidth="0.8" opacity="0.8" />
        </g>

        {/* Text */}
        <text
          x="270"
          y="29"
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fontFamily="'Cinzel', Georgia, serif"
          fill="#FDF0A6"
          letterSpacing="1.2"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
        >
          {title}
        </text>
      </svg>
    </div>
  );
}

// ── Golden Center Ornamental Divider ──
function OrnamentalDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "2px 0 6px" }}>
      <svg viewBox="0 0 280 14" width="260" height="12" style={{ display: "block" }}>
        <line x1="10" y1="7" x2="115" y2="7" stroke="#C59B27" strokeWidth="1" />
        <circle cx="115" cy="7" r="1.5" fill="#C59B27" />
        {/* Center diamond & scroll motif */}
        <polygon points="140,2 145,7 140,12 135,7" fill="#C59B27" />
        <circle cx="127" cy="7" r="2" fill="#D4AF37" />
        <circle cx="153" cy="7" r="2" fill="#D4AF37" />
        <path d="M 124 7 Q 132 3 135 7" stroke="#C59B27" strokeWidth="0.8" fill="none" />
        <path d="M 156 7 Q 148 3 145 7" stroke="#C59B27" strokeWidth="0.8" fill="none" />
        <circle cx="165" cy="7" r="1.5" fill="#C59B27" />
        <line x1="165" y1="7" x2="270" y2="7" stroke="#C59B27" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ── Center Golden Embossed Seal / Medal ──
function GoldMedalSeal() {
  return (
    <div style={{ position: "relative", width: 140, height: 95, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
      <svg viewBox="0 0 170 125" width="145" height="100" style={{ overflow: "visible", display: "block" }}>
        <defs>
          <linearGradient id="goldMedalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE885" />
            <stop offset="35%" stopColor="#DFB135" />
            <stop offset="70%" stopColor="#FDEAA3" />
            <stop offset="100%" stopColor="#9E7611" />
          </linearGradient>
          <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DFB135" />
            <stop offset="100%" stopColor="#8A660B" />
          </linearGradient>
          <filter id="medalShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Bottom Hanging Ribbon Tails */}
        <path d="M 62 65 L 48 116 L 68 102 L 86 116 L 76 65 Z" fill="url(#goldRibbonGrad)" stroke="#7A5806" strokeWidth="0.5" />
        <path d="M 108 65 L 94 116 L 112 102 L 132 116 L 118 65 Z" fill="url(#goldRibbonGrad)" stroke="#7A5806" strokeWidth="0.5" />

        {/* Left Side Banner: LEARN TODAY */}
        <g>
          <path d="M 12 44 L 56 44 L 50 60 L 12 60 L 20 52 Z" fill="url(#goldMedalGrad)" stroke="#7A5806" strokeWidth="0.6" />
          <text x="34" y="54" fontSize="7.2" fontWeight="800" fontFamily="'Segoe UI', sans-serif" fill="#0B2545" textAnchor="middle" letterSpacing="0.4">
            LEARN TODAY
          </text>
        </g>

        {/* Right Side Banner: GROW TOMORROW */}
        <g>
          <path d="M 158 44 L 114 44 L 120 60 L 158 60 L 150 52 Z" fill="url(#goldMedalGrad)" stroke="#7A5806" strokeWidth="0.6" />
          <text x="136" y="54" fontSize="6.6" fontWeight="800" fontFamily="'Segoe UI', sans-serif" fill="#0B2545" textAnchor="middle" letterSpacing="0.2">
            GROW TOMORROW
          </text>
        </g>

        {/* Main Circular Serrated Medal */}
        <g filter="url(#medalShadow)">
          {/* Serrated Star Circle (36 teeth) */}
          <circle cx="85" cy="50" r="38" fill="url(#goldMedalGrad)" stroke="#7A5806" strokeWidth="1" />
          <circle cx="85" cy="50" r="34" fill="none" stroke="#7A5806" strokeWidth="0.8" strokeDasharray="2.5,1.5" />
          <circle cx="85" cy="50" r="31.5" fill="#C9971D" stroke="#FFF0A0" strokeWidth="1" />
          <circle cx="85" cy="50" r="29" fill="url(#goldMedalGrad)" />

          {/* Top 3 Stars */}
          <text x="85" y="32" fontSize="7" fill="#0B2545" textAnchor="middle" letterSpacing="2">
            ★ ★ ★
          </text>

          {/* Central Organization Name */}
          <text x="85" y="41" fontSize="6.5" fontWeight="900" fontFamily="'Cinzel', serif" fill="#0B2545" textAnchor="middle" letterSpacing="0.8">
            JAWAHAR
          </text>
          <text x="85" y="48.5" fontSize="6.5" fontWeight="900" fontFamily="'Cinzel', serif" fill="#0B2545" textAnchor="middle" letterSpacing="0.8">
            GLOBAL
          </text>
          <text x="85" y="56" fontSize="5.5" fontWeight="900" fontFamily="'Cinzel', serif" fill="#0B2545" textAnchor="middle" letterSpacing="0.5">
            FOUNDATION
          </text>

          {/* Bottom 3 Stars */}
          <text x="85" y="66" fontSize="7" fill="#0B2545" textAnchor="middle" letterSpacing="2">
            ★ ★ ★
          </text>
        </g>
      </svg>
    </div>
  );
}

// ── Certificate Corner Ornaments (Top-Left, Bottom-Right ribbons + Top-Right, Bottom-Left cross brackets) ──
function CertCornerDecorations() {
  return (
    <>
      {/* Top-Left Diagonal Ribbon */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 85, height: 85, pointerEvents: "none", zIndex: 5 }}>
        <svg viewBox="0 0 85 85" width="85" height="85">
          <polygon points="0,0 85,0 0,85" fill="#0B2545" />
          <polygon points="12,0 85,0 0,85 0,12" fill="#D4AF37" />
          <polygon points="20,0 85,0 0,85 0,20" fill="#0B2545" />
          <line x1="4" y1="4" x2="4" y2="28" stroke="#FDEAA3" strokeWidth="1" />
          <line x1="4" y1="4" x2="28" y2="4" stroke="#FDEAA3" strokeWidth="1" />
        </svg>
      </div>

      {/* Bottom-Right Diagonal Ribbon */}
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 85, height: 85, pointerEvents: "none", zIndex: 5 }}>
        <svg viewBox="0 0 85 85" width="85" height="85" style={{ transform: "rotate(180deg)" }}>
          <polygon points="0,0 85,0 0,85" fill="#0B2545" />
          <polygon points="12,0 85,0 0,85 0,12" fill="#D4AF37" />
          <polygon points="20,0 85,0 0,85 0,20" fill="#0B2545" />
          <line x1="4" y1="4" x2="4" y2="28" stroke="#FDEAA3" strokeWidth="1" />
          <line x1="4" y1="4" x2="28" y2="4" stroke="#FDEAA3" strokeWidth="1" />
        </svg>
      </div>

      {/* Top-Right Corner Accent */}
      <div style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, pointerEvents: "none", zIndex: 5 }}>
        <svg viewBox="0 0 30 30" width="30" height="30">
          <path d="M 5 0 L 30 0 L 30 25" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
          <path d="M 0 5 L 25 5 L 25 30" fill="none" stroke="#0B2545" strokeWidth="1" />
          {/* Small Cross Accent */}
          <path d="M 12 12 L 18 12 M 15 9 L 15 15" stroke="#C59B27" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Bottom-Left Corner Accent */}
      <div style={{ position: "absolute", bottom: 8, left: 8, width: 30, height: 30, pointerEvents: "none", zIndex: 5 }}>
        <svg viewBox="0 0 30 30" width="30" height="30" style={{ transform: "rotate(180deg)" }}>
          <path d="M 5 0 L 30 0 L 30 25" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
          <path d="M 0 5 L 25 5 L 25 30" fill="none" stroke="#0B2545" strokeWidth="1" />
          {/* Small Cross Accent */}
          <path d="M 12 12 L 18 12 M 15 9 L 15 15" stroke="#C59B27" strokeWidth="1.2" />
        </svg>
      </div>
    </>
  );
}

// ── Subtle Laurel Wreath Watermark ──
function LaurelWatermark() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "4%",
        top: "32%",
        width: 220,
        height: 280,
        opacity: 0.12,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <svg viewBox="0 0 160 220" width="100%" height="100%">
        <path
          d="M 50 200 C 20 160 15 90 60 20 C 62 18 64 22 62 25 C 25 90 32 155 58 196 Z"
          fill="#C59B27"
        />
        {/* Laurel Leaves */}
        {[30, 50, 70, 90, 110, 130, 150, 170].map((y, i) => (
          <g key={i} transform={`translate(${20 + i * 2}, ${y}) rotate(${-20 + i * 5})`}>
            <ellipse cx="0" cy="0" rx="14" ry="6" fill="#C59B27" />
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ── CERTIFICATE VIEW (Matches Reference Image Exactly) ──
// ─────────────────────────────────────────────────────────────
function CertificateView({ certificate, qrValue, printId }) {
  const meta = certificate.meta || {};
  const photoUrl = getPhotoUrl(certificate);
  const qrCodeUrl = qrValue || `${window.location.origin}/certificates/${certificate.id}`;

  const courseTitle = meta?.courseTitle || certificate?.courseTitle || certificate?.courseSlug || "Mechanic";
  const guardianRelation = meta?.guardianRelation || "S/O";
  const guardianName = meta?.guardianName || "—";
  const dob = meta?.dob ? formatDate(meta.dob) : "—";
  const duration = meta?.duration || "1 Year";
  const grade = meta?.grade || "A+";
  const enrollmentNo = meta?.enrollmentNo || certificate?.enrollmentNumber || certificate?.certificateNumber || "—";
  const branchCode = meta?.branchCode || "002";
  const place = meta?.place || "New Delhi";
  const certificateNumber = certificate?.certificateNumber || meta?.certificateNumber || "—";
  const signatoryName = meta?.signatoryName || "Director";
  const issuedDate = certificate?.issuedAt ? formatDate(certificate?.issuedAt) : "—";

  return (
    <div
      id={printId}
      style={{
        background: "#0B2545",
        border: "10px solid #0B2545",
        padding: 5,
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
            padding: 5px !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            display: block !important;
          }
          #${printId} > div {
            width: 100% !important;
            height: 100% !important;
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

      {/* Main Certificate Sheet */}
      <div
        style={{
          position: "relative",
          background: "#FFFFFF",
          border: "1.5px solid #0B2545",
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          padding: "10mm 12mm 0",
          fontFamily: "'Segoe UI', 'Inter', sans-serif",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          zIndex: 1,
        }}
      >
        {/* Corner Accents */}
        <CertCornerDecorations />

        {/* Subtle Background Watermarks */}
        <LaurelWatermark />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.035,
            transform: "rotate(-25deg)",
            fontSize: 100,
            fontWeight: 900,
            fontFamily: "'Cinzel', serif",
            color: "#0B2545",
            userSelect: "none",
          }}
        >
          JAWAHAR GLOBAL
        </div>

        {/* ── SIDE VERTICAL MOTTO TEXTS ── */}
        {/* Top-Left */}
        <div
          style={{
            position: "absolute",
            top: 66,
            left: 20,
            fontSize: 7.5,
            fontWeight: 800,
            color: "#14306b",
            letterSpacing: 1.2,
            lineHeight: 1.35,
            textTransform: "uppercase",
            zIndex: 3,
            textAlign: "left",
          }}
        >
          <div>EMPOWERING</div>
          <div>PEOPLE</div>
          <div>BUILDING</div>
          <div>BETTER LIVES</div>
        </div>

        {/* Bottom-Left */}
        <div
          style={{
            position: "absolute",
            bottom: 38,
            left: 20,
            fontSize: 7.5,
            fontWeight: 800,
            color: "#14306b",
            letterSpacing: 1.2,
            lineHeight: 1.35,
            textTransform: "uppercase",
            zIndex: 3,
            textAlign: "left",
          }}
        >
          <div>TRAIN</div>
          <div>SKILL</div>
          <div>EMPLOY</div>
          <div>TRANSFORM</div>
        </div>

        {/* Top-Right */}
        <div
          style={{
            position: "absolute",
            top: 22,
            right: 22,
            fontSize: 7.5,
            fontWeight: 800,
            color: "#14306b",
            letterSpacing: 1.2,
            lineHeight: 1.35,
            textTransform: "uppercase",
            zIndex: 3,
            textAlign: "right",
          }}
        >
          <div>SKILLS</div>
          <div>BRIGHTER</div>
          <div>TOMORROW</div>
          <div style={{ width: 50, height: 1.5, background: "#14306b", marginLeft: "auto", marginTop: 3 }} />
        </div>

        {/* Bottom-Right */}
        <div
          style={{
            position: "absolute",
            bottom: 38,
            right: 22,
            fontSize: 7.5,
            fontWeight: 800,
            color: "#14306b",
            letterSpacing: 1.2,
            lineHeight: 1.35,
            textTransform: "uppercase",
            zIndex: 3,
            textAlign: "right",
          }}
        >
          <div>A</div>
          <div>SKILLED</div>
          <div>INDIA</div>
          <div>A STRONGER</div>
          <div>TOMORROW</div>
        </div>

        {/* ── CERTIFICATE BODY CONTENT ── */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Header Section */}
          <div style={{ display: "grid", gridTemplateColumns: "85px 1fr 85px", columnGap: 10, alignItems: "center" }}>
            {/* JGF Seal Logo */}
            <div
              style={{
                width: 82,
                height: 82,
                borderRadius: "50%",
                border: "2px solid #C62828",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                margin: "0 auto",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src={jgfLogo}
                alt="JGF Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            </div>

            {/* Header Titles */}
            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#C62828",
                  letterSpacing: 1.5,
                  fontFamily: "'Cinzel', Georgia, serif",
                  textTransform: "uppercase",
                  margin: "0 0 2px",
                }}
              >
                JAWAHAR GLOBAL FOUNDATION
              </h1>
              <p style={{ fontSize: 13, color: "#0B2545", fontWeight: 800, letterSpacing: 0.8, margin: "0 0 2px" }}>
                TUGHLAKABAD EXTENSION NEW DELHI 110019
              </p>
              <p style={{ fontSize: 15.5, color: "#0B2545", fontWeight: 800, margin: "0 0 2px" }}>
                Skill Development &amp; Vocational Training Institute
              </p>
              <p style={{ fontSize: 10, color: "#0B2545", fontStyle: "italic", fontWeight: 600, margin: 0 }}>
                Reg. Office: RZ-1241, Tughlakabad Extension, New Delhi - 110019 &nbsp;|&nbsp; Email: info@jawaharglobalfoundation.org &nbsp;|&nbsp; Contact: +91 78384 89517
              </p>
            </div>

            <div style={{ width: 85 }} />
          </div>

          {/* 3D Navy Ribbon Banner */}
          <CertificateRibbon title="Certificate of Completion" />

          {/* Sub-header text */}
          <div style={{ textAlign: "center", margin: "0 0 2px" }}>
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                color: "#0B2545",
                letterSpacing: 3,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              — &nbsp;THIS IS TO CERTIFY THAT&nbsp; —
            </p>
          </div>

          {/* Main Content Area: Left/Center text + Right Photo & QR */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 115px", columnGap: 16, flex: 1, alignItems: "start" }}>
            {/* Center Information */}
            <div style={{ textAlign: "center", paddingLeft: 40 }}>
              {/* Student Name */}
              <h2
                style={{
                  fontSize: 31,
                  fontWeight: 900,
                  color: "#0B2545",
                  fontFamily: "'Cinzel', Georgia, serif",
                  letterSpacing: 0.5,
                  margin: "2px 0 0",
                }}
              >
                {certificate.fullName}
              </h2>

              {/* Ornamental Divider */}
              <OrnamentalDivider />

              {/* S/O & Date of Birth Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 26,
                  margin: "0 0 4px",
                }}
              >
                <div style={{ textAlign: "right", minWidth: 120 }}>
                  <div style={{ fontSize: 11, color: "#4A5568", fontWeight: 600 }}>{guardianRelation}</div>
                  <div style={{ fontSize: 14.5, color: "#0B2545", fontWeight: 800 }}>{guardianName}</div>
                </div>

                <div style={{ width: 1.5, height: 32, background: "#C59B27" }} />

                <div style={{ textAlign: "left", minWidth: 120 }}>
                  <div style={{ fontSize: 11, color: "#4A5568", fontWeight: 600 }}>Date of Birth</div>
                  <div style={{ fontSize: 14.5, color: "#0B2545", fontWeight: 800 }}>{dob}</div>
                </div>
              </div>

              {/* Course completion paragraph */}
              <p style={{ fontSize: 13, color: "#14306b", fontWeight: 600, margin: "2px 0 0" }}>
                has successfully completed the course in
              </p>

              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#0B2545",
                  letterSpacing: 0.5,
                  margin: "2px 0",
                }}
              >
                {courseTitle}
              </h3>

              <p style={{ fontSize: 13, color: "#14306b", fontWeight: 600, margin: "2px 0" }}>
                at Jawahar Global Foundation and has achieved the grade{" "}
                <strong style={{ fontSize: 15.5, color: "#0B2545", fontWeight: 900 }}>{grade}</strong>
              </p>

              <p style={{ fontSize: 13, color: "#14306b", fontWeight: 600, margin: "1px 0 6px" }}>
                The duration of the course was{" "}
                <strong style={{ color: "#0B2545", fontWeight: 800 }}>{duration}</strong>.
              </p>

              {/* Enrollment & Certificate Details 2-Column Grid */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 22,
                  margin: "6px auto 0",
                  textAlign: "left",
                  fontSize: 12,
                }}
              >
                <div style={{ lineHeight: 1.7 }}>
                  <div>
                    <span style={{ fontWeight: 800, color: "#0B2545" }}>Enrollment No.</span>
                    <span style={{ margin: "0 6px" }}>:</span>
                    <span style={{ fontWeight: 600, color: "#222" }}>{enrollmentNo}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 800, color: "#0B2545" }}>Date of Issue</span>
                    <span style={{ margin: "0 6px" }}>:</span>
                    <span style={{ fontWeight: 600, color: "#222" }}>{issuedDate}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 800, color: "#0B2545" }}>Place</span>
                    <span style={{ margin: "0 6px" }}>:</span>
                    <span style={{ fontWeight: 600, color: "#222" }}>{place}</span>
                  </div>
                </div>

                <div style={{ width: 1.5, height: 48, background: "#C59B27" }} />

                <div style={{ lineHeight: 1.7 }}>
                  <div>
                    <span style={{ fontWeight: 800, color: "#0B2545" }}>Certificate No.</span>
                    <span style={{ margin: "0 6px" }}>:</span>
                    <span style={{ fontWeight: 600, color: "#222" }}>{certificateNumber}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 800, color: "#0B2545" }}>Branch Code</span>
                    <span style={{ margin: "0 6px" }}>:</span>
                    <span style={{ fontWeight: 600, color: "#222" }}>{branchCode}</span>
                  </div>
                  <div style={{ visibility: "hidden" }}>Placeholder</div>
                </div>
              </div>
            </div>

            {/* Right Column: Photo + QR Code */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 12,
                paddingRight: 10,
              }}
            >
              {/* Student Photo Frame */}
              <div
                style={{
                  width: 95,
                  height: 115,
                  border: "1.5px solid #C59B27",
                  borderRadius: 4,
                  background: "#F9FAFB",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={certificate.fullName}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center", padding: 6, color: "#9CA3AF" }}>
                    <svg
                      viewBox="0 0 24 24"
                      width="42"
                      height="42"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      style={{ margin: "0 auto", opacity: 0.5 }}
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <div style={{ fontSize: 9.5, fontWeight: 700, marginTop: 4 }}>Student Photo</div>
                  </div>
                )}
              </div>

              {/* QR Code Container with "Scan to Verify" */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <QRCodeComponent value={qrCodeUrl} size={72} />
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 800,
                    color: "#0B2545",
                    marginTop: 4,
                    letterSpacing: 0.3,
                  }}
                >
                  Scan to Verify
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Left Signature + Center Gold Seal + Right Signature */}
          <div
            style={{
              marginTop: "auto",
              display: "grid",
              gridTemplateColumns: "180px 1fr 180px",
              columnGap: 12,
              alignItems: "end",
              paddingBottom: 4,
              width: "100%",
            }}
          >
            {/* Left - Study Center Signature */}
            <div style={{ textAlign: "center", paddingLeft: 10 }}>
              <img
                src={studyCenterSignature}
                alt="Study Center Signature"
                style={{
                  width: 125,
                  height: 46,
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div style={{ width: 130, height: 1.5, background: "#C59B27", margin: "2px auto 4px" }} />
              <p style={{ fontSize: 12, fontWeight: 800, color: "#0B2545", margin: 0 }}>Study Center</p>
            </div>

            {/* Center - Gold Medal Seal */}
            <div style={{ textAlign: "center" }}>
              <GoldMedalSeal />
            </div>

            {/* Right - Director Signature */}
            <div style={{ textAlign: "center", paddingRight: 10 }}>
              <img
                src={directorSignature}
                alt="Director Signature"
                style={{
                  width: 125,
                  height: 46,
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div style={{ width: 130, height: 1.5, background: "#C59B27", margin: "2px auto 4px" }} />
              <p style={{ fontSize: 12, fontWeight: 800, color: "#0B2545", margin: 0 }}>Director</p>
              <p style={{ fontSize: 10.5, fontWeight: 800, color: "#0B2545", margin: 0 }}>JGF</p>
            </div>
          </div>

          {/* Full-width Dark Navy Bottom Verification Strip */}
          <div
            style={{
              marginLeft: "-12mm",
              marginRight: "-12mm",
              width: "calc(100% + 24mm)",
              background: "#0B2545",
              color: "#FFFFFF",
              padding: "5px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
              flexShrink: 0,
              fontSize: 10.5,
              fontWeight: 600,
            }}
          >
            <span>This certificate may be verified online using Certificate No. {certificateNumber}</span>
            <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.8, color: "#D4AF37" }}>
              SKILL &nbsp;|&nbsp; OPPORTUNITY &nbsp;|&nbsp; PROGRESS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ── DIPLOMA VIEW (Original Layout - 100% Untouched) ──
// ─────────────────────────────────────────────────────────────
function CornerRibbon({ corner }) {
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
          <linearGradient id={`ribbonFace-${corner}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFEA85" />
            <stop offset="45%" stopColor="#FBC02D" />
            <stop offset="100%" stopColor="#E8A400" />
          </linearGradient>
          <linearGradient id={`ribbonFold-${corner}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D68A00" />
            <stop offset="100%" stopColor="#9A5F00" />
          </linearGradient>
          <filter id={`ribbonShadow-${corner}`} x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0a1a3a" floodOpacity="0.35" />
          </filter>
        </defs>

        <path d="M0,0 H120 V16 H16 V120 H0 Z" fill="#0B4EA2" />

        <g filter={`url(#ribbonShadow-${corner})`}>
          <g transform="translate(46,46) rotate(-45)">
            <rect x="-95" y="-21" width="190" height="42" rx="3" fill={`url(#ribbonFace-${corner})`} />
            <rect x="-95" y="-21" width="190" height="10" rx="3" fill="#FFF6C9" opacity="0.55" />
            <rect x="-95" y="13" width="190" height="8" rx="3" fill="#B87800" opacity="0.35" />
            <path d="M -70,21 L -40,21 L -70,51 Z" fill={`url(#ribbonFold-${corner})`} />
            <path d="M -70,21 L -40,21 L -70,51 Z" fill="none" stroke="#7A4A00" strokeWidth="0.75" opacity="0.6" />
          </g>
        </g>
      </svg>
    </div>
  );
}

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
        width: 130,
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, height: 120, width: 130, marginLeft: 5 }}>
      <img src={msme} alt="msme" style={{ width: 130, height: 130, objectFit: "contain" }} onError={(e) => { e.target.style.display = "none"; }} />
    </div>
  );
}

function SkillBadge() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        borderRadius: 8,
        padding: "6px 10px",
        height: 100,
        width: 130,
        background: "#fff",
      }}
    >
      <img src={skillLogo} alt="Skill Badge" style={{ width: 130, height: 100, objectFit: "contain" }} onError={(e) => { e.target.style.display = "none"; }} />
    </div>
  );
}

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

function DiplomaView({ certificate, qrValue, printId }) {
  const meta = certificate.meta || {};
  const photoUrl = getPhotoUrl(certificate);
  const qrCodeUrl = qrValue || `${window.location.origin}/certificates/${certificate.id}`;

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

        <CornerRibbon corner="top-left" />
        <CornerRibbon corner="top-right" />
        <CornerRibbon corner="bottom-left" />
        <CornerRibbon corner="bottom-right" />

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
                Reg. Office: RZ-1241, Tughlakabad Extension, New Delhi - 110019 &nbsp;|&nbsp; Email: info@jawaharglobalfoundation.org &nbsp;|&nbsp; Contact: +91 78384 89517
              </p>
            </div>

            <div style={{ width: 60 }} />
          </div>

          {/* Body */}
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 100px", columnGap: 16, marginTop: 14, flex: 1 }}>
            {/* LEFT COLUMN - Badges */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: 100, flexShrink: 0 }}>
              <RegistrationBadge />
              <SkillBadge />
              <CertifiedBadge />
            </div>

            {/* CENTER COLUMN - Diploma Text */}
            <div style={{ textAlign: "center", padding: "0 2px", marginTop: 26 }}>
              <svg viewBox="0 0 300 46" width="100%" height="50" style={{ maxWidth: 320, margin: "0 auto", display: "block" }}>
                <defs>
                  <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#F6D365" />
                    <stop offset="100%" stopColor="#E8A824" />
                  </linearGradient>
                </defs>
                <polygon points="0,8 20,23 0,38 14,23" fill="#B8860B" />
                <polygon points="300,8 280,23 300,38 286,23" fill="#B8860B" />
                <rect x="14" y="4" width="272" height="38" fill="url(#ribbonGrad)" />
                <text
                  x="150"
                  y="29"
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="900"
                  fontFamily="Georgia, 'Times New Roman', serif"
                  fill="#7B1C1C"
                  letterSpacing="2"
                >
                  Diploma
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
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              width: 100, 
              flexShrink: 0, 
              gap: 10,
              justifyContent: "flex-start",
              paddingTop: 0,
            }}>
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
                <QRCodeComponent value={qrCodeUrl} size={78} />
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

  // ✅ Diploma keeps original layout untouched; Certificate gets new design matching reference image
  const isDiploma =
    certificate?.meta?.certificateType === "diploma" ||
    certificateName.toLowerCase() === "diploma";

  if (isDiploma) {
    return <DiplomaView certificate={certificate} qrValue={qrValue} printId={printId} />;
  }

  return <CertificateView certificate={certificate} qrValue={qrValue} printId={printId} />;
}