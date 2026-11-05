import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import ProgressBar from "@/components/ProgressBar";
import { courses, assignments, students, getCourse } from "@/lib/data";

export function generateStaticParams() {
  return courses.map((c) => ({ id: String(c.id) }));
}

export default async function CourseDetails({ params }) {
  const { id } = await params;
  const course = getCourse(id);
  if (!course) notFound();

  const courseAssignments = assignments.filter((a) => a.courseId === course.id);
  const enrolledStudents = students.filter((s) => s.courses.includes(course.id));

  return (
    <>
      <Link href="/courses" className="link">← Back to Courses</Link>

      <div className="card">
        <span className="tag">{course.code}</span>
        <h1>{course.name}</h1>
        <p>{course.description}</p>
        <div className="info-row">
          <div><small className="muted">Faculty</small><p>{course.faculty}</p></div>
          <div><small className="muted">Credits</small><p>{course.credits}</p></div>
          <div><small className="muted">Students</small><p>{enrolledStudents.length}</p></div>
        </div>
        <div className="row-between small"><span>Course Progress</span><span>{course.progress}%</span></div>
        <ProgressBar value={course.progress} />
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Assignments</h3>
          {courseAssignments.length === 0 && <p className="muted">No assignments yet.</p>}
          <ul className="list">
            {courseAssignments.map((a) => (
              <li key={a.id}>
                <span>{a.title} <small className="muted">· {a.dueDate}</small></span>
                <Badge text={a.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Enrolled Students</h3>
          <ul className="list">
            {enrolledStudents.map((s) => (
              <li key={s.id}>
                <Link href={"/students/" + s.id} className="link">{s.name}</Link>
                <span className="muted">{s.rollNo}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
