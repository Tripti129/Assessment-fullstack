"use client";

import Link from "next/link";
import { useState } from "react";
import { students, departments } from "@/lib/data";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");

  // Filter by name/roll number and department
  const filtered = students.filter((s) => {
    const text = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(text) || s.rollNo.toLowerCase().includes(text);
    const matchDept = dept === "All" || s.department === dept;
    return matchSearch && matchDept;
  });

  return (
    <>
      <h1 className="page-title">Students</h1>

      <div className="toolbar">
        <input type="text" placeholder="Search by name or roll no..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={dept} onChange={(e) => setDept(e.target.value)}>
          <option value="All">All Departments</option>
          {departments.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      {filtered.length === 0 && <p className="muted">No students found.</p>}

      <div className="grid grid-3">
        {filtered.map((s) => (
          <div key={s.id} className="card student-card">
            <div className="avatar">{s.name[0]}</div>
            <h3>{s.name}</h3>
            <p className="muted">{s.rollNo}</p>
            <p>{s.department} · {s.year}</p>
            <Link href={"/students/" + s.id} className="btn btn-full">View Details</Link>
          </div>
        ))}
      </div>
    </>
  );
}
