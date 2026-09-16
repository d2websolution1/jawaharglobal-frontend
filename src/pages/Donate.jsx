import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart, QrCode, Copy, CheckCircle,
  Shield, Award, Users, Landmark, Smartphone
} from "lucide-react";
import donationQr from "../assets/donation-qr.jpg";

const API = import.meta.env.VITE_API_URL || "https://jhawarglobal-backend.onrender.com";

export default function Donate() {
  const [copiedField, setCopiedField] = useState("");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API}/api/admin/settings`);
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        // ✅ Fallback settings
        setSettings({
          upi_id: "jawaharglobal@upi",
          qr_code_url: donationQr,
          bank_account_name: "Sanatani Sewa Foundation",
          bank_name: "Union Bank of India",
          bank_account_type: "Savings / Current Account",
          bank_account_number: "XXXX0530",
          bank_ifsc_code: "UBIN0530000",
          bank_branch: "Tughlakabad Extension, New Delhi",
          donation_message: "This donation is eligible for 80G tax exemption.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleCopy = (value, field) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  // ✅ Use settings data with fallback
  const upiId = settings?.upi_id || "jawaharglobal@upi";
  const rawQrUrl = settings?.qr_code_url;
  const qrCodeUrl = !rawQrUrl || rawQrUrl === "/assets/qr-code.png"
    ? donationQr
    : rawQrUrl.startsWith("/uploads")
    ? `${API}${rawQrUrl}`
    : rawQrUrl;
  const donationMessage = settings?.donation_message || "This donation is eligible for 80G tax exemption.";

  const bankDetails = {
    accountName: settings?.bank_account_name || "Sanatani Sewa Foundation",
    bankName: settings?.bank_name || "AU Small Finance Bank",
    accountType: settings?.bank_account_type || "Current Account",
    accountNumber: settings?.bank_account_number || "2502248577019662",
    ifscCode: settings?.bank_ifsc_code || "AUBL0002485",
    branch: settings?.bank_branch || "Sector 63, Noida",
  };

  const stats = [
    { number: "4500+", label: "Students Supported" },
    { number: "350+", label: "Partner Organizations" },
    { number: "12", label: "Training Centers" },
    { number: "96%", label: "Success Rate" },
  ];

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F2A93B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading donation details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen font-inter">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#0B2545] to-[#1a3a6e] py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2A93B]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F2A93B]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative text-center">
          <div className="inline-flex items-center gap-2 bg-[#F2A93B]/20 border border-[#F2A93B]/30 rounded-full px-4 py-1.5 mb-6">
            <Heart className="w-4 h-4 text-[#F2A93B] fill-[#F2A93B]" />
            <span className="text-[#F2A93B] text-xs font-bold uppercase tracking-wider">Support a Cause</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sora font-extrabold text-white leading-tight">
            Make a <span className="text-[#F2A93B]">Difference</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mt-4">
            Your generous donation helps us provide quality vocational training and
            create employment opportunities for underserved communities.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-white/80 text-sm bg-white/10 px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-[#F2A93B]" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm bg-white/10 px-4 py-2 rounded-full">
              <Award className="w-4 h-4 text-[#F2A93B]" />
              <span>80G Tax Exemption</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm bg-white/10 px-4 py-2 rounded-full">
              <Users className="w-4 h-4 text-[#F2A93B]" />
              <span>Trusted by 4500+ Students</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 md:py-14 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-sora font-extrabold text-[#C62828]">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QR + Bank Details Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Scan & Donate */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 text-center">
              <h2 className="text-xl font-sora font-bold text-[#0B2545] flex items-center justify-center gap-2 mb-6">
                <QrCode className="w-6 h-6 text-[#F2A93B]" />
                Scan & Donate
              </h2>

              <div className="w-full max-w-[280px] mx-auto bg-white border-2 border-gray-200 rounded-xl p-3 shadow-sm flex items-center justify-center">
                <img
                  src={qrCodeUrl}
                  alt="UPI QR Code"
                  className="w-full h-auto max-h-[380px] object-contain rounded-lg"
                  onError={(e) => {
                    if (e.target.src !== donationQr) {
                      e.target.src = donationQr;
                    }
                  }}
                />
              </div>

              <p className="text-sm font-semibold text-gray-600 mt-4">Scan using any UPI App</p>

              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["Google Pay", "PhonePe", "Paytm", "BHIM UPI", "Any UPI Application"].map((app) => (
                  <span
                    key={app}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {app}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 bg-gray-50 rounded-xl px-4 py-3">
                <Smartphone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="font-mono text-sm font-semibold text-[#0B2545]">{upiId}</span>
                <button
                  onClick={() => handleCopy(upiId, "upi")}
                  className="ml-auto flex-shrink-0 text-[#C62828] hover:text-[#8E0000] transition"
                  aria-label="Copy UPI ID"
                >
                  {copiedField === "upi" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Bank Account Details */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-sora font-bold text-[#0B2545] flex items-center gap-2 mb-2">
                <Landmark className="w-6 h-6 text-[#F2A93B]" />
                Bank Account Details
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                You can make a direct bank transfer using the official details below:
              </p>

              <div className="space-y-4">
                {[
                  { label: "Account Name", value: bankDetails.accountName, field: "accountName" },
                  { label: "Bank Name", value: bankDetails.bankName, field: "bankName" },
                  { label: "Account Type", value: bankDetails.accountType, field: "accountType" },
                  { label: "Account Number", value: bankDetails.accountNumber, field: "accountNumber" },
                  { label: "IFSC Code", value: bankDetails.ifscCode, field: "ifscCode" },
                  { label: "Branch", value: bankDetails.branch, field: "branch" },
                ].map((row) => (
                  <div key={row.field} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-gray-500">{row.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#0B2545] text-sm">{row.value}</span>
                      <button
                        onClick={() => handleCopy(row.value, row.field)}
                        className="text-[#C62828] hover:text-[#8E0000] transition"
                        aria-label={`Copy ${row.label}`}
                      >
                        {copiedField === row.field ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-[#F2A93B]/10 border border-[#F2A93B]/20 rounded-xl p-3 text-center">
                <p className="text-xs text-[#0B2545] font-medium">
                  🔒 {donationMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-[#0B2545]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-sora font-extrabold text-white mb-4">
            Every Contribution <span className="text-[#F2A93B]">Counts</span>
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-6">
            Whether it's ₹500 or ₹5000, your donation helps transform lives and build a better tomorrow.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#F2A93B] hover:bg-[#e0993a] text-[#0B2545] font-bold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#F2A93B]/30 transform hover:-translate-y-0.5"
          >
            <Heart className="w-5 h-5" />
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}