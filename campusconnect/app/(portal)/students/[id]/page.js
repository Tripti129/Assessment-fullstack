import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import ProgressBar from "@/components/ProgressBar";
import { students, assignments, getStudent, getCourse } from "@/lib/data";

export function generateStaticParams() {
  return students.map((s) => ({ id: String(s.id) }));
}

export default async function StudentDetails({ params }) {
  const { id } = await params;
  const student = getStudent(id);
  if (!student) notFound();

  const enrolled = student.courses.map(getCourse);
  const studentAssignments = assignments.filter((a) => student.courses.includes(a.courseId));

  return (
    <>
      <Link href="/students" className="link">← Back to Students</Link>

      <div className="card profile-header">
        <div className="avatar avatar-lg">{student.name[0]}</div>
        <div>
          <h1>{student.name}</h1>
          <p className="muted">{student.rollNo} · {student.department} · {student.year}</p>
          <p>{student.email}</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Skills</h3>
          <div className="tags">
            {student.skills.map((skill) => <span key={skill} className="tag">{skill}</span>)}
          </div>
        </div>

        <div className="card">
          <h3>Attendance</h3>
          <p className="big-number">{student.attendance}%</p>
          <ProgressBar value={student.attendance} />
        </div>
      </div>

      <div className="card">
        <h3>Enrolled Courses</h3>
        <ul className="list">
          {enrolled.map((c) => (
            <li key={c.id}>
              <Link href={"/courses/" + c.id} className="link">{c.name}</Link>
              <span className="muted">{c.faculty}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h3>Assignment Status</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Assignment</th><th>Course</th><th>Status</th></tr></thead>
            <tbody>
              {studentAssignments.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{getCourse(a.courseId).name}</td>
                  <td><Badge text={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
