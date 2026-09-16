import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrCreateVisitorId } from "../lib/visitor";
import { 
  Award, Users, BookOpen, Clock, CheckCircle, 
  ArrowRight, Star, Briefcase, GraduationCap,
  Sparkles, TrendingUp, MapPin, Phone, Mail,
  Shield, Heart, ExternalLink, Play, Image
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "https://jawaharglobal-backend.onrender.com";

// ✅ HOME PAGE SE EXACT IMAGES (SAME AS ABOUT PAGE)
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
    coverImageUrl: "https://images.unsplash.com/photo-1504222490345-c075b6008014?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVjaGFuaWN8ZW58MHx8MHx8fDA%3D",
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
    coverImageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80",
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
    coverImageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=80",
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
    coverImageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500&q=80",
  },
];

const GalleryStats = () => {
  const stats = [
    { number: "50+", label: "Training Programs" },
    { number: "1000+", label: "Students Graduated" },
    { number: "95%", label: "Placement Rate" },
    { number: "24/7", label: "Support Available" },
  ];

  return (
    <section className="py-12 md:py-16 bg-[#0B2545] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(242,169,59,0.05),_transparent_70%)]" />
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-2xl md:text-4xl font-sora font-extrabold text-[#F2A93B] group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-xs md:text-sm text-slate-300 mt-1 group-hover:text-white transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedGallery = () => {
  const featuredImages = [
    {
      id: 1,
      title: "Hands-on Training",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
      category: "Workshop",
    },
    {
      id: 2,
      title: "Practical Learning",
      image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&q=80",
      category: "Classroom",
    },
    {
      id: 3,
      title: "Industry Experts",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
      category: "Mentorship",
    },
    {
      id: 4,
      title: "Certification",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
      category: "Achievement",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block bg-[#F2A93B]/10 text-[#F2A93B] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Gallery
          </span>
          <h2 className="text-2xl md:text-3xl font-sora font-extrabold text-[#0B2545]">
            Our Training Gallery
          </h2>
          <div className="w-16 h-1 bg-[#F2A93B] rounded-full mx-auto mt-4" />
          <p className="text-gray-500 text-sm md:text-base mt-4 max-w-2xl mx-auto">
            Glimpses of our hands-on training sessions and workshops
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredImages.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={img.image}
                alt={img.title}
                className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-[#F2A93B] text-xs font-bold uppercase tracking-wider">
                  {img.category}
                </span>
                <h3 className="text-white font-bold text-sm md:text-base mt-1">
                  {img.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialGallery = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Salon Expert",
      message: "The hands-on training at Jawahar Global Foundation changed my life. Within 2 months of completing my Salon course, I got placed at Lakmé.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    },
    {
      id: 2,
      name: "Vikram Singh",
      role: "Mechanic Engineer",
      message: "I was skeptical about vocational training at first, but the Mechanic course at JGF is world-class. Now I'm working at Maruti Suzuki.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    {
      id: 3,
      name: "Sneha Patel",
      role: "Parlour Artist",
      message: "The Parlour Skills course was incredibly detailed. The trainers were supportive and the placement team found me a great opportunity at VLCC.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block bg-[#F2A93B]/10 text-[#F2A93B] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-2xl md:text-3xl font-sora font-extrabold text-[#0B2545]">
            Student Success Stories
          </h2>
          <div className="w-16 h-1 bg-[#F2A93B] rounded-full mx-auto mt-4" />
          <p className="text-gray-500 text-sm md:text-base mt-4 max-w-2xl mx-auto">
            Hear from our graduates who transformed their lives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-gray-50 rounded-xl p-6 md:p-8 text-center hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-4 border-[#F2A93B]/30"
              />
              <p className="text-gray-600 text-sm md:text-base italic mb-4">"{t.message}"</p>
              <h4 className="font-bold text-[#0B2545] text-sm md:text-base">{t.name}</h4>
              <p className="text-[#F2A93B] text-xs font-semibold">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-12 md:py-16 bg-[#F2A93B] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B2545]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0B2545]/5 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 text-center relative">
        <h2 className="text-2xl md:text-3xl font-sora font-extrabold text-[#0B2545] mb-3">
          Ready to Start Your Journey?
        </h2>
        <p className="text-[#0B2545]/80 text-sm md:text-base max-w-2xl mx-auto mb-6">
          Join our training programs and build a successful career with practical skills
        </p>
        <Link
          to="/courses"
          className="inline-block bg-[#0B2545] hover:bg-[#1a3a6e] text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg hover:shadow-[#0B2545]/30 group"
        >
          Explore Courses
          <ArrowRight className="w-4 h-4 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

export default function Gallery() {
  const [courses, setCourses] = useState(FALLBACK_COURSES);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    
    fetch(`${API}/api/courses`, {
      headers: { "x-visitor-id": visitorId },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mergedCourses = data.map((course) => {
            const fallback = FALLBACK_COURSES.find(f => f.slug === course.slug);
            return {
              ...course,
              coverImageUrl: course.coverImageUrl || fallback?.coverImageUrl,
              duration: course.duration || fallback?.duration || "",
              level: course.level || fallback?.level || "",
              features: course.features || fallback?.features || [],
            };
          });
          setCourses(mergedCourses);
        } else {
          setCourses(FALLBACK_COURSES);
        }
        setLoading(false);
      })
      .catch((e) => {
        setError(e?.message || "Failed to load courses");
        setCourses(FALLBACK_COURSES);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F2A93B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#0B2545] py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(242,169,59,0.15),_transparent_55%)]" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#F2A93B]/10 border border-[#F2A93B]/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-[#F2A93B] rounded-full animate-pulse" />
            <span className="text-[#F2A93B] text-xs font-bold uppercase tracking-wider">
              Gallery
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-sora font-extrabold text-white mb-4">
            Course Gallery
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Explore our vocational training programs with hands-on learning and expert mentorship
          </p>
          <div className="w-20 h-1 bg-[#F2A93B] rounded-full mx-auto mt-6" />
        </div>
      </section>

      {/* Stats Section */}
      <GalleryStats />

      {/* Featured Gallery Images */}
      <FeaturedGallery />

      {/* Courses Grid Section - SAME AS ABOUT PAGE */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-block bg-[#F2A93B]/10 text-[#F2A93B] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Programs
            </span>
            <h2 className="text-2xl md:text-3xl font-sora font-extrabold text-[#0B2545]">
              Our Training Programs
            </h2>
            <div className="w-16 h-1 bg-[#F2A93B] rounded-full mx-auto mt-4" />
            <p className="text-gray-500 text-sm md:text-base mt-4 max-w-2xl mx-auto">
              Click on any course to learn more and enroll
            </p>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center mb-6">{error}</p>
          )}

          {/* ✅ SAME AS ABOUT PAGE COURSES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {courses.map((c) => (
              <Link
                key={c.slug}
                to={`/courses/${c.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-[#F2A93B]/30 hover:-translate-y-2"
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={c.coverImageUrl}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1504222490345-c075b6008014?w=500&auto=format&fit=crop&q=60";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  {c.duration && (
                    <span className="absolute top-4 left-4 bg-[#0B2545]/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/10">
                      {c.duration}
                    </span>
                  )}
                  {c.level && (
                    <span className="absolute top-4 right-4 bg-[#F2A93B]/90 backdrop-blur-sm text-[#0B2545] text-[11px] font-bold px-3 py-1.5 rounded-full">
                      {c.level}
                    </span>
                  )}
                </div>

                <div className="p-4 md:p-5 flex flex-col flex-1">
                  <h3 className="font-sora font-bold text-[#0B2545] text-base leading-snug mb-1 line-clamp-1">
                    {c.title}
                  </h3>
                  
                  <ul className="space-y-1.5 mt-2 mb-4 flex-1">
                    {(c.features || []).slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-[#F2A93B] font-bold mt-0.5">✓</span>
                        <span className="line-clamp-1">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="inline-flex items-center justify-center bg-[#0B2545] hover:bg-[#F2A93B] hover:text-[#0B2545] text-white text-sm font-bold py-2.5 rounded-md transition-colors duration-300 text-center">
                    Enroll Now
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {courses.length === 0 && !error && (
            <p className="text-gray-600 text-center mt-8">No courses found.</p>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialGallery />

      {/* CTA Section */}
      <CTASection />

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
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