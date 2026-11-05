import Link from "next/link";

// Landing page
export default function Home() {
  const features = [
    { icon: "📚", title: "Courses", text: "See all your courses, faculty and progress in one place." },
    { icon: "📝", title: "Assignments", text: "Track deadlines and submit assignments on time." },
    { icon: "📊", title: "Attendance", text: "Keep an eye on your attendance percentage." },
    { icon: "👥", title: "Students", text: "Find classmates and view their profiles and skills." },
  ];

  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="logo">🎓 Campus<span>Connect</span></div>
        <Link href="/login" className="btn">Login</Link>
      </header>

      <section className="hero">
        <h1>Your campus, all in one place</h1>
        <p>CampusConnect helps students manage courses, assignments and attendance easily.</p>
        <div className="hero-buttons">
          <Link href="/login" className="btn">Get Started</Link>
          <Link href="/dashboard" className="btn btn-outline">View Dashboard</Link>
        </div>
      </section>

      <section className="grid grid-4 landing-features">
        {features.map((f) => (
          <div key={f.title} className="card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p className="muted">{f.text}</p>
          </div>
        ))}
      </section>

      <footer className="footer">© 2026 CampusConnect. All rights reserved.</footer>
    </div>
  );
}
