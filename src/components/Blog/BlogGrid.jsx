import React, { useEffect, useMemo, useState } from "react";
import BlogCard from "./BlogCard";
import { getOrCreateVisitorId } from "../../lib/visitor";

const API = import.meta.env.VITE_API_URL || "https://jawaharglobal-backend.onrender.com";

const BLOG_DATE_LABELS = [
  "Updated this week",
  "Updated this month",
  "New learning story",
  "Skill spotlight",
  "Program highlight",
];

const BlogGrid = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const visitorId = getOrCreateVisitorId();

    fetch(`${API}/api/courses`, {
      headers: { "x-visitor-id": visitorId },
    })
      .then((r) => r.json())
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .catch(() => setCourses([]));
  }, []);

  const posts = useMemo(() => {
    return (courses || []).map((c, idx) => ({
      image:
        c.coverImageUrl ||
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800",
      date: BLOG_DATE_LABELS[idx % BLOG_DATE_LABELS.length],
      title: c.title,
      desc: c.description,
    }));
  }, [courses]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-5">
        <div className="text-center mb-14">
          <span className="uppercase text-red-700 font-semibold">Course Stories</span>
          <h2 className="text-4xl font-bold mt-3">Latest Skill Updates</h2>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            <BlogCard key={index} blog={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-gray-600 mt-10">
            No course stories available.
          </p>
        )}
      </div>
    </section>
  );
};

export default BlogGrid;

