import Navbar from "@/components/Navbar";

// Layout for all pages after login: sidebar navbar + main content + footer
export default function PortalLayout({ children }) {
  return (
    <div className="portal">
      <Navbar />
      <div className="main">
        <div className="content">{children}</div>
        <footer className="footer">© 2026 CampusConnect. All rights reserved.</footer>
      </div>
    </div>
  );
}
