import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getOrCreateVisitorId } from "../lib/visitor";

const API = import.meta.env.VITE_API_URL || "https://jawaharglobal-backend.onrender.com";

// ✅ FALLBACK COURSES - only used if API completely fails after retries
const FALLBACK_COURSES = [
  {
    id: 1,
    slug: "mechanic",
    title: "Mechanic Basics",
    duration: "Service & Diagnostics",
    level: "Beginner Friendly",
    features: [
      "Hands-on Workshop",
      "Real Vehicle Practice",
      "Placement Assistance",
    ],
    coverImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4b6-0o8pA67yqN01wHdB2Aaza7uQ_jhKnGj2srDNKxw&s=10",
  },
  {
    id: 2,
    slug: "electrician",
    title: "Electrician Fundamentals",
    duration: "Safety First",
    level: "Beginner Friendly",
    features: [
      "Safety Certification",
      "Live Wiring Practice",
      "Placement Assistance",
    ],
    coverImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRb-Lf33ysvK2w_tiiToW6GADSoKiayVCaSkW3Pg5AZw&s=10",
  },
  {
    id: 3,
    slug: "parlour",
    title: "Parlour Skills",
    duration: "Care & Customer Experience",
    level: "Beginner Friendly",
    features: [
      "Client Handling Practice",
      "Hygiene & Care Techniques",
      "Placement Assistance",
    ],
    coverImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLmnKwaw_1rXlLd2DVYbAh6G1FsgXhnpUjRWFVseNJAQ&s=10",
  },
  {
    id: 4,
    slug: "salon",
    title: "Salon Skills",
    duration: "Basics to Employability",
    level: "Beginner Friendly",
    features: [
      "Styling Fundamentals",
      "Real Client Practice",
      "Placement Assistance",
    ],
    coverImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgPtalOPAGP1lZ8O5GTBrt8NrjKBnjjKhuHGjvuf-opg&s=10",
  },
];

function resolveImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("/uploads")) return `${API}${url}`;
  return url;
}

export default function Courses() {
  const location = useLocation();
  // ✅ Start with NO data — don't flash fallback or stale images
  const [courses, setCourses] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataReady, setDataReady] = useState(false);

  // Get search param from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchQuery(query);
  }, [location.search]);

  // ✅ Fetch real data — only set state ONCE, when we have a final answer
  useEffect(() => {
    let isMounted = true;
    const visitorId = getOrCreateVisitorId();

    const load = async () => {
      try {
        const res = await fetch(`${API}/api/courses`, {
          headers: { "x-visitor-id": visitorId },
        });
        const data = await res.json();

        if (!isMounted) return;

        if (Array.isArray(data) && data.length > 0) {
          const mergedCourses = data.map((course, index) => {
            const fallback =
              FALLBACK_COURSES.find((f) => f.slug === course.slug) ||
              FALLBACK_COURSES[index % FALLBACK_COURSES.length];
            return {
              ...course,
              coverImageUrl: course.coverImageUrl || fallback?.coverImageUrl,
              features: course.features || fallback?.features || [],
              duration: course.duration || fallback?.duration || "",
            };
          });
          setCourses(mergedCourses);
          setFilteredCourses(mergedCourses);
        } else {
          setCourses(FALLBACK_COURSES);
          setFilteredCourses(FALLBACK_COURSES);
        }
      } catch (e) {
        console.error("API Error:", e);
        if (!isMounted) return;
        setError("Could not load live courses, showing defaults.");
        setCourses(FALLBACK_COURSES);
        setFilteredCourses(FALLBACK_COURSES);
      } finally {
        if (isMounted) setDataReady(true);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter courses when search query changes
  useEffect(() => {
    if (!courses) return;
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (course.description &&
            course.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

  return (
    <div className="bg-gray-50 py-12 md:py-20 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4 tracking-tight">
            {searchQuery ? `Results for "${searchQuery}"` : "Our Courses"}
          </h1>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            {searchQuery
              ? `${(filteredCourses || []).length} course${
                  (filteredCourses || []).length !== 1 ? "s" : ""
                } found`
              : "Industry-focused training programs designed for career success"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* ✅ Show spinner until we have a final, real answer — no flicker */}
        {!dataReady ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-[#F2A93B] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Loading courses...</p>
          </div>
        ) : (
          <>
            {/* Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {(filteredCourses || []).map((course) => (
                <Link
                  key={course.slug || course.id}
                  to={`/courses/${course.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-100 hover:border-[#F2A93B]/30 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    {course.coverImageUrl ? (
                      <img
                        src={resolveImageUrl(course.coverImageUrl)}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1504222490345-c075b6008014?w=500&auto=format&fit=crop&q=60";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0B2545]/5 to-[#0B2545]/10 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                    {/* Duration Badge */}
                    {course.duration && (
                      <span className="absolute top-3 left-3 bg-[#0B2545]/90 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                        {course.duration}
                      </span>
                    )}
                    {/* Level Badge */}
                    {course.level && (
                      <span className="absolute top-3 right-3 bg-[#F2A93B]/90 text-[#0B2545] text-[11px] font-bold px-3 py-1 rounded-full">
                        {course.level}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5 flex flex-col">
                    <h3 className="font-sora font-bold text-[#0B2545] text-base leading-snug mb-1">
                      {course.title}
                    </h3>

                    {/* Features List */}
                    <ul className="space-y-1.5 mb-4 flex-1 mt-2">
                      {(course.features || []).slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="text-[#F2A93B] font-bold mt-0.5">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* Enroll Button */}
                    <span className="inline-flex items-center justify-center bg-[#0B2545] hover:bg-[#F2A93B] hover:text-[#0B2545] text-white text-sm font-bold py-2.5 px-4 rounded-md transition-colors duration-300 text-center">
                      view Details
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {(filteredCourses || []).length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-gray-500">No courses found for "{searchQuery}"</p>
                <Link to="/courses" className="text-[#F2A93B] font-semibold hover:underline mt-2 inline-block">
                  Clear search
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}