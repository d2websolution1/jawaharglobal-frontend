import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../lib/adminApi";
import AdminLayout from "../../components/admin/AdminLayout";
import { 
  Save, ArrowLeft, Loader2, AlertCircle, CheckCircle,
  User, Mail, BookOpen, FileText, Calendar, Award
} from "lucide-react";

export default function AdminCertificateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [form, setForm] = useState({
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
    visitorId: "",
    enrollmentNumber: "",
    email: "",
    photo: null,
    certificateType: "certificate",
  });

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  const fetchCertificate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.get(`/api/admin/certificates/${id}`);
      const data = res.data;
      setForm({
        fullName: data.fullName || "",
        courseSlug: data.courseSlug || "",
        courseTitle: data.meta?.courseTitle || "",
        signatoryName: data.meta?.signatoryName || "",
        guardianRelation: data.meta?.guardianRelation || "S/O",
        guardianName: data.meta?.guardianName || "",
        dob: data.meta?.dob || "",
        duration: data.meta?.duration || "",
        grade: data.meta?.grade || "",
        enrollmentNo: data.meta?.enrollmentNo || "",
        branchCode: data.meta?.branchCode || "",
        place: data.meta?.place || "",
        issuedAt: data.issuedAt ? data.issuedAt.split('T')[0] : "",
        visitorId: data.visitorId || "",
        enrollmentNumber: data.enrollmentNumber || "",
        email: data.email || "",
        photo: null,
        certificateType: data.meta?.certificateType || (data.displayName === 'Diploma' ? 'diploma' : 'certificate') || 'certificate',
      });
      if (data.meta?.photoUrl) {
        setPhotoPreview(data.meta.photoUrl);
      }
    } catch (e) {
      console.error("❌ Fetch error:", e);
      setError(e?.response?.data?.message || "Failed to load certificate");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const meta = {
        courseTitle: form.courseTitle,
        signatoryName: form.signatoryName,
        guardianRelation: form.guardianRelation,
        guardianName: form.guardianName,
        dob: form.dob,
        duration: form.duration,
        grade: form.grade,
        enrollmentNo: form.enrollmentNo,
        branchCode: form.branchCode,
        place: form.place,
        certificateType: form.certificateType,
      };

      if (photoPreview && !photoPreview.startsWith('blob:')) {
        meta.photoUrl = photoPreview;
      }

      // ✅ JSON data bhejo
      const data = {
        fullName: form.fullName,
        courseSlug: form.courseSlug,
        visitorId: form.visitorId,
        enrollmentNumber: form.enrollmentNumber,
        email: form.email,
        issuedAt: form.issuedAt,
        meta: meta,
      };

      console.log("📡 Sending PUT request to:", `/api/certificates/${id}`);
      await adminApi.put(`/api/certificates/${id}`, data);

      // ✅ Upload new photo if selected
      if (form.photo) {
        const photoData = new FormData();
        photoData.append("photo", form.photo);
        await adminApi.post(`/api/admin/certificates/${id}/photo`, photoData);
      }

      setSuccess("Certificate updated successfully!");
      setTimeout(() => navigate("/admin/certificates"), 1500);
    } catch (e) {
      console.error("❌ Error:", e);
      console.error("❌ Response:", e.response);
      setError(e?.response?.data?.message || "Failed to update certificate");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Certificate" subtitle="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#C62828]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Certificate" subtitle="Update certificate details">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => navigate("/admin/certificates")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#C62828] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Certificates
          </button>
          <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            ID: {id}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Document Type *
              </label>
              <select
                value={form.certificateType}
                onChange={(e) => setForm({ ...form, certificateType: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition bg-white"
              >
                <option value="certificate">Certificate (Certificate of Completion)</option>
                <option value="diploma">Diploma</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Full Name *
              </label>
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Course Slug *
              </label>
              <input
                value={form.courseSlug}
                onChange={(e) => setForm({ ...form, courseSlug: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Course Title</label>
              <input
                value={form.courseTitle}
                onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Signatory Name</label>
              <input
                value={form.signatoryName}
                onChange={(e) => setForm({ ...form, signatoryName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Guardian Relation</label>
              <select
                value={form.guardianRelation}
                onChange={(e) => setForm({ ...form, guardianRelation: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
              >
                <option value="S/O">S/O</option>
                <option value="D/O">D/O</option>
                <option value="W/O">W/O</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Guardian Name</label>
              <input
                value={form.guardianName}
                onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Date of Birth
              </label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Duration</label>
              <input
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Grade</label>
              <input
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Enrollment No.
              </label>
              <input
                value={form.enrollmentNo}
                onChange={(e) => setForm({ ...form, enrollmentNo: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Branch Code</label>
              <input
                value={form.branchCode}
                onChange={(e) => setForm({ ...form, branchCode: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Place</label>
              <input
                value={form.place}
                onChange={(e) => setForm({ ...form, place: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Visitor ID</label>
              <input
                value={form.visitorId}
                onChange={(e) => setForm({ ...form, visitorId: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Enrollment Number</label>
              <input
                value={form.enrollmentNumber}
                onChange={(e) => setForm({ ...form, enrollmentNumber: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Issued Date
              </label>
              <input
                type="date"
                value={form.issuedAt}
                onChange={(e) => setForm({ ...form, issuedAt: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Photo
              </label>
              <div className="mt-1.5 flex items-center gap-3">
                {photoPreview && (
                  <div className="w-14 h-16 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50 shadow-sm">
                    <img
                      src={photoPreview.startsWith('http') || photoPreview.startsWith('blob:') || photoPreview.startsWith('data:') ? photoPreview : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${photoPreview.startsWith('/') ? '' : '/'}${photoPreview}`}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setForm({ ...form, photo: file });
                    if (file) {
                      setPhotoPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition"
                />
              </div>
              {form.photo ? (
                <p className="mt-1 text-xs text-green-600">New photo selected: {form.photo.name}</p>
              ) : photoPreview ? (
                <p className="mt-1 text-xs text-gray-500">Current student photo loaded</p>
              ) : (
                <p className="mt-1 text-xs text-gray-400">No photo uploaded yet</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/certificates")}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#C62828] hover:bg-[#8E0000] text-white font-bold px-8 py-2.5 rounded-xl text-sm transition-all duration-300 disabled:opacity-60 flex items-center gap-2 shadow-lg hover:shadow-[#C62828]/30"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}