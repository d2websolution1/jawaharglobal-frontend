import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";

const API = import.meta.env.VITE_API_URL || "https://jawaharglobal-backend.onrender.com";

export default function QRScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    const onScanSuccess = async (decodedText, decodedResult) => {
      console.log("📸 QR Scan Result:", decodedText);
      setScanResult(decodedText);
      
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
          setIsScanning(false);
        } catch (err) {
          console.error("Stop error:", err);
        }
      }
      
      // ✅ Extract certificate ID from URL
      let certificateId = decodedText;
      
      // Check if it's a URL with certificate ID
      if (decodedText.includes('/certificates/')) {
        const urlParts = decodedText.split('/certificates/');
        if (urlParts.length > 1) {
          certificateId = urlParts[1].split('?')[0].split('#')[0];
        }
      }
      
      console.log("🔍 Extracted Certificate ID:", certificateId);
      
      await verifyCertificate(certificateId);
    };

    const onScanFailure = (error) => {};

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          config,
          onScanSuccess,
          onScanFailure
        );
        setIsScanning(true);
      } catch (err) {
        console.error("Scanner start error:", err);
        setError("Unable to access camera. Please allow camera permission.");
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {});
          scannerRef.current.clear();
        } catch (err) {
          console.error("Cleanup error:", err);
        }
      }
    };
  }, []);

  const verifyCertificate = async (certificateId) => {
    setLoading(true);
    setError(null);
    
    try {
      // ✅ First try to fetch by ID
      let response = await fetch(`${API}/api/certificates/${certificateId}`, {
        headers: { "Accept": "application/json" }
      });
      
      let data = null;
      
      if (response.ok) {
        data = await response.json();
      } else {
        // ✅ If not found by ID, try by certificate number
        const verifyResponse = await fetch(`${API}/api/certificates/verify/${certificateId}`);
        const verifyData = await verifyResponse.json();
        
        if (verifyData.isValid && verifyData.certificate) {
          data = verifyData.certificate;
        }
      }
      
      console.log("🔍 Certificate Data:", data);
      
      if (data && data.id) {
        setCertificateData(data);
        setScanResult(`✅ Certificate #${data.certificateNumber} - ${data.fullName}`);
        
        setTimeout(() => {
          navigate(`/certificates/${data.id}`);
        }, 2500);
      } else {
        setError("Certificate not found. Please scan a valid QR code.");
        setTimeout(() => {
          if (scannerRef.current) {
            scannerRef.current.start(
              { facingMode: "environment" },
              { fps: 10, qrbox: { width: 250, height: 250 } },
              () => {},
              () => {}
            ).then(() => setIsScanning(true)).catch(() => {});
          }
        }, 3000);
      }
    } catch (err) {
      console.error("❌ Verification error:", err);
      setError("Failed to verify certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualVerify = async () => {
    const input = document.getElementById('manualInput');
    if (input && input.value) {
      await verifyCertificate(input.value.trim());
    }
  };

  const restartScanner = async () => {
    setError(null);
    setScanResult(null);
    setCertificateData(null);
    
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          () => {},
          () => {}
        );
        setIsScanning(true);
      } catch (err) {
        console.error("Restart error:", err);
        setError("Unable to restart scanner. Please refresh the page.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-[#0B2545] text-center mb-2">
          Scan QR Code
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Scan the QR code on your certificate to verify authenticity
        </p>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 overflow-hidden">
          <div className="relative">
            <div 
              id="qr-reader" 
              style={{ 
                width: "100%", 
                maxWidth: "400px", 
                margin: "0 auto",
                borderRadius: "12px",
                overflow: "hidden"
              }}
            ></div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-4 border-[#F2A93B] rounded-xl opacity-60"></div>
            </div>

            {isScanning && !loading && !certificateData && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Scanning...
                </span>
              </div>
            )}
          </div>

          {loading && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-4 border-[#F2A93B] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-700 font-medium">Verifying certificate...</span>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-red-700 font-semibold">Scan Failed</p>
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={restartScanner}
                  className="mt-2 text-sm text-red-600 font-semibold hover:underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {scanResult && !loading && !certificateData && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Scanned:</span> {scanResult}
              </p>
              <p className="text-xs text-yellow-600 mt-1">Verifying certificate...</p>
            </div>
          )}

          {certificateData && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-green-700 font-semibold text-lg">✅ Certificate Verified!</p>
                  <p className="text-green-700 font-medium">
                    Certificate #: <span className="font-mono">{certificateData.certificateNumber}</span>
                  </p>
                  <p className="text-green-600">
                    Student: <span className="font-semibold">{certificateData.fullName}</span>
                  </p>
                  <p className="text-green-600 text-sm">
                    Course: {certificateData.meta?.courseTitle || certificateData.courseSlug}
                  </p>
                  <p className="text-green-500 text-xs mt-2">
                    ⏳ Redirecting to certificate page...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-3">Enter Certificate ID Manually</h3>
          <div className="flex gap-3">
            <input
              type="text"
              id="manualInput"
              placeholder="e.g., JGF-189312-F75E39"
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-[#F2A93B] focus:ring-4 focus:ring-[#F2A93B]/10 outline-none transition"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleManualVerify();
                }
              }}
            />
            <button
              onClick={handleManualVerify}
              className="bg-[#F2A93B] hover:bg-[#e0993a] text-[#0B2545] font-bold px-6 py-2.5 rounded-xl transition"
            >
              Verify
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-[#F2A93B] transition font-medium"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}