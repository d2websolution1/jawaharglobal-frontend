import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// ✅ Import Logos
import msmeLogo from "../assets/logos/msme.jpg";
import isoLogo from "../assets/logos/iso.jpg";

const API = import.meta.env.VITE_API_URL || "https://jawaharglobal-backend.onrender.com";

// ─── FALLBACK DATA ─────────────────────────────────────────────
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

const FALLBACK_STATS = [
  { number: 4500, suffix: "+", label: "Students Trained" },
  { number: 350, suffix: "+", label: "Hiring Partners" },
  { number: 12, suffix: "", label: "Training Centres" },
  { number: 96, suffix: "%", label: "Placement Rate" },
];

// ✅ FALLBACK TESTIMONIALS
const FALLBACK_TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    place: "Noida",
    course: "Salon Skills",
    message: "The hands-on training at Jawahar Global Foundation changed my life. Within 2 months of completing my Salon course, I got placed at Lakmé.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  },
  {
    id: 2,
    name: "Vikram Singh",
    place: "Ghaziabad",
    course: "Mechanic Basics",
    message: "I was skeptical about vocational training at first, but the Mechanic course at JGF is world-class. Now I'm working at Maruti Suzuki.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
  {
    id: 3,
    name: "Sneha Patel",
    place: "Bangalore",
    course: "Parlour Skills",
    message: "The Parlour Skills course was incredibly detailed. The trainers were supportive and the placement team found me a great opportunity at VLCC.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  },
  {
    id: 4,
    name: "Rahul Verma",
    place: "Delhi",
    course: "Electrician Fundamentals",
    message: "Electrical work requires precision and safety. The Electrician course at JGF taught me everything I needed to know.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    id: 5,
    name: "Ananya Reddy",
    place: "Hyderabad",
    course: "Salon Skills",
    message: "I always wanted to work in the beauty industry but didn't know where to start. The Salon course at JGF gave me the perfect foundation.",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80",
  },
  {
    id: 6,
    name: "Arjun Kumar",
    place: "Gurugram",
    course: "Mechanic Basics",
    message: "After 12th, I didn't have many options. The Mechanic course at JGF gave me a career.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────

function useFetch(endpoint, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    fetch(`${API}${endpoint}`)
      .then((r) => r.json())
      .then((res) => {
        let coursesData = [];
        if (res.success && res.data?.length > 0) {
          coursesData = res.data;
        } else if (Array.isArray(res) && res.length > 0) {
          coursesData = res;
        }
        
        if (coursesData.length > 0) {
          const mergedCourses = coursesData.map((course) => {
            const fallbackCourse = fallback.find(f => f.slug === course.slug);
            return {
              ...course,
              coverImageUrl: course.coverImageUrl || fallbackCourse?.coverImageUrl,
              duration: course.duration || fallbackCourse?.duration || "",
              level: course.level || fallbackCourse?.level || "",
              features: course.features || fallbackCourse?.features || [],
            };
          });
          setData(mergedCourses);
        } else {
          setData(fallback);
        }
        setLoading(false);
      })
      .catch(() => {
        setData(fallback);
        setLoading(false);
      });
  }, [endpoint]);
  
  return { data, loading };
}

function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return [value, ref];
}

function useFetchPlacements() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const token = localStorage.getItem("admin_token");
    
    fetch(`${API}/api/admin/placements`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const activePlacements = data.filter(p => p.isActive !== false);
          setPlacements(activePlacements);
        } else {
          setPlacements([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setPlacements([]);
        setLoading(false);
      });
  }, []);

  return { placements, loading };
}

function useFetchTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const token = localStorage.getItem("admin_token");
    
    fetch(`${API}/api/admin/testimonials`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const activeTestimonials = data.filter(t => t.isActive !== false);
          setTestimonials(activeTestimonials);
        } else {
          setTestimonials([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setTestimonials([]);
        setLoading(false);
      });
  }, []);

  return { testimonials, loading };
}

// ─── COURSE CARD ──────────────────────────────────────────────────
function CourseCard({ course }) {
  const navigate = useNavigate();

  const goToCourse = (slug) => {
    navigate(`/courses/${slug}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => goToCourse(course.slug)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          goToCourse(course.slug);
        }
      }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer border border-slate-100 hover:border-[#F2A93B]/40 hover:-translate-y-2"
    >
      <div className="h-48 overflow-hidden relative">
        {course.coverImageUrl ? (
          <img
            src={course.coverImageUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              const fallback = FALLBACK_COURSES.find(f => f.slug === course.slug);
              if (fallback?.coverImageUrl) {
                e.target.src = fallback.coverImageUrl;
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0B2545]/5 to-[#0B2545]/10 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {course.duration && (
          <span className="absolute top-4 left-4 bg-[#0B2545]/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/10">
            {course.duration}
          </span>
        )}
        {course.level && (
          <span className="absolute top-4 right-4 bg-[#F2A93B]/90 backdrop-blur-sm text-[#0B2545] text-[11px] font-bold px-3 py-1.5 rounded-full">
            {course.level}
          </span>
        )}
      </div>

      <div className="p-5 md:p-6 flex flex-col flex-1">
        <h3 className="font-sora font-bold text-[#0B2545] text-lg leading-snug mb-1 line-clamp-1">
          {course.title}
        </h3>
        <ul className="space-y-2 mt-3 mb-5 flex-1">
          {(course.features || []).slice(0, 3).map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <span className="text-[#F2A93B] font-bold mt-0.5 text-lg">✓</span>
              <span className="line-clamp-1">{f}</span>
            </li>
          ))}
        </ul>
        <Link
          to={`/courses/${course.slug}`}
          onClick={(e) => {
            e.stopPropagation();
            goToCourse(course.slug);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              goToCourse(course.slug);
            }
          }}
          className="inline-flex items-center justify-center bg-[#0B2545] hover:bg-[#F2A93B] hover:text-[#0B2545] text-white text-sm font-bold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

// ─── COURSES SLIDER ──────────────────────────────────────────────────
function CoursesSlider({ courses }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const slidesToShow = 3;
  const totalSlides = courses.length;

  const getVisibleCourses = () => {
    const result = [];
    for (let i = 0; i < slidesToShow; i++) {
      const idx = (currentIndex + i) % totalSlides;
      result.push(courses[idx]);
    }
    return result;
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    if (totalSlides < 4) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }
    
    autoPlayRef.current = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, 2000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [totalSlides, isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (totalSlides < 4) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {courses.map((course) => (
          <CourseCard key={course.id || course.slug} course={course} />
        ))}
      </div>
    );
  }

  const visibleCourses = getVisibleCourses();

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
          {visibleCourses.map((course, idx) => (
            <div key={`${course.id || course.slug}-${currentIndex}-${idx}`} className="animate-fadeIn">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>

      {totalSlides >= 4 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#0B2545] hover:bg-[#0B2545] hover:text-white transition-all duration-300 border border-slate-200 z-10"
            aria-label="Previous slides"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#0B2545] hover:bg-[#0B2545] hover:text-white transition-all duration-300 border border-slate-200 z-10"
            aria-label="Next slides"
          >
            →
          </button>
        </>
      )}

      {totalSlides >= 4 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (isAnimating) return;
                setIsAnimating(true);
                setCurrentIndex(idx);
                setTimeout(() => setIsAnimating(false), 500);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx 
                  ? "w-8 bg-[#F2A93B]" 
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

// ─── PLACEMENT CARD ──────────────────────────────────────────────────
function PlacementCard({ placement }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 p-6 flex flex-col items-center text-center hover:-translate-y-1">
      <div className="relative">
        <img
          src={placement.image}
          alt={placement.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-[#F2A93B]/30 hover:border-[#F2A93B] transition-all duration-300"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80";
          }}
        />
        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <div className="font-sora font-bold text-[#0B2545] text-base mt-3">{placement.name}</div>
      <div className="text-[#F2A93B] text-xs font-semibold mt-1">{placement.role}</div>
      <div className="text-slate-400 text-xs mt-2 bg-gray-50 px-3 py-1 rounded-full">{placement.company}</div>
    </div>
  );
}

// ─── STUDENTS PLACED AUTO-SLIDER ──────────────────────────────────
function PlacedStudents({ placements }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = placements.length;
  const slidesToShow = 4;

  const getVisiblePlacements = () => {
    const result = [];
    for (let i = 0; i < slidesToShow; i++) {
      const idx = (currentIndex + i) % totalSlides;
      result.push(placements[idx]);
    }
    return result;
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    if (totalSlides <= slidesToShow) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    autoPlayRef.current = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, 3000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [currentIndex, totalSlides, isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (totalSlides === 0) {
    return null;
  }

  if (totalSlides <= slidesToShow) {
    return (
      <>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <span className="text-[#F2A93B] text-xs font-bold uppercase tracking-widest bg-[#F2A93B]/10 px-4 py-1.5 rounded-full inline-block mb-4">
              Success Stories
            </span>
            <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-[#0B2545]">
              Our Students <span className="text-[#F2A93B]">Placed</span> Recently
            </h2>
            <p className="text-slate-500 mt-2">Real results from real training — 1000+ students placed</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {placements.map((p) => (
            <PlacementCard key={p.id} placement={p} />
          ))}
        </div>
      </>
    );
  }

  const visiblePlacements = getVisiblePlacements();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between flex-wrap gap-4 mb-12">
        <div>
          <span className="text-[#F2A93B] text-xs font-bold uppercase tracking-widest bg-[#F2A93B]/10 px-4 py-1.5 rounded-full inline-block mb-4">
            Success Stories
          </span>
          <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-[#0B2545]">
            Our Students <span className="text-[#F2A93B]">Placed</span> Recently
          </h2>
          <p className="text-slate-500 mt-2">Real results from real training — 1000+ students placed</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-[#0B2545] hover:bg-[#0B2545] hover:text-white transition-all duration-300 hover:shadow-lg"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-[#0B2545] hover:bg-[#0B2545] hover:text-white transition-all duration-300 hover:shadow-lg"
          >
            →
          </button>
        </div>
      </div>

      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {visiblePlacements.map((p, idx) => (
              <div key={`${p.id}-${currentIndex}-${idx}`} className="animate-fadeIn">
                <PlacementCard placement={p} />
              </div>
            ))}
          </div>
        </div>

        {totalSlides > slidesToShow && (
          <>
            <button
              onClick={prevSlide}
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#0B2545] hover:bg-[#0B2545] hover:text-white transition-all duration-300 border border-slate-200 z-10"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#0B2545] hover:bg-[#0B2545] hover:text-white transition-all duration-300 border border-slate-200 z-10"
              aria-label="Next"
            >
              →
            </button>
          </>
        )}

        {totalSlides > slidesToShow && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (isAnimating) return;
                  setIsAnimating(true);
                  setCurrentIndex(idx);
                  setTimeout(() => setIsAnimating(false), 500);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
                    ? "w-8 bg-[#F2A93B]" 
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}</style>
      </div>
    </>
  );
}

// ─── SECTIONS ───────────────────────────────────────────────────────────────

// ✅ 1. HERO - Badges Inside Image, 3 Logos Below
// ✅ 1. HERO - Logos at Top-Left, Badges Inside Image
function Hero({ courseCount }) {
  return (
    <section className="relative min-h-screen flex items-center bg-[#0B2545] overflow-hidden font-inter">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(242,169,59,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(242,169,59,0.08),_transparent_50%)]" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#F2A93B]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#F2A93B]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-20 md:pt-12 md:pb-28 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div className="text-center lg:text-left">
            {/* ✅ LOGOS - MSME & ISO (Skill India removed, size increased) */}
            <div className="flex items-center gap-5 justify-center lg:justify-start mb-4">
              <img
                src={msmeLogo}
                alt="MSME"
                className="h-24 md:h-32 w-auto object-contain bg-white rounded-xl p-2 shadow-md"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <img
                src={isoLogo}
                alt="ISO Certified"
                className="h-24 md:h-32 w-auto object-contain bg-white rounded-xl p-2 shadow-md"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            <div className="inline-flex items-center gap-2 bg-[#F2A93B]/10 border border-[#F2A93B]/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#F2A93B] rounded-full animate-pulse" />
              <span className="text-[#F2A93B] text-xs font-bold uppercase tracking-wider">
                Skill Training & Certification
              </span>
            </div>

            <h1 className="font-sora font-extrabold text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]">
              Learn a skill.
              <br />
              <span className="text-[#F2A93B]">Earn a career.</span>
            </h1>

            <p className="text-slate-300 mt-6 text-base lg:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
              Hands-on vocational training in web development, digital marketing, and
              technical trades — with mentor-led projects and placement support at every step.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/courses"
                className="group inline-flex items-center justify-center bg-[#F2A93B] hover:bg-[#e0993a] text-[#0B2545] px-8 py-3.5 rounded-lg font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-[#F2A93B]/30"
              >
                Explore Courses
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to="/verify-diploma"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-lg font-bold text-sm transition-all duration-300 border border-white/20 backdrop-blur-sm"
              >
                Verify Diploma / Certificate
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-white font-sora font-extrabold text-3xl">{courseCount}+</div>
                <div className="text-slate-400 text-xs mt-1">Active Courses</div>
              </div>
              <div className="text-center">
                <div className="text-white font-sora font-extrabold text-3xl">96%</div>
                <div className="text-slate-400 text-xs mt-1">Placement Rate</div>
              </div>
              <div className="text-center">
                <div className="text-white font-sora font-extrabold text-3xl">12</div>
                <div className="text-slate-400 text-xs mt-1">Centres</div>
              </div>
            </div>
          </div>

          {/* Right - Image with Badges Inside */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                alt="Students in a hands-on training session"
                className="w-full h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/50 via-transparent to-transparent" />

              {/* ✅ "100% Practical Training" Badge - Inside Image Top Right */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl px-4 py-3">
                <div className="text-center">
                  <div className="text-[#F2A93B] font-sora font-extrabold text-xl">100%</div>
                  <div className="text-slate-500 text-[10px] font-semibold">Practical Training</div>
                </div>
              </div>

              {/* ✅ "Diploma on completion" Badge - Inside Image Bottom Left */}
              <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-xl px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F2A93B]/20 flex items-center justify-center text-[#F2A93B] font-bold text-lg">✓</div>
                  <div>
                    <div className="text-[#0B2545] font-sora font-bold text-sm">Diploma</div>
                    <div className="text-slate-500 text-xs">on completion</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// ─── ABOUT SECTION ────────────────────────────────────────────────
function AboutSection() {
  return (
    <section className="py-16 md:py-20 bg-white font-inter">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative order-2 md:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80"
                alt="About Jawahar Global Foundation"
                className="w-full h-64 md:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/20 via-transparent to-transparent" />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <span className="text-[#F2A93B] text-xs font-bold uppercase tracking-widest bg-[#F2A93B]/10 px-4 py-1.5 rounded-full inline-block mb-4">
              About Us
            </span>
            
            <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-[#0B2545] leading-tight mb-4">
              Empowering Lives Through <br />
              <span className="text-[#F2A93B]">Skill Development</span>
            </h2>
            
            <p className="text-slate-600 text-base leading-relaxed mb-4">
              Jawahar Global Foundation is a premier skill development and vocational training 
              institute dedicated to transforming lives through quality education and practical training.
            </p>
            
            <p className="text-slate-600 text-base leading-relaxed mb-6">
              We offer industry-aligned courses in <strong>Mechanic Basics, Electrician Fundamentals, 
              Parlour Skills, Salon Skills</strong>, and more. Our mission is to bridge the skill gap 
              and create employment opportunities for youth across India.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F2A93B]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#F2A93B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-sora font-bold text-[#0B2545] text-sm">Hands-on Training</div>
                  <div className="text-slate-500 text-xs">Practical & industry-focused</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F2A93B]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#F2A93B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <div className="font-sora font-bold text-[#0B2545] text-sm">Certified Courses</div>
                  <div className="text-slate-500 text-xs">Government recognized</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F2A93B]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#F2A93B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-sora font-bold text-[#0B2545] text-sm">Placement Support</div>
                  <div className="text-slate-500 text-xs">96% placement rate</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F2A93B]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#F2A93B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <div className="font-sora font-bold text-[#0B2545] text-sm">12+ Centers</div>
                  <div className="text-slate-500 text-xs">Across India</div>
                </div>
              </div>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[#F2A93B] font-bold hover:text-[#e0993a] transition-colors mt-8 group"
            >
              Learn more about us
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── COURSES GRID WITH SLIDER ──────────────────────────────────
function CoursesSection({ courses }) {
  return (
    <section className="py-20 md:py-28 bg-gray-50 font-inter">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#F2A93B] text-xs font-bold uppercase tracking-widest bg-[#F2A93B]/10 px-4 py-1.5 rounded-full inline-block mb-4">
            Courses
          </span>
          <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-[#0B2545]">
            Choose your training track
          </h2>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            Industry-focused programs designed to build practical skills and accelerate your career
          </p>
          <div className="w-16 h-1 bg-[#F2A93B] rounded-full mx-auto mt-4" />
        </div>

        <CoursesSlider courses={courses} />

        <div className="text-center mt-12">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-[#0B2545] font-bold hover:text-[#F2A93B] transition-colors group"
          >
            View all courses
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// 4. STATS COUNTER
function StatCard({ stat }) {
  const [value, ref] = useCountUp(stat.number);
  return (
    <div ref={ref} className="text-center group">
      <div className="text-4xl md:text-5xl lg:text-6xl font-sora font-extrabold text-white group-hover:text-[#F2A93B] transition-colors duration-500">
        {value.toLocaleString("en-IN")}
        {stat.suffix}
      </div>
      <div className="text-slate-300 text-sm mt-2 group-hover:text-white transition-colors duration-500">
        {stat.label}
      </div>
    </div>
  );
}

function StatsSection() {
  return (
    <section className="py-16 md:py-20 bg-[#0B2545] font-inter relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(242,169,59,0.05),_transparent_70%)]" />
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative">
        {FALLBACK_STATS.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </div>
    </section>
  );
}

// 6. TESTIMONIALS
function TestimonialsSection({ testimonials }) {
  const [current, setCurrent] = useState(0);
  const t = testimonials[current];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-gray-50 font-inter">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="inline-block bg-[#F2A93B]/10 text-[#F2A93B] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
          Testimonials
        </span>
        <h2 className="font-sora font-extrabold text-3xl md:text-4xl text-[#0B2545] mb-4">
          What Our <span className="text-[#F2A93B]">Students</span> Say
        </h2>
        <p className="text-slate-500 text-sm mb-12 max-w-2xl mx-auto">
          Real stories from real students who transformed their careers
        </p>

        <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-slate-100">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <div className="w-12 h-12 bg-[#F2A93B] rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
          </div>

          <img
            src={t.image}
            alt={t.name}
            className="w-16 h-16 rounded-full object-cover mx-auto mb-6 border-4 border-white shadow-lg mt-4"
          />

          <div className="inline-block bg-[#F2A93B]/10 text-[#F2A93B] text-xs font-bold px-3 py-1 rounded-full mb-4">
            {t.course}
          </div>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed italic mb-6 max-w-2xl mx-auto">
            "{t.message}"
          </p>

          <p className="font-sora font-bold text-[#0B2545] text-base">{t.name}</p>
          <p className="text-slate-400 text-sm">{t.place}</p>

          <button
            onClick={prev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#0B2545] hover:bg-[#0B2545] hover:text-white transition-all duration-300 border border-slate-100"
            aria-label="Previous testimonial"
          >
            ←
          </button>
          <button
            onClick={next}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#0B2545] hover:bg-[#0B2545] hover:text-white transition-all duration-300 border border-slate-100"
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-[#F2A93B]" : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// 7. FINAL CTA
function FinalCTA() {
  return (
    <section className="py-20 md:py-28 bg-[#0B2545] font-inter relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2A93B]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F2A93B]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative">
        <h2 className="font-sora font-extrabold text-white text-3xl md:text-5xl leading-tight mb-4">
          Ready to start your <span className="text-[#F2A93B]">next skill</span>?
        </h2>
        <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mb-8">
          Pick a course, join the next batch, and walk away with a Diploma that
          actually opens doors.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/courses"
            className="inline-flex items-center justify-center bg-[#F2A93B] hover:bg-[#e0993a] text-[#0B2545] px-10 py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-[#F2A93B]/30 group"
          >
            Browse Courses
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-xl font-bold text-sm transition-all duration-300 border border-white/20 backdrop-blur-sm"
          >
            Talk to Us
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── MAIN HOME PAGE ─────────────────────────────────────────────────────────

export default function Home() {
  const { data: courses } = useFetch("/api/courses", FALLBACK_COURSES);
  const { placements } = useFetchPlacements();
  const { testimonials } = useFetchTestimonials();
  
  const displayCourses = Array.isArray(courses) && courses.length > 0 ? courses : FALLBACK_COURSES;
  const displayPlacements = placements.length > 0 ? placements : [];
  const displayTestimonials = testimonials.length > 0 ? testimonials : [];

  return (
    <main>
      <Hero courseCount={displayCourses.length} />
      <AboutSection />
      <CoursesSection courses={displayCourses} />
      <StatsSection />
      <PlacedStudents placements={displayPlacements} />
      <TestimonialsSection testimonials={displayTestimonials} />
      <FinalCTA />
    </main>
  );
}