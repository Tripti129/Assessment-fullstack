# Campus Service Request & Issue Management System (Backend)

CS3542 – Full Stack Development-II Lab · Lab Assessment

A secure REST API where **students** report campus problems (computer, internet, hostel, electrical, library…) and **admins** review, prioritise, assign and resolve them.

**Tech:** Node.js · Express.js · MongoDB + Mongoose · JWT · bcrypt · tested with Postman

---

## Setup

1. Install and start MongoDB locally (or use a MongoDB Atlas URI).
2. Install packages and create the env file:
   ```bash
   npm install
   cp .env.example .env      # then put a long random value in JWT_SECRET
   ```
3. Add sample data (admin, staff, students, requests):
   ```bash
   npm run seed
   ```
4. Start the server:
   ```bash
   npm start                 # or: npm run dev  (auto-restart)
   ```
   API runs at `http://localhost:5000`.

### Sample accounts (created by `npm run seed`)

| Role | Email | Password |
|---|---|---|
| Admin | admin@campus.edu | admin123 |
| Staff | ravi@campus.edu, sunita@campus.edu | staff123 |
| Student | tripti@campus.edu, aman@campus.edu | student123 |

### Postman

Import `postman/Campus-Service-API.postman_collection.json`. Run **Login (Admin)** and **Login (Student)** first: they save the tokens automatically, and **Create Request** saves the new request's id.

---

## Project structure

```
server.js                    App setup, routes, error handler
config/db.js                 MongoDB connection
models/User.js               User schema (password hashed with bcrypt)
models/ServiceRequest.js     Request schema (ObjectId refs to User)
middleware/auth.js           protect (JWT check) + allowRoles (role check)
middleware/errorHandler.js   Turns errors into clear JSON (400/401/403/404/409)
controllers/                 Logic for auth, requests and admin dashboard
routes/                      URL → middleware → controller mapping
utils/statusFlow.js          Allowed status transitions
seed.js                      Sample data
```

---

## Database design

**User**: `name`, `email` (unique), `password` (bcrypt hash, never returned), `role` (`student` / `admin` / `staff`), `department`, `createdAt`, `updatedAt`

**ServiceRequest**: `title`, `description`, `category`, `priority` (`Low`/`Medium`/`High`), `status`, `createdBy` → **ref User**, `assignedTo` → **ref User**, `adminResponse`, `createdAt`, `updatedAt`

`createdBy` and `assignedTo` store **ObjectIds**, and `.populate()` fills in the user's name and email in responses.

Categories: `Computer`, `Classroom Equipment`, `Internet`, `Hostel Maintenance`, `Electrical`, `Library`, `Other`

`staff` is an extra role for the people that admin assigns requests to. Public registration always creates a **student**, so nobody can register as admin. Admin and staff accounts come from the seed script.

---

## Status workflow

```
Pending → Under Review → Assigned → In Progress → Resolved → Closed
   ↓            ↓
Rejected    Rejected
```

- Defined in `utils/statusFlow.js` as a map of allowed next statuses.
- Any other jump (e.g. **Pending → Closed**) returns **400** with the allowed next statuses.
- **Assigned** needs a staff member, so `PUT /:id/assign` sets `assignedTo` and moves the status to Assigned.
- `Closed` and `Rejected` are final.

---

## API endpoints

All routes except register/login need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register (always as student) |
| POST | `/api/auth/login` | Public | Login, receive JWT |
| POST | `/api/requests` | Student | Create request `{title, description, category}` |
| GET | `/api/requests` | Student / Admin | Student: own requests. Admin: all, with `?search=&status=&priority=&category=` |
| GET | `/api/requests/:id` | Owner / Admin | Get one request |
| PUT | `/api/requests/:id` | Owner | Update title/description/category, **only while Pending** |
| DELETE | `/api/requests/:id` | Owner / Admin | Owner only while Pending, admin any time |
| PUT | `/api/requests/:id/status` | Admin | `{status?, priority?, adminResponse?}` |
| PUT | `/api/requests/:id/assign` | Admin | `{staffId}`: request must be Under Review |
| GET | `/api/admin/dashboard` | Admin | Statistics |
| GET | `/api/admin/staff` | Admin | List staff (to get a `staffId`) |

### Error codes

| Code | When |
|---|---|
| 400 | Validation failed, invalid id, invalid status change, editing a non-Pending request |
| 401 | No token, invalid/expired token, wrong login |
| 403 | Wrong role (e.g. student calling admin route) or not the owner |
| 404 | Request / staff / route not found |
| 409 | Email already registered |

All errors look like: `{ "success": false, "message": "..." }`

---

## Dashboard (MongoDB aggregation)

`GET /api/admin/dashboard` runs **one** aggregation with `$facet`, which computes several groupings in a single database query:

```json
{
  "totalRequests": 6,
  "pending": 1,
  "inProgress": 1,
  "resolved": 1,
  "highPriority": 2,
  "byStatus":   { "Pending": 1, "Under Review": 1, ... },
  "byPriority": { "High": 2, "Medium": 2, "Low": 2 },
  "byCategory": { "Computer": 1, "Internet": 1, ... }
}
```

`byCategory` is the bonus statistic.

---

## How a request flows through the code

`PUT /api/requests/:id/status` with an admin token:

1. `routes/requestRoutes.js` → `protect` checks the JWT and loads the user into `req.user`.
2. `allowRoles("admin")` → returns 403 if the user is not admin.
3. `controllers/requestController.js → updateStatus` finds the request (404 if missing), checks `canMove(old, new)` from `statusFlow.js` (400 if not allowed), saves.
4. Any thrown error reaches `middleware/errorHandler.js`, which sends a clean JSON message.
