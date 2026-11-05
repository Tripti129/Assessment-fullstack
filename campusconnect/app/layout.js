import "./globals.css";

export const metadata = {
  title: "CampusConnect – Student Management Portal",
  description: "Manage courses, assignments and students in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
