// Dummy data used across the app

export const currentUser = {
  id: 1,
  name: "Tripti mittal",
  email: "tripti@campusconnect.edu",
  rollNo: "CS2023001",
  department: "Computer Science",
  year: "3rd Year",
  phone: "705693589",
  attendance: 87,
};

export const students = [
  { id: 1, name: "Vivek ", rollNo: "CS2023001", department: "Computer Science", year: "3rd Year", email: "vivek@campusconnect.edu", attendance: 87, skills: ["React", "Next.js", "Node.js", "SQL"], courses: [1, 2, 3] },
  { id: 2, name: "Ananya Sharma", rollNo: "CS2023002", department: "Computer Science", year: "3rd Year", email: "ananya@campusconnect.edu", attendance: 92, skills: ["Python", "Machine Learning", "Java"], courses: [1, 2, 4] },
  { id: 3, name: "Rahul Verma", rollNo: "IT2023010", department: "Information Technology", year: "2nd Year", email: "rahul@campusconnect.edu", attendance: 78, skills: ["HTML", "CSS", "JavaScript"], courses: [3, 5] },
  { id: 4, name: "Priya Nair", rollNo: "EC2023015", department: "Electronics", year: "3rd Year", email: "priya@campusconnect.edu", attendance: 95, skills: ["C", "Embedded Systems", "MATLAB"], courses: [4, 6] },
  { id: 5, name: "Arjun Singh", rollNo: "ME2023020", department: "Mechanical", year: "4th Year", email: "arjun@campusconnect.edu", attendance: 81, skills: ["AutoCAD", "SolidWorks"], courses: [6] },
  { id: 6, name: "Sneha Reddy", rollNo: "IT2023022", department: "Information Technology", year: "2nd Year", email: "sneha@campusconnect.edu", attendance: 89, skills: ["UI/UX", "Figma", "React"], courses: [2, 3, 5] },
];

export const departments = ["Computer Science", "Information Technology", "Electronics", "Mechanical"];

export const courses = [
  { id: 1, code: "CS3503", name: "Full Stack Development", faculty: "Dr. Meera Iyer", credits: 4, progress: 65, description: "Build modern web applications using React, Next.js, Node.js and databases." },
  { id: 2, code: "CS3401", name: "Database Systems", faculty: "Prof. Rajesh Gupta", credits: 3, progress: 80, description: "Relational models, SQL, normalization, transactions and indexing." },
  { id: 3, code: "CS3302", name: "Web Technologies", faculty: "Dr. Kavita Rao", credits: 3, progress: 90, description: "HTML, CSS, JavaScript and responsive web design fundamentals." },
  { id: 4, code: "CS3604", name: "Software Engineering", faculty: "Prof. Anil Mehta", credits: 4, progress: 50, description: "Software life cycle, requirements, design patterns and testing." },
  { id: 5, code: "CS3205", name: "Data Structures", faculty: "Dr. Sunita Das", credits: 4, progress: 100, description: "Arrays, linked lists, trees, graphs, sorting and searching." },
  { id: 6, code: "CS3706", name: "Operating Systems", faculty: "Prof. Vikram Joshi", credits: 3, progress: 40, description: "Processes, scheduling, memory management and file systems." },
];

export const assignments = [
  { id: 1, title: "React Project", courseId: 1, dueDate: "10 Nov 2026", status: "Pending", priority: "High" },
  { id: 2, title: "Database Design", courseId: 2, dueDate: "08 Nov 2026", status: "Submitted", priority: "Medium" },
  { id: 3, title: "UI Design Task", courseId: 3, dueDate: "05 Nov 2026", status: "Pending", priority: "High" },
  { id: 4, title: "Final Project Proposal", courseId: 4, dueDate: "01 Nov 2026", status: "Completed", priority: "Low" },
  { id: 5, title: "Database Assignment", courseId: 2, dueDate: "12 Nov 2026", status: "Pending", priority: "Medium" },
  { id: 6, title: "Web Design Portfolio", courseId: 3, dueDate: "15 Nov 2026", status: "Pending", priority: "Low" },
  { id: 7, title: "Linked List Problems", courseId: 5, dueDate: "25 Oct 2026", status: "Completed", priority: "Low" },
];

export const activities = [
  "Submitted Database Design assignment",
  "Joined Full Stack Development lecture",
  "Completed Data Structures quiz (18/20)",
  "Downloaded Operating Systems notes",
];

export function getCourse(id) {
  return courses.find((c) => c.id === Number(id));
}

export function getStudent(id) {
  return students.find((s) => s.id === Number(id));
}
