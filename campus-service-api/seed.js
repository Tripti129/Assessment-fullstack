// Seed script: run with `npm run seed`
// Clears the database and creates an admin, staff members, students and sample requests.
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const ServiceRequest = require("./models/ServiceRequest");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await ServiceRequest.deleteMany({});

  // User.create runs the pre-save hook, so passwords get hashed
  const [admin, ravi, sunita, tripti, aman] = await User.create([
    { name: "Admin", email: "admin@campus.edu", password: "admin123", role: "admin", department: "Administration" },
    { name: "Ravi Kumar", email: "ravi@campus.edu", password: "staff123", role: "staff", department: "IT Support" },
    { name: "Sunita Devi", email: "sunita@campus.edu", password: "staff123", role: "staff", department: "Maintenance" },
    { name: "Tripti Mittal", email: "tripti@campus.edu", password: "student123", role: "student", department: "Computer Science" },
    { name: "Aman Verma", email: "aman@campus.edu", password: "student123", role: "student", department: "Electronics" },
  ]);

  await ServiceRequest.create([
    { title: "Lab computer not starting", description: "PC number 14 in Lab 2 does not boot, shows a black screen.", category: "Computer", priority: "High", status: "Pending", createdBy: tripti._id },
    { title: "Projector not working in Room 204", description: "The projector turns on but shows no input from the HDMI cable.", category: "Classroom Equipment", priority: "Medium", status: "Under Review", createdBy: tripti._id },
    { title: "Wi-Fi very slow in hostel block B", description: "Internet speed is below 1 Mbps on the second floor since Monday.", category: "Internet", priority: "High", status: "In Progress", assignedTo: ravi._id, adminResponse: "IT team is replacing the router.", createdBy: aman._id },
    { title: "Leaking tap in hostel bathroom", description: "Tap in bathroom of room 112 has been leaking for three days.", category: "Hostel Maintenance", priority: "Low", status: "Resolved", assignedTo: sunita._id, adminResponse: "Tap has been replaced.", createdBy: aman._id },
    { title: "Fan not working in classroom", description: "Ceiling fan in Room 101 makes noise and does not rotate.", category: "Electrical", priority: "Medium", status: "Assigned", assignedTo: sunita._id, createdBy: tripti._id },
    { title: "Library book not issued", description: "Library system shows my card as blocked though I have no dues.", category: "Library", priority: "Low", status: "Rejected", adminResponse: "Your card had an unpaid fine; please visit the library desk.", createdBy: aman._id },
  ]);

  console.log("Seed complete. Login accounts:");
  console.log("  admin   -> admin@campus.edu / admin123");
  console.log("  staff   -> ravi@campus.edu / staff123, sunita@campus.edu / staff123");
  console.log("  student -> tripti@campus.edu / student123, aman@campus.edu / student123");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
