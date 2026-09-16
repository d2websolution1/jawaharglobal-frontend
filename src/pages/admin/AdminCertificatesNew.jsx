import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi, getAdminToken, resolveMediaUrl } from "../../lib/adminApi";
import AdminLayout from "../../components/admin/AdminLayout";
import { 
  Plus, Search, Trash2, Eye, Upload, User, Mail, 
  Calendar, BookOpen, Award, FileText, ChevronLeft, 
  ChevronRight, X, Loader2, CheckCircle, AlertCircle,
  UserPlus, GraduationCap, Building, Phone, MapPin,
  RefreshCw, Filter, Download, Edit, FileCheck, ClipboardCheck, Settings
} from "lucide-react";

export default function AdminCertificatesNew() {
  const navigate = useNavigate();
  const hasToken = useMemo(() => !!getAdminToken(), []);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [notice, setNotice] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // ✅ Fixed to "certificate" only
  const certificateType = "certificate";

  const [create, setCreate] = useState({
    visitorId: "",
    enrollmentNumber: "",
    email: "",
    fullName: "",
    courseSlug: "",
    courseTitle: "",
    signatoryName: "",
    guardianRelation: "S/O",
    guardianName: "",
    dob: "",
    duration: "",
    grade: "",
    enrollmentNo: "",
    branchCode: "",
    place: "",
    issuedAt: "",
    photo: null,
  });
  const [creating, setCreating] = useState(false);

  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentFilters, setEnrollmentFilters] = useState({
    q: "",
    courseSlug: "",
    fullName: "",
    visitorId: "",
    enrollmentNumber: "",
    email: "",
    status: "",
    limit: 25,
    page: 1,
  });
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentErr, setEnrollmentErr] = useState(null);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState(null);

  const [filters, setFilters] = useState({
    q: "",
    courseSlug: "",
    fullName: "",
    visitorId: "",
    from: "",
    to: "",
    limit: "25",
    page: 1,
  });

  const [showEnrollmentLookup, setShowEnrollmentLookup] = useState(false);

  // ✅ Save type to settings when changed
  const saveTypeToSettings = async (type) => {
    setSavingSettings(true);
    try {
      await adminApi.put("/api/admin/settings/certificate_name", { 
        value: type === 'diploma' ? 'Diploma' : 'Certificate' 
      });
      console.log(`✅ Settings updated to: ${type}`);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setErr("Failed to save type to settings. Please try again.");
    } finally {
      setSavingSettings(false);
    }
  };

  const createCertificate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setErr(null);
    setNotice(null);

    try {
      const meta = {
        courseTitle: create.courseTitle,
        signatoryName: create.signatoryName,
        guardianRelation: create.guardianRelation,
        guardianName: create.guardianName,
        dob: create.dob,
        duration: create.duration,
        grade: create.grade,
        enrollmentNo: create.enrollmentNo,
        branchCode: create.branchCode,
        place: create.place,
        certificateType: "certificate",
      };

      const formData = new FormData();
      if (create.visitorId) formData.append("visitorId", create.visitorId);
      if (create.enrollmentNumber) formData.append("enrollmentNumber", create.enrollmentNumber);
      if (create.email) formData.append("email", create.email);
      if (create.fullName) formData.append("fullName", create.fullName);
      if (create.courseSlug) formData.append("courseSlug", create.courseSlug);
      if (create.issuedAt) formData.append("issuedAt", create.issuedAt);
      formData.append("meta", JSON.stringify(meta));
      if (create.photo) formData.append("photo", create.photo);

      await adminApi.post("/api/admin/certificates", formData);

      setNotice(`✅ Certificate created successfully!`);
      
      setCreate({
        visitorId: "",
        enrollmentNumber: "",
        email: "",
        fullName: "",
        courseSlug: "",
        courseTitle: "",
        signatoryName: "",
        guardianRelation: "S/O",
        guardianName: "",
        dob: "",
        duration: "",
        grade: "",
        enrollmentNo: "",
        branchCode: "",
        place: "",
        issuedAt: "",
        photo: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchList(filters);
    } catch (err) {
      console.error("Create certificate error:", err);
      setErr(err?.response?.data?.message || "Failed to create certificate");
    } finally {
      setCreating(false);
    }
  };

  const buildEnrollmentParams = (f) => {
    const params = new URLSearchParams();
    if (f.q) params.set("q", f.q);
    if (f.courseSlug) params.set("courseSlug", f.courseSlug);
    if (f.fullName) params.set("fullName", f.fullName);
    if (f.visitorId) params.set("visitorId", f.visitorId);
    if (f.enrollmentNumber) params.set("enrollmentNumber", f.enrollmentNumber);
    if (f.email) params.set("email", f.email);
    if (f.status) params.set("status", f.status);
    if (f.limit) params.set("limit", String(f.limit));
    if (f.page) params.set("page", String(f.page));
    return params;
  };

  const fetchEnrollments = async (f) => {
    setEnrollmentLoading(true);
    setEnrollmentErr(null);
    try {
      const res = await adminApi.get(`/api/admin/enrollments?${buildEnrollmentParams(f).toString()}`);
      setEnrollments(Array.isArray(res.data?.items) ? res.data.items : []);
    } catch (e) {
      setEnrollmentErr(e?.response?.data?.message || "Failed to load enrollments");
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const useEnrollment = (enrollment) => {
    setCreate((c) => ({
      ...c,
      visitorId: enrollment.visitorId || c.visitorId,
      enrollmentNumber: enrollment.enrollmentNumber || c.enrollmentNumber,
      email: enrollment.email || c.email,
      fullName: enrollment.fullName || c.fullName,
      courseSlug: enrollment.courseSlug || c.courseSlug,
    }));
    setNotice(`Loaded enrollment for ${enrollment.fullName}. Complete the form and create certificate.`);
    setShowEnrollmentLookup(false);
  };

  const onEnrollmentSearch = (e) => {
    e.preventDefault();
    const next = { ...enrollmentFilters, page: 1 };
    setEnrollmentFilters(next);
    fetchEnrollments(next);
  };

  const buildParams = (f) => {
    const params = new URLSearchParams();
    if (f.q) params.set("q", f.q);
    if (f.courseSlug) params.set("courseSlug", f.courseSlug);
    if (f.fullName) params.set("fullName", f.fullName);
    if (f.visitorId) params.set("visitorId", f.visitorId);
    if (f.from) params.set("from", f.from);
    if (f.to) params.set("to", f.to);
    
    if (f.limit && f.limit !== "all") {
      params.set("limit", String(f.limit));
    }
    params.set("page", String(f.page || 1));
    return params;
  };

  const fetchList = async (f) => {
    setLoading(true);
    setErr(null);
    try {
      const res = await adminApi.get(`/api/admin/certificates?${buildParams(f).toString()}`);
      setItems(Array.isArray(res.data?.items) ? res.data.items : []);
      setTotal(res.data?.total || 0);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasToken) {
      navigate("/admin/login", { replace: true });
      return;
    }
    // ✅ Save certificate type to settings
    saveTypeToSettings("certificate");
    fetchList(filters);
  }, [hasToken]);

  const onSubmit = (e) => {
    e.preventDefault();
    const next = { ...filters, page: 1 };
    setFilters(next);
    fetchList(next);
  };

  const goToPage = (page) => {
    const next = { ...filters, page };
    setFilters(next);
    fetchList(next);
  };

  const onDelete = async (cert) => {
    const ok = window.confirm(`Delete Certificate #${cert.certificateNumber} for "${cert.fullName}"? This can't be undone.`);
    if (!ok) return;

    setDeletingId(cert.id);
    setErr(null);
    try {
      await adminApi.delete(`/api/admin/certificates/${cert.id}`);
      setNotice(`Certificate deleted successfully.`);
      fetchList(filters);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to delete certificate");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = filters.limit === "all" 
    ? 1 
    : Math.max(1, Math.ceil(total / (Number(filters.limit) || 25)));

  const typeLabel = "Certificate";
  const typeLabelLower = "certificate";

  return (
    <AdminLayout
      title={`${typeLabel}s`}
      subtitle={`Search, edit and manage issued ${typeLabelLower}s`}
      actions={
        <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {total} total
        </span>
      }
    >
      {/* Create Certificate Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7B1C1C]/10 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-[#7B1C1C]" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-gray-800 text-sm">Create Certificate</h3>
              <p className="text-xs text-gray-500">Generate certificate for student. Same student + course will update existing certificate.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowEnrollmentLookup(!showEnrollmentLookup)}
            className="text-[#7B1C1C] text-sm font-semibold hover:underline flex items-center gap-1"
          >
            <UserPlus className="w-4 h-4" />
            {showEnrollmentLookup ? 'Hide Enrollment Lookup' : 'Find Enrollment'}
          </button>
        </div>

        <form onSubmit={createCertificate} className="p-5">
          {notice && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm">{notice}</p>
            </div>
          )}
          {err && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{err}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Full Name *
              </label>
              <input
                value={create.fullName}
                onChange={(e) => setCreate((c) => ({ ...c, fullName: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                placeholder="Student name"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Course Slug *
              </label>
              <input
                value={create.courseSlug}
                onChange={(e) => setCreate((c) => ({ ...c, courseSlug: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                placeholder="e.g. mechanic"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                Email
              </label>
              <input
                value={create.email}
                onChange={(e) => setCreate((c) => ({ ...c, email: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                placeholder="student@email.com"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Enrollment #
              </label>
              <input
                value={create.enrollmentNumber}
                onChange={(e) => setCreate((c) => ({ ...c, enrollmentNumber: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                placeholder="Unique per course"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Visitor ID</label>
              <input
                value={create.visitorId}
                onChange={(e) => setCreate((c) => ({ ...c, visitorId: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                placeholder="e.g. 8B3F..."
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Relation</label>
              <select
                value={create.guardianRelation}
                onChange={(e) => setCreate((c) => ({ ...c, guardianRelation: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
              >
                <option value="S/O">S/O</option>
                <option value="D/O">D/O</option>
                <option value="W/O">W/O</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Guardian Name</label>
              <input
                value={create.guardianName}
                onChange={(e) => setCreate((c) => ({ ...c, guardianName: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                placeholder="Father/Husband name"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Date of Birth</label>
              <input
                type="date"
                value={create.dob}
                onChange={(e) => setCreate((c) => ({ ...c, dob: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Duration</label>
              <input
                value={create.duration}
                onChange={(e) => setCreate((c) => ({ ...c, duration: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                placeholder="e.g. 1 Year"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Grade</label>
              <input
                value={create.grade}
                onChange={(e) => setCreate((c) => ({ ...c, grade: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                placeholder="e.g. A+"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Enrollment No.</label>
              <input
                value={create.enrollmentNo}
                onChange={(e) => setCreate((c) => ({ ...c, enrollmentNo: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                placeholder="Auto if blank"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Branch Code</label>
              <input
                value={create.branchCode}
                onChange={(e) => setCreate((c) => ({ ...c, branchCode: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                placeholder="e.g. 001"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Place</label>
              <input
                value={create.place}
                onChange={(e) => setCreate((c) => ({ ...c, place: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                placeholder="e.g. New Delhi"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Signatory Name</label>
              <input
                value={create.signatoryName}
                onChange={(e) => setCreate((c) => ({ ...c, signatoryName: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                placeholder="Director, JGF"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Course Title</label>
              <input
                value={create.courseTitle}
                onChange={(e) => setCreate((c) => ({ ...c, courseTitle: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                placeholder="Auto from course"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Photo</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setCreate((c) => ({ ...c, photo: file }));
                  }}
                  className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#7B1C1C]/10 file:text-[#7B1C1C] file:font-semibold hover:file:bg-[#7B1C1C]/20 transition focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C]"
                />
                {create.photo && (
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {(create.photo.size / 1024).toFixed(0)} KB
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Issued Date</label>
              <input
                type="date"
                value={create.issuedAt}
                onChange={(e) => setCreate((c) => ({ ...c, issuedAt: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="bg-[#7B1C1C] hover:bg-[#5f1515] text-white font-bold px-8 py-2.5 rounded-xl text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-[#7B1C1C]/30"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Certificate
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Enrollment Lookup */}
      {showEnrollmentLookup && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 animate-fadeIn">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-sora font-bold text-gray-800 text-sm">Enrollment Lookup</h3>
                <p className="text-xs text-gray-500">Search completed enrollments and load student details</p>
              </div>
            </div>
            <button
              onClick={() => setShowEnrollmentLookup(false)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5">
            <form onSubmit={onEnrollmentSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Course Slug</label>
                <input
                  value={enrollmentFilters.courseSlug}
                  onChange={(e) => setEnrollmentFilters((f) => ({ ...f, courseSlug: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  placeholder="e.g. mechanic"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Student Name</label>
                <input
                  value={enrollmentFilters.fullName}
                  onChange={(e) => setEnrollmentFilters((f) => ({ ...f, fullName: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  placeholder="Student name"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Enrollment #</label>
                <input
                  value={enrollmentFilters.enrollmentNumber}
                  onChange={(e) => setEnrollmentFilters((f) => ({ ...f, enrollmentNumber: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  placeholder="Enrollment number"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Status</label>
                <select
                  value={enrollmentFilters.status}
                  onChange={(e) => setEnrollmentFilters((f) => ({ ...f, status: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  <option value="">Any</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all duration-300 flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search Enrollments
                </button>
              </div>
            </form>

            {enrollmentErr && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{enrollmentErr}</p>
              </div>
            )}

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="p-3 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Name</th>
                    <th className="p-3 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Course</th>
                    <th className="p-3 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Status</th>
                    <th className="p-3 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Enrollment #</th>
                    <th className="p-3 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollmentLoading ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          <span className="text-gray-500">Loading enrollments...</span>
                        </div>
                      </td>
                    </tr>
                  ) : enrollments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-500">No enrollments found. Use the search above.</td>
                    </tr>
                  ) : (
                    enrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                        <td className="p-3 font-semibold text-gray-800">{enrollment.fullName}</td>
                        <td className="p-3 text-gray-600">{enrollment.courseSlug}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            enrollment.status === 'completed' ? 'bg-green-100 text-green-700' :
                            enrollment.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {enrollment.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                            {enrollment.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-xs text-gray-600">{enrollment.enrollmentNumber || "—"}</td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => useEnrollment(enrollment)}
                            className="text-[#7B1C1C] font-bold text-xs hover:underline flex items-center gap-1"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            Use
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Search Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-5">
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                  <Search className="w-3.5 h-3.5" />
                  Search
                </label>
                <input
                  value={filters.q}
                  onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                  placeholder="Search by ID, name, slug..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Course Slug</label>
                <input
                  value={filters.courseSlug}
                  onChange={(e) => setFilters((f) => ({ ...f, courseSlug: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                  placeholder="e.g. mechanic"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Full Name</label>
                <input
                  value={filters.fullName}
                  onChange={(e) => setFilters((f) => ({ ...f, fullName: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                  placeholder="Student name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Show
                </label>
                <select
                  value={filters.limit}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFilters((f) => ({ ...f, limit: val, page: 1 }));
                  }}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition bg-white"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="all">All</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  From
                </label>
                <input
                  type="date"
                  value={filters.from}
                  onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  To
                </label>
                <input
                  type="date"
                  value={filters.to}
                  onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1C1C]/20 focus:border-[#7B1C1C] transition"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7B1C1C] hover:bg-[#5f1515] text-white font-bold py-2.5 rounded-xl text-sm transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg hover:shadow-[#7B1C1C]/30"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Filter className="w-4 h-4" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7B1C1C]/10 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-[#7B1C1C]" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-gray-800 text-sm">Issued Certificates</h3>
              <p className="text-xs text-gray-500">{total} certificates found</p>
            </div>
          </div>
          <button
            onClick={() => fetchList(filters)}
            className="text-gray-400 hover:text-[#7B1C1C] transition p-2 rounded-xl hover:bg-[#7B1C1C]/5"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Photo</th>
                <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Certificate #</th>
                <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Name</th>
                <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Course</th>
                <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-[10px]">Issued</th>
                <th className="p-4 font-bold text-gray-500 uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-[#7B1C1C]" />
                      <span className="text-gray-500">Loading certificates...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="text-gray-500">
                      <Award className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p>No certificates found</p>
                      <p className="text-xs text-gray-400 mt-1">Create your first certificate to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((c, index) => {
                  const photo = c.meta?.photoUrl ? resolveMediaUrl(c.meta.photoUrl) : null;
                  return (
                    <tr key={c.id} className={`border-t border-gray-100 hover:bg-[#7B1C1C]/5 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="p-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                          {photo ? (
                            <img src={photo} alt={c.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-gray-400">
                              {(c.fullName || "?").charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-gray-700">{c.certificateNumber}</td>
                      <td className="p-4 font-semibold text-gray-800">{c.fullName}</td>
                      <td className="p-4 text-gray-600 text-xs">{c.courseSlug}</td>
                      <td className="p-4 text-gray-500 text-xs">{c.issuedAt ? new Date(c.issuedAt).toLocaleDateString() : "-"}</td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/certificates/${c.id}/edit`}
                            className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-xs hover:underline transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </Link>
                          <span className="text-gray-300">|</span>
                          <Link
                            to={`/admin/certificates/${c.id}/preview`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#7B1C1C] font-semibold text-xs hover:underline transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Preview
                          </Link>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => onDelete(c)}
                            disabled={deletingId === c.id}
                            className="inline-flex items-center gap-1.5 text-red-500 font-semibold text-xs hover:underline transition-colors disabled:opacity-50"
                          >
                            {deletingId === c.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && items.length > 0 && filters.limit !== "all" && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-700">{items.length}</span> of{' '}
              <span className="font-semibold text-gray-700">{total}</span> certificates
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(Math.max(1, filters.page - 1))}
                disabled={filters.page <= 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <span className="text-sm text-gray-600 px-3">
                Page {filters.page} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(Math.min(totalPages, filters.page + 1))}
                disabled={filters.page >= totalPages}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Show "All" message */}
        {!loading && items.length > 0 && filters.limit === "all" && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-700">All</span> {total} certificates
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </AdminLayout>
  );
}