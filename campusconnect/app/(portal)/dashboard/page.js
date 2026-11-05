import Link from "next/link";
import Badge from "@/components/Badge";
import { courses, assignments, activities, currentUser, getCourse } from "@/lib/data";

export default function Dashboard() {
  const pending = assignments.filter((a) => a.status === "Pending");
  const completed = assignments.filter((a) => a.status !== "Pending");

  const stats = [
    { label: "Total Courses", value: courses.length, icon: "📚", color: "blue", href: "/courses" },
    { label: "Pending", value: pending.length, icon: "⏰", color: "orange", href: "/assignments" },
    { label: "Completed", value: completed.length, icon: "✅", color: "green", href: "/assignments" },
    { label: "Attendance", value: currentUser.attendance + "%", icon: "📊", color: "purple", href: "/profile" },
  ];

  return (
    <>
      <div className="welcome">
        <div>
          <h1>Welcome, {currentUser.name.split(" ")[0]} 👋</h1>
          <p>Let&apos;s keep learning and achieve more together!</p>
        </div>
        <span className="welcome-icon">🎓</span>
      </div>

      <div className="grid grid-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={"stat stat-" + s.color}>
            <span className="stat-icon">{s.icon}</span>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </Link>
        ))}
      </div>

      <div className="card">
        <div className="card-head">
          <h3>📋 Recent Assignments</h3>
          <Link href="/assignments" className="link">View All →</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Assignment</th><th>Course</th><th>Due Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {assignments.slice(0, 4).map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{getCourse(a.courseId).name}</td>
                  <td>{a.dueDate}</td>
                  <td><Badge text={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-head">
            <h3>📅 Upcoming Deadlines</h3>
            <Link href="/assignments" className="link">View All →</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Assignment</th><th>Date</th><th>Priority</th></tr>
              </thead>
              <tbody>
                {pending.map((a) => (
                  <tr key={a.id}>
                    <td>{a.title}</td>
                    <td>{a.dueDate}</td>
                    <td><Badge text={a.priority} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3>🕒 Recent Activities</h3>
          <ul className="activity">
            {activities.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </>
  );
}
