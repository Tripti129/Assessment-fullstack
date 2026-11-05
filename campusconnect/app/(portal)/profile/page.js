import ProgressBar from "@/components/ProgressBar";
import { currentUser, getStudent, getCourse } from "@/lib/data";

export default function ProfilePage() {
  const me = getStudent(currentUser.id);
  const myCourses = me.courses.map(getCourse);

  const details = [
    ["Email", currentUser.email],
    ["Roll No", currentUser.rollNo],
    ["Department", currentUser.department],
    ["Year", currentUser.year],
    ["Phone", currentUser.phone],
  ];

  return (
    <>
      <h1 className="page-title">My Profile</h1>

      <div className="card profile-header">
        <div className="avatar avatar-lg">{currentUser.name[0]}</div>
        <div>
          <h2>{currentUser.name}</h2>
          <p className="muted">{currentUser.department} · {currentUser.year}</p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Personal Information</h3>
          <ul className="list">
            {details.map(([label, value]) => (
              <li key={label}><span className="muted">{label}</span><span>{value}</span></li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Attendance</h3>
          <p className="big-number">{currentUser.attendance}%</p>
          <ProgressBar value={currentUser.attendance} />
          <h3 className="mt">Skills</h3>
          <div className="tags">
            {me.skills.map((s) => <span key={s} className="tag">{s}</span>)}
          </div>
          <h3 className="mt">Courses</h3>
          <div className="tags">
            {myCourses.map((c) => <span key={c.id} className="tag">{c.name}</span>)}
          </div>
        </div>
      </div>
    </>
  );
}
