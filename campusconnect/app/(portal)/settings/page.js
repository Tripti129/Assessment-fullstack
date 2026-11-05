"use client";

import { useState } from "react";
import { currentUser } from "@/lib/data";

export default function SettingsPage() {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <h1 className="page-title">Settings</h1>

      <form className="grid grid-2" onSubmit={handleSave}>
        <div className="card">
          <h3>Account</h3>
          <label>Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>New Password</label>
          <input type="password" placeholder="••••••••" />
        </div>

        <div className="card">
          <h3>Notifications</h3>
          <label className="check">
            <input type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
            Email alerts
          </label>
          <label className="check">
            <input type="checkbox" checked={reminders} onChange={() => setReminders(!reminders)} />
            Assignment deadline reminders
          </label>
          <button type="submit" className="btn btn-full mt">Save Changes</button>
          {saved && <p className="success">✔ Settings saved!</p>}
        </div>
      </form>
    </>
  );
}
