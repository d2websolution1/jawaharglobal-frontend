import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrCreateVisitorId } from "../lib/visitor";
import ModuleViewer from "../components/Courses/ModuleViewer";
import { 
  BookOpen, Clock, Award, CheckCircle, User, 
  ArrowLeft, FileText, Calendar, Sparkles, Shield,
  GraduationCap, Play, List, Video, FileQuestion,
  Users, Target, TrendingUp, Zap, Star, Globe,
  Check, ChevronRight, Menu, X, Info, Briefcase,
  Building, Mail, Phone, MapPin, MessageCircle, AlertCircle
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "https://jawaharglobal-backend.onrender.com";

// ✅ SINGLE FALLBACK IMAGE FOR ALL COURSES
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&auto=format&fit=crop&q=60";

// ✅ FALLBACK COURSES WITH ENHANCED DATA
const FALLBACK_COURSES = [
  {
    id: 1,
    slug: "mechanic",
    title: "Mechanic Basics",
    description: "Learn maintenance workflow, diagnostics mindset, and safe workshop practices.",
    level: "Beginner",
    durationHours: 8,
    coverImageUrl: FALLBACK_IMAGE,
    learningOutcomes: [
      "Understand basic mechanical systems and components",
      "Perform routine maintenance and diagnostics",
      "Use workshop tools safely and effectively",
      "Identify and troubleshoot common mechanical issues"
    ],
    courseIncludes: [
      "Hands-on Workshop Training",
      "Real Vehicle Practice",
      "Placement Assistance",
      "Industry-Recognized Diploma"
    ],
    courseOverview: "This comprehensive Mechanic Basics course is designed for beginners who want to build a strong foundation in mechanical systems. Through hands-on workshop training and real vehicle practice, you'll develop the skills needed to diagnose and repair common mechanical issues with confidence.",
    targetAudience: "Ideal for school leavers, career changers, and anyone interested in starting a career in the automotive industry.",
    careerOpportunities: ["Automotive Technician", "Workshop Assistant", "Maintenance Engineer", "Fleet Maintenance Supervisor"]
  },
  {
    id: 2,
    slug: "electrician",
    title: "Electrician Fundamentals",
    description: "Understand electrical safety, basic tools, wiring concepts, and safe troubleshooting approach.",
    level: "Beginner",
    durationHours: 8,
    coverImageUrl: FALLBACK_IMAGE,
    learningOutcomes: [
      "Master electrical safety protocols",
      "Understand wiring diagrams and circuits",
      "Perform safe electrical installations",
      "Troubleshoot common electrical faults"
    ],
    courseIncludes: [
      "Safety Certification",
      "Live Wiring Practice",
      "Placement Assistance",
      "Industry-Recognized Diploma"
    ],
    courseOverview: "The Electrician Fundamentals course provides comprehensive training in electrical safety, wiring concepts, and troubleshooting techniques. You'll gain hands-on experience with live wiring practice under expert supervision.",
    targetAudience: "Perfect for beginners looking to enter the electrical trade or professionals wanting to formalize their skills.",
    careerOpportunities: ["Electrician", "Electrical Technician", "Maintenance Electrician", "Construction Electrician"]
  },
  {
    id: 3,
    slug: "parlour",
    title: "Parlour Skills",
    description: "A structured course on skin/hair care routines, safety, and professional service standards.",
    level: "Beginner",
    durationHours: 6,
    coverImageUrl: FALLBACK_IMAGE,
    learningOutcomes: [
      "Master professional skin and hair care techniques",
      "Understand hygiene and safety protocols",
      "Develop client handling and communication skills",
      "Learn professional service standards"
    ],
    courseIncludes: [
      "Client Handling Practice",
      "Hygiene & Care Techniques",
      "Placement Assistance",
      "Industry-Recognized Diploma"
    ],
    courseOverview: "This Parlour Skills course offers comprehensive training in professional skin and hair care, hygiene protocols, and client service standards. You'll learn through practical demonstrations and hands-on practice.",
    targetAudience: "Ideal for those passionate about beauty and wellness, looking to start a career in the parlour industry.",
    careerOpportunities: ["Parlour Artist", "Beauty Therapist", "Salon Manager", "Freelance Beauty Professional"]
  },
  {
    id: 4,
    slug: "salon",
    title: "Salon Skills",
    description: "Styling fundamentals with real client practice.",
    level: "Beginner Friendly",
    durationHours: 40,
    coverImageUrl: FALLBACK_IMAGE,
    learningOutcomes: [
      "Master fundamental styling techniques",
      "Understand client consultation and service",
      "Learn hygiene and safety standards",
      "Develop professional salon skills"
    ],
    courseIncludes: [
      "Styling Fundamentals",
      "Real Client Practice",
      "Placement Assistance",
      "Industry-Recognized Diploma"
    ],
    courseOverview: "The Salon Skills course is a comprehensive program covering all aspects of professional salon services. From styling fundamentals to client consultation, you'll develop the skills needed to thrive in the beauty industry.",
    targetAudience: "Perfect for those aspiring to become professional hairstylists or salon managers.",
    careerOpportunities: ["Hairstylist", "Salon Manager", "Bridal Stylist", "Salon Owner"]
  }
];

export default function CourseLearn() {
  const { slug } = useParams();
  const visitorId = useMemo(() => getOrCreateVisitorId(), []);

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseError, setCourseError] = useState(null);

  // ✅ Fetch Course Details
  useEffect(() => {
    const fallback = FALLBACK_COURSES.find(f => f.slug === slug);
    if (fallback) setCourse(fallback);

    fetch(`${API}/api/courses/${slug}`, {
      headers: { "x-visitor-id": visitorId },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("Course not found");
        return r.json();
      })
      .then((data) => {
        const fallbackData = FALLBACK_COURSES.find(f => f.slug === slug);
        setCourse({
          ...data,
          coverImageUrl: FALLBACK_IMAGE,
          description: data.description || fallbackData?.description,
          level: data.level || fallbackData?.level,
          durationHours: data.durationHours || fallbackData?.durationHours,
          learningOutcomes: data.learningOutcomes || fallbackData?.learningOutcomes || [],
          courseIncludes: data.courseIncludes || fallbackData?.courseIncludes || [],
          courseOverview: data.courseOverview || fallbackData?.courseOverview || "",
          targetAudience: data.targetAudience || fallbackData?.targetAudience || "",
          careerOpportunities: data.careerOpportunities || fallbackData?.careerOpportunities || [],
        });
        setLoading(false);
      })
      .catch(() => {
        if (fallback) setCourse(fallback);
        else setCourseError("Course not found");
        setLoading(false);
      });
  }, [slug, visitorId]);

  // ✅ Fetch Modules
  useEffect(() => {
    fetch(`${API}/api/courses/${slug}/modules`, {
      headers: { "x-visitor-id": visitorId },
    })
      .then((r) => r.json())
      .then((data) => setModules(Array.isArray(data) ? data : []))
      .catch(() => console.error("Failed to load modules"));
  }, [slug, visitorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F2A93B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading course...</p>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-[#0B2545]">Course Not Found</h1>
          <p className="text-gray-500 mt-2">The course you're looking for doesn't exist.</p>
          <Link to="/courses" className="mt-6 inline-block bg-[#F2A93B] hover:bg-[#e0993a] text-[#0B2545] px-6 py-3 rounded-xl font-bold transition-colors">
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-sora font-extrabold text-[#0B2545]">
            Learn: <span className="text-[#F2A93B]">{course.title}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#F2A93B]/10 text-[#0B2545] px-3 py-1 rounded-full border border-[#F2A93B]/20">
              <Award className="w-4 h-4" />
              {course.level || "Beginner"}
            </span>
            {typeof course.durationHours === "number" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                {course.durationHours} hours
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              <BookOpen className="w-4 h-4" />
              {modules.length} modules
            </span>
          </div>
        </div>
        <Link to="/courses" className="text-sm font-bold text-[#F2A93B] hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Column - Course Details + Modules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Overview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-sora font-bold text-[#0B2545] flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-[#F2A93B]" />
              Course Overview
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {course.courseOverview || course.description || "This course provides comprehensive training in practical skills and industry-relevant knowledge."}
            </p>
          </div>

          {/* What You'll Learn */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-sora font-bold text-[#0B2545] flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-[#F2A93B]" />
              What you will learn
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {(course.learningOutcomes || []).map((outcome, index) => (
                <div key={index} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#F2A93B]/5 transition-colors">
                  <Check className="w-5 h-5 text-[#F2A93B] flex-shrink-0 mt-0.5" strokeWidth={3} />
                  <span className="text-gray-700 text-sm">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Includes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-sora font-bold text-[#0B2545] flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-[#F2A93B]" />
              Course Includes
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {(course.courseIncludes || []).map((item, index) => (
                <div key={index} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#F2A93B]/5 transition-colors">
                  <Star className="w-5 h-5 text-[#F2A93B] flex-shrink-0 mt-0.5" fill="#F2A93B" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          {course.targetAudience && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-sora font-bold text-[#0B2545] flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-[#F2A93B]" />
                Target Audience
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{course.targetAudience}</p>
            </div>
          )}

          {/* Career Opportunities */}
          {course.careerOpportunities && course.careerOpportunities.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-sora font-bold text-[#0B2545] flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-[#F2A93B]" />
                Career Opportunities
              </h2>
              <div className="flex flex-wrap gap-2">
                {course.careerOpportunities.map((role, index) => (
                  <span key={index} className="bg-[#F2A93B]/10 text-[#0B2545] text-xs font-medium px-3 py-1.5 rounded-full border border-[#F2A93B]/20">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Module Viewer */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-sora font-bold text-[#0B2545] flex items-center gap-2 mb-3">
              <List className="w-5 h-5 text-[#F2A93B]" />
              Syllabus & Modules
            </h2>
            <ModuleViewer
              modules={modules}
              setModules={setModules}
            />
          </div>
        </div>

        {/* Right Column - Course Info */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Course Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-sora font-bold text-[#0B2545] flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-[#F2A93B]" />
                Course Info
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Level</span>
                  <span className="font-semibold text-[#0B2545]">{course.level || "Beginner"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-semibold text-[#0B2545]">{course.durationHours || 0} hours</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Modules</span>
                  <span className="font-semibold text-[#0B2545]">{modules.length}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Certificate</span>
                  <span className="font-semibold text-[#F2A93B]">✓ Included</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-[#0B2545] to-[#1a3a6e] rounded-2xl p-6 text-white">
              <h3 className="font-sora font-bold text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F2A93B]" />
                Course Progress
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Modules</span>
                  <span className="font-semibold">{modules.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Status</span>
                  <span className="font-semibold text-[#F2A93B]">
                    {modules.length === 0 ? 'Not Started' : 'In Progress'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Certificate</span>
                  <span className="font-semibold text-[#F2A93B]">Ready</span>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
              <Shield className="w-4 h-4 inline-block mr-1 text-gray-400" />
              <span className="text-xs text-gray-500">
                Uses visitor ID stored in your browser
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}