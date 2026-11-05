# CampusConnect – Student Management Portal

CS3503 – Full Stack Development-II (Next.js) · Assessment 1

A responsive, multi-page frontend built with **Next.js (App Router)**, **React** and plain **CSS**, using static dummy data.

## Pages

| Route | Page |
|---|---|
| `/` | Landing / home page |
| `/login` | Login interface |
| `/dashboard` | Student dashboard |
| `/students` | Student listing (search + department filter) |
| `/students/[id]` | Student profile / details |
| `/courses` | Course listing |
| `/courses/[id]` | Course details |
| `/assignments` | Assignment management (status filter + submit) |
| `/profile` | Student profile |
| `/settings` | Settings page |

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Login accepts any email and password (demo).

## Project structure

```
app/
  page.js              Landing page
  login/page.js        Login page
  (portal)/layout.js   Layout with navbar for all pages after login
  (portal)/...         Dashboard, students, courses, assignments, profile, settings
  globals.css          All styles (responsive with media queries)
components/            Navbar, Badge, ProgressBar
lib/data.js            Dummy data
docs/                  Screenshots PDF
```

## Screenshots

See [docs/CampusConnect_Screenshots.pdf](docs/CampusConnect_Screenshots.pdf).
