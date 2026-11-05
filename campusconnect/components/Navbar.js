"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { currentUser } from "@/lib/data";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/courses", label: "Courses", icon: "📚" },
  { href: "/students", label: "Students", icon: "👥" },
  { href: "/assignments", label: "Assignments", icon: "📝" },
  { href: "/profile", label: "Profile", icon: "👤" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar (search, notifications, profile) */}
      <header className="topbar">
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
        <input className="search" type="text" placeholder="🔍 Search anything..." />
        <div className="topbar-right">
          <span className="bell">🔔<span className="dot">2</span></span>
          <Link href="/profile" className="avatar-small">{currentUser.name[0]}</Link>
        </div>
      </header>

      {/* Sidebar (logo, links, profile, logout) */}
      <aside className={open ? "sidebar open" : "sidebar"}>
        <Link href="/dashboard" className="logo">🎓 Campus<span>Connect</span></Link>

        <nav>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={pathname.startsWith(link.href) ? "nav-link active" : "nav-link"}
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-profile">
          <div className="avatar-small">{currentUser.name[0]}</div>
          <div>
            <strong>{currentUser.name}</strong>
            <small>{currentUser.rollNo}</small>
          </div>
        </div>
        <Link href="/login" className="btn btn-outline logout">Logout</Link>
      </aside>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </>
  );
}
