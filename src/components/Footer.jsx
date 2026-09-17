import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import logo from "../assets/foundation_logo.png";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "All Courses", to: "/courses" },
  { label: "Blog", to: "/blog" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact Us", to: "/contact" },
  { label: "Donate", to: "/donate" },
];

const programs = [
  { label: "Salon Training", to: "/salon" },
  { label: "Parlour Skills", to: "/parlour" },
  { label: "Electrician Trade", to: "/electrician" },
  { label: "Mechanic Trade", to: "/machanic" },
  { label: "Verify Diploma / Certificate", to: "/verify-diploma" },
];

const socials = [
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#1a0505] text-gray-300">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-[#7B1C1C] via-[#C62828] to-[#7B1C1C]" />

      {/* CTA strip */}
      <div className="bg-[#C62828]">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h3 className="text-white text-lg md:text-xl font-extrabold">
              Ready to build a skilled career?
            </h3>
            <p className="text-white/85 text-sm mt-0.5">
              Enroll today in our vocational training programs — Salon, Parlour, Electrician &amp; Mechanic.
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 bg-white text-[#C62828] font-bold px-6 py-2.5 rounded-full shadow-md hover:bg-gray-100 transition whitespace-nowrap"
          >
            Explore Courses <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-xl p-1.5 shadow-md">
                <img
                  src={logo}
                  alt="Jawahar Global Foundation Logo"
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div>
                <h2 className="text-white font-extrabold text-lg leading-tight">
                  Jawahar Global Foundation
                </h2>
                <p className="text-xs text-gray-400">Together For A Better Tomorrow</p>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Empowering youth with industry-ready vocational skills in Salon, Parlour,
              Electrician &amp; Mechanic trades — with government-recognized, verifiable
              certification for every graduate.
            </p>

            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#C62828] hover:scale-110 transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#C62828] rounded-full" />
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowRight
                      size={13}
                      className="text-[#C62828] group-hover:translate-x-1 transition-transform"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Programs */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 relative inline-block">
              Our Programs
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#C62828] rounded-full" />
            </h3>
            <ul className="space-y-3">
              {programs.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowRight
                      size={13}
                      className="text-[#C62828] group-hover:translate-x-1 transition-transform"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#C62828] rounded-full" />
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={17} className="text-[#C62828] mt-0.5 flex-shrink-0" />
                <span>RZ-1241, Tughlakabad Extension, New Delhi – 110019</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={17} className="text-[#C62828] flex-shrink-0" />
                <a href="tel:+917838489517" className="hover:text-white transition-colors">
                  +91 78384 89517
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={17} className="text-[#C62828] flex-shrink-0" />
                <a
                  href="mailto:info@jawaharglobalfoundation.in"
                  className="hover:text-white transition-colors break-all"
                >
                  info@jawaharglobalfoundation.in
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={17} className="text-[#C62828] mt-0.5 flex-shrink-0" />
                <span>Mon – Sat: 9:00 AM – 6:00 PM</span>
              </li>
            </ul>

            <a
              href="https://wa.me/917838489517"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              <FaWhatsapp size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {year} Jawahar Global Foundation. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-700">|</span>
            <Link to="/terms-conditions" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="text-gray-700">|</span>
            <Link to="/verify-diploma" className="hover:text-white transition-colors">
              Verify Diploma / Certificate
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}