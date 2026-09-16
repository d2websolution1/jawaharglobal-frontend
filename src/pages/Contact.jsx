import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle, 
  AlertCircle, Building, Globe, MessageCircle, 
  Users, Award, Star, ArrowRight, Shield,
  MessageSquare, ExternalLink
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Contact() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    message: "", 
    subject: "" 
  });
  const [status, setStatus] = useState(null);
  const isLoading = status === "loading";

  const submit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setStatus("loading");
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {}

      if (res.ok) {
        setStatus("submitted");
        setForm({ name: "", email: "", phone: "", message: "", subject: "" });
        
        // ✅ WhatsApp Message - Admin ko notify karega
        const adminWhatsApp = "917838489517"; // Admin WhatsApp Number
        const messageText = `New Contact Form Submission%0A%0A📌 Name: ${form.name}%0A📧 Email: ${form.email}%0A📱 Phone: ${form.phone || 'N/A'}%0A📝 Subject: ${form.subject || 'N/A'}%0A💬 Message: ${form.message}`;
        window.open(`https://wa.me/${adminWhatsApp}?text=${messageText}`, '_blank');
        
        return;
      }

      const message = data?.message || "Error sending message.";
      setStatus({ type: "error", message });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Error sending message." });
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: "+91 78384 89517",
      link: "tel:+917838489517",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: "info@jawaharglobalfoundation.org",
      link: "mailto:info@jawaharglobalfoundation.org",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      details: "RZ-1241, Tughlakabad Extension, New Delhi – 110019",
      link: "https://maps.google.com/?q=RZ-1241+Tughlakabad+Extension+New+Delhi+110019",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      details: "Mon – Sat: 9:00 AM – 6:00 PM",
      link: "#",
    },
  ];

  return (
    <main className="bg-white font-inter">
      {/* Hero Section */}
      <section className="relative bg-[#0B2545] py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(242,169,59,0.15),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(242,169,59,0.08),_transparent_50%)]" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-[#F2A93B]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#F2A93B]/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#F2A93B]/10 border border-[#F2A93B]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-[#F2A93B] rounded-full animate-pulse" />
            <span className="text-[#F2A93B] text-xs font-bold uppercase tracking-wider">
              Contact Us
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sora font-extrabold text-white leading-tight">
            Get in <span className="text-[#F2A93B]">Touch</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mt-4">
            Have questions, feedback, or want to partner with us? Reach out and our team will get back to you.
          </p>
          <div className="w-20 h-1 bg-[#F2A93B] rounded-full mx-auto mt-6" />
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-[#F2A93B]/30 hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-[#F2A93B]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#F2A93B]/20 transition-all duration-300">
                  <div className="text-[#F2A93B] group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                </div>
                <h3 className="font-sora font-bold text-[#0B2545] text-sm mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm group-hover:text-[#0B2545] transition-colors duration-300">
                  {item.details}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Info Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 md:mb-20">
            <span className="inline-block bg-[#F2A93B]/10 text-[#F2A93B] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Send Message
            </span>
            <h2 className="text-3xl md:text-4xl font-sora font-extrabold text-[#0B2545]">
              We'd Love to <span className="text-[#F2A93B]">Hear</span> From You
            </h2>
            <div className="w-16 h-1 bg-[#F2A93B] rounded-full mx-auto mt-4" />
            <p className="text-gray-500 text-sm md:text-base mt-4 max-w-2xl mx-auto">
              Fill in the form below and our team will get back to you within 1-2 business days.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
            {/* Form - 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 lg:p-10 border border-gray-100">
                <form onSubmit={submit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        required
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#F2A93B]/20 focus:border-[#F2A93B] outline-none transition bg-white"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#F2A93B]/20 focus:border-[#F2A93B] outline-none transition bg-white"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                        Phone Number
                      </label>
                      <input
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#F2A93B]/20 focus:border-[#F2A93B] outline-none transition bg-white"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                        Subject
                      </label>
                      <input
                        placeholder="Course Inquiry"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#F2A93B]/20 focus:border-[#F2A93B] outline-none transition bg-white"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      placeholder="Tell us how we can help you..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#F2A93B]/20 focus:border-[#F2A93B] outline-none transition bg-white h-36 resize-none"
                      disabled={isLoading}
                    />
                  </div>

                  {/* WhatsApp + Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex-1 bg-[#F2A93B] hover:bg-[#e0993a] text-[#0B2545] font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-[#F2A93B]/30 group ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#0B2545] border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          Send Message
                        </>
                      )}
                    </button>

                    {/* WhatsApp Button - Direct Chat */}
                    <a
                      href="https://wa.me/917838489517"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#25D366]/30 group"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      WhatsApp
                    </a>
                  </div>

                  {status === "submitted" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-fadeIn">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-700 font-semibold">Message sent successfully!</p>
                        <p className="text-green-600 text-sm">We'll get back to you within 1-2 business days.</p>
                      </div>
                    </div>
                  )}

                  {status && typeof status === "object" && status.type === "error" && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fadeIn">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-700 font-semibold">Error</p>
                        <p className="text-red-600 text-sm">{status.message}</p>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Sidebar - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0B2545] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2A93B]/5 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F2A93B]/5 rounded-full blur-2xl" />
                
                <h3 className="font-sora font-bold text-xl mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#F2A93B]" />
                  What happens next?
                </h3>
                <ol className="space-y-4 relative">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-[#F2A93B]/20 text-[#F2A93B] rounded-full text-sm font-bold flex-shrink-0 mt-0.5 border border-[#F2A93B]/30">
                      1
                    </span>
                    <div>
                      <p className="font-semibold text-white">We review your message</p>
                      <p className="text-slate-300 text-sm">We route it to the right team</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-[#F2A93B]/20 text-[#F2A93B] rounded-full text-sm font-bold flex-shrink-0 mt-0.5 border border-[#F2A93B]/30">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-white">We respond via email</p>
                      <p className="text-slate-300 text-sm">Within 1-2 business days</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-[#F2A93B]/20 text-[#F2A93B] rounded-full text-sm font-bold flex-shrink-0 mt-0.5 border border-[#F2A93B]/30">
                      3
                    </span>
                    <div>
                      <p className="font-semibold text-white">We resolve your request</p>
                      <p className="text-slate-300 text-sm">We may request additional details</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                <h3 className="font-sora font-bold text-[#0B2545] text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#F2A93B]" />
                  Common topics
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-600 text-sm hover:text-[#0B2545] transition-colors duration-200">
                    <div className="w-1.5 h-1.5 bg-[#F2A93B] rounded-full flex-shrink-0" />
                    Course inquiries & enrollment support
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 text-sm hover:text-[#0B2545] transition-colors duration-200">
                    <div className="w-1.5 h-1.5 bg-[#F2A93B] rounded-full flex-shrink-0" />
                    Partnerships & collaborations
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 text-sm hover:text-[#0B2545] transition-colors duration-200">
                    <div className="w-1.5 h-1.5 bg-[#F2A93B] rounded-full flex-shrink-0" />
                    Media / press requests
                  </li>
                  <li className="flex items-center gap-3 text-gray-600 text-sm hover:text-[#0B2545] transition-colors duration-200">
                    <div className="w-1.5 h-1.5 bg-[#F2A93B] rounded-full flex-shrink-0" />
                    Certificates & verification questions
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#F2A93B]/10 to-[#F2A93B]/5 rounded-2xl p-6 md:p-8 border border-[#F2A93B]/20 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#F2A93B]/10 rounded-full blur-2xl" />
                <h3 className="font-sora font-bold text-[#0B2545] text-lg mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#F2A93B] fill-[#F2A93B]" />
                  Pro Tip
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Include as many details as possible (name, topic, and any relevant links). 
                  This helps us resolve your request faster.
                </p>
              </div>

              {/* WhatsApp Contact Card */}
              <div className="bg-[#25D366]/10 rounded-2xl p-6 md:p-8 border border-[#25D366]/20 relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#25D366]/10 rounded-full blur-2xl" />
                <h3 className="font-sora font-bold text-[#0B2545] text-lg mb-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#25D366]" />
                  Chat on WhatsApp
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get instant support from our team via WhatsApp.
                </p>
                <a
                  href="https://wa.me/917838489517"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#25D366]/30 group"
                >
                  <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Chat Now
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="font-sora font-bold text-2xl text-[#0B2545]">Find Us</h3>
            <div className="w-16 h-1 bg-[#F2A93B] rounded-full mx-auto mt-2" />
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="h-64 md:h-80 bg-gradient-to-br from-[#0B2545]/5 to-[#0B2545]/10 flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#F2A93B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-10 h-10 text-[#F2A93B]" />
                  </div>
                  <p className="text-[#0B2545] font-semibold text-lg">RZ-1241, Tughlakabad Extension</p>
                  <p className="text-gray-400 text-sm">New Delhi – 110019, India</p>
                  <a 
                    href="https://maps.google.com/?q=RZ-1241+Tughlakabad+Extension+New+Delhi+110019" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-[#F2A93B] font-semibold text-sm hover:gap-3 transition-all duration-300"
                  >
                    View on Google Maps
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </main>
  );
}