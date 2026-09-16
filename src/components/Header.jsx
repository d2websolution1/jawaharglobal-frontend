import React, { useEffect, useMemo, useState } from "react";
import logo from "../assets/foundation_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Mail, Menu, X, ChevronDown, Heart } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import { getOrCreateVisitorId } from "../lib/visitor";

const API = import.meta.env.VITE_API_URL || "https://jawaharglobal-backend.onrender.com";

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [programDropdown, setProgramDropdown] = useState(false);
  
  // ✅ Scroll State
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const visitorId = useMemo(() => getOrCreateVisitorId(), []);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState(null);

  // ✅ Scroll Handler - Hide/Show Header
  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } 
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      else if (currentScrollY < 80) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlHeader);

    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [lastScrollY]);

  // Fetch courses
  useEffect(() => {
    let isMounted = true;
    setLoadingCourses(true);
    fetch(`${API}/api/courses`, {
      headers: { "x-visitor-id": visitorId },
    })
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted) return;
        setCourses(Array.isArray(data) ? data : []);
        setCoursesError(null);
      })
      .catch((e) => {
        if (!isMounted) return;
        setCoursesError(e?.message || "Failed to load courses");
        setCourses([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoadingCourses(false);
      });

    return () => {
      isMounted = false;
    };
  }, [visitorId]);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#C62828] text-white text-sm hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            <div className="flex gap-6">
              <a
                href="tel:+917838489517"
                className="flex items-center gap-2 hover:text-yellow-400 transition"
              >
                <Phone size={16} />
                +91 78384 89517
              </a>

              <div className="flex items-center gap-2">
                <Mail size={16} />
                info@jawaharglobalfoundation.org
              </div>
            </div>

            <div className="flex gap-4 text-lg">
              <FaFacebookF className="cursor-pointer hover:text-yellow-400 transition" />
              <FaInstagram className="cursor-pointer hover:text-yellow-400 transition" />
              <FaLinkedinIn className="cursor-pointer hover:text-yellow-400 transition" />
              <FaYoutube className="cursor-pointer hover:text-yellow-400 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header 
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-red-100 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="Jawahar Global Foundation Logo"
                className="h-16 w-auto object-contain"
              />

              <div>
                <h1 className="font-bold text-xl text-[#C62828]">
                  Jawahar Global Foundation
                </h1>

                <p className="text-xs text-gray-500">
                  Together For A Better Tomorrow
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-8 font-medium">
              <Link to="/" className="hover:text-[#C62828] transition">
                Home
              </Link>

              <Link to="/about" className="hover:text-[#C62828] transition">
                About Us
              </Link>

              {/* Courses */}
              <div
                className="relative"
                onMouseEnter={() => setProgramDropdown(true)}
                onMouseLeave={() => setProgramDropdown(false)}
              >
                <button className="flex items-center gap-1 hover:text-[#C62828] transition">
                  Courses <ChevronDown size={16} />
                </button>

                {programDropdown && (
                  <div className="absolute top-full left-0 bg-white shadow-xl rounded-md w-72 py-2">
                    <Link
                      to="/courses"
                      className="block px-5 py-3 hover:bg-[#FFEBEE] hover:text-[#C62828] font-semibold"
                    >
                      All Courses
                    </Link>

                    <div className="h-px bg-red-100" />

                    {loadingCourses && (
                      <div className="px-5 py-3 text-sm text-gray-600">
                        Loading...
                      </div>
                    )}

                    {coursesError && !loadingCourses && (
                      <div className="px-5 py-3 text-sm text-red-600">
                        {coursesError}
                      </div>
                    )}

                    {!loadingCourses &&
                      !coursesError &&
                      courses.length === 0 && (
                        <div className="px-5 py-3 text-sm text-gray-600">
                          No courses found.
                        </div>
                      )}

                    {!loadingCourses &&
                      !coursesError &&
                      courses.map((c) => (
                        <Link
                          key={c.slug}
                          to={`/courses/${c.slug}`}
                          className="block px-5 py-3 hover:bg-[#FFEBEE] hover:text-[#C62828] text-sm"
                        >
                          {c.title}
                        </Link>
                      ))}
                  </div>
                )}
              </div>

              <Link to="/gallery" className="hover:text-[#C62828] transition">
                Gallery
              </Link>

              <Link to="/contact" className="hover:text-[#C62828] transition">
                Contact
              </Link>

              {/* ✅ DONATION BUTTON */}
              <Link
                to="/donate"
                className="inline-flex items-center gap-2 bg-[#C62828] hover:bg-[#8E0000] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-[#C62828]/30 transform hover:-translate-y-0.5"
              >
                <Heart className="w-4 h-4" />
                Donate Now
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="lg:hidden bg-white border-t shadow-md">
            <div className="flex flex-col p-5 gap-4">
              <Link to="/" onClick={() => setMobileMenu(false)}>Home</Link>
              <Link to="/about" onClick={() => setMobileMenu(false)}>About</Link>
              <Link to="/courses" onClick={() => setMobileMenu(false)}>Courses</Link>
              <Link to="/gallery" onClick={() => setMobileMenu(false)}>Gallery</Link>
              <Link to="/contact" onClick={() => setMobileMenu(false)}>Contact</Link>
              
              {/* ✅ Mobile Donation Button */}
              <Link
                to="/donate"
                onClick={() => setMobileMenu(false)}
                className="inline-flex items-center justify-center gap-2 bg-[#C62828] hover:bg-[#8E0000] text-white px-5 py-3 rounded-full font-bold text-sm transition-all duration-300 mt-2"
              >
                <Heart className="w-4 h-4" />
                Donate Now
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;