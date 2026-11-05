import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { courses } from "@/lib/data";

export default function CoursesPage() {
  return (
    <>
      <h1 className="page-title">My Courses</h1>

      <div className="grid grid-3">
        {courses.map((c) => (
          <div key={c.id} className="card course-card">
            <span className="tag">{c.code}</span>
            <h3>{c.name}</h3>
            <p className="muted">👨‍🏫 {c.faculty}</p>
            <p className="muted">🎯 {c.credits} Credits</p>
            <div className="row-between small">
              <span>Progress</span>
              <span>{c.progress}%</span>
            </div>
            <ProgressBar value={c.progress} />
            <Link href={"/courses/" + c.id} className="btn btn-full">View Course</Link>
          </div>
        ))}
      </div>
    </>
  );
}
