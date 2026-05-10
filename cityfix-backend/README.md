# CityFix Backend API

Node.js + Express + MongoDB REST API for the **CityFix** civic issue reporting platform.

---

## 🏗️ Architecture

```
cityfix-backend/
├── src/
│   ├── app.js                  # Express entry point + Socket.IO
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── socket.js           # Socket.IO real-time setup
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── issue.controller.js
│   │   ├── user.controller.js
│   │   ├── staff.controller.js
│   │   ├── admin.controller.js
│   │   ├── notification.controller.js
│   │   └── stats.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT protect + role guard
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Issue.model.js
│   │   └── Notification.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── issue.routes.js
│   │   ├── user.routes.js
│   │   ├── staff.routes.js
│   │   ├── admin.routes.js
│   │   ├── notification.routes.js
│   │   ├── stats.routes.js
│   │   └── upload.routes.js
│   └── utils/
│       ├── jwt.js
│       ├── response.js
│       ├── notificationService.js
│       └── seed.js
└── uploads/                    # Uploaded images
```

---

## 🚀 Setup

### 1. Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### 2. Install dependencies
```bash
cd cityfix-backend
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your values:
#   MONGO_URI=mongodb://localhost:27017/cityfix
#   JWT_SECRET=your_secret
#   CLIENT_URL=http://localhost:5173
```

### 4. Seed the database (optional)
```bash
npm run seed
```
Creates: 1 admin, 3 staff, 8 citizens, 30 issues, notifications.

**Demo credentials:**
| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@cityfix.app        | password123 |
| Staff   | ravi@cityfix.app         | password123 |
| Citizen | citizen1@example.com     | password123 |

### 5. Run the server
```bash
npm run dev    # development (nodemon)
npm start      # production
```

Server starts on `http://localhost:5000`

---

## 📡 API Reference

### Auth — `/api/auth`
| Method | Endpoint              | Auth | Description           |
|--------|-----------------------|------|-----------------------|
| POST   | `/register`           | —    | Register new user     |
| POST   | `/login`              | —    | Login, get tokens     |
| POST   | `/refresh-token`      | —    | Refresh access token  |
| GET    | `/me`                 | ✅   | Get current user      |
| POST   | `/logout`             | ✅   | Logout                |
| PATCH  | `/change-password`    | ✅   | Change password       |

### Issues — `/api/issues`
| Method | Endpoint                    | Roles              | Description              |
|--------|-----------------------------|--------------------|--------------------------|
| GET    | `/`                         | All                | List issues (paginated)  |
| GET    | `/map`                      | All                | Issues for map view      |
| GET    | `/:id`                      | All                | Get single issue         |
| POST   | `/`                         | All                | Report new issue         |
| PATCH  | `/:id`                      | All                | Edit issue               |
| DELETE | `/:id`                      | All                | Delete issue             |
| PATCH  | `/:id/status`               | Staff, Admin       | Update status            |
| PATCH  | `/:id/assign`               | Admin              | Assign to staff          |
| POST   | `/:id/upvote`               | All                | Toggle upvote            |
| POST   | `/:id/comments`             | All                | Add comment              |
| PATCH  | `/:id/checklist`            | Staff, Admin       | Update checklist         |

### Users — `/api/users`
| Method | Endpoint        | Description         |
|--------|-----------------|---------------------|
| GET    | `/profile`      | Get own profile     |
| PATCH  | `/profile`      | Update profile      |
| GET    | `/my-issues`    | Citizen's issues    |
| GET    | `/my-stats`     | Citizen's stats     |

### Staff — `/api/staff`
| Method | Endpoint                 | Description              |
|--------|--------------------------|--------------------------|
| GET    | `/dashboard`             | Staff dashboard stats    |
| GET    | `/issues`                | My assigned issues       |
| GET    | `/resolved`              | My resolved issues       |
| GET    | `/zone-map`              | Issues on zone map       |
| PATCH  | `/issues/:id/status`     | Update issue status      |
| PATCH  | `/availability`          | Toggle availability      |

### Admin — `/api/admin`
| Method | Endpoint           | Description           |
|--------|--------------------|-----------------------|
| GET    | `/overview`        | Full dashboard stats  |
| GET    | `/performance`     | Daily trends          |
| GET    | `/users`           | List all users        |
| POST   | `/users`           | Create staff account  |
| PATCH  | `/users/:id`       | Update user           |
| DELETE | `/users/:id`       | Delete user           |

### Notifications — `/api/notifications`
| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| GET    | `/`               | Get my notifications  |
| PATCH  | `/read-all`       | Mark all read         |
| PATCH  | `/:id/read`       | Mark one read         |
| DELETE | `/:id`            | Delete notification   |

### Stats — `/api/stats`
| Method | Endpoint              | Description                   |
|--------|-----------------------|-------------------------------|
| GET    | `/overview`           | Issues by status/category     |
| GET    | `/resolution-time`    | Avg resolution time by type   |

### Upload — `/api/upload`
| Method | Endpoint | Description                     |
|--------|----------|---------------------------------|
| POST   | `/`      | Upload images (multipart/form)  |

---

## 🔌 Real-Time Events (Socket.IO)

Connect to `http://localhost:5000`.

**Emit (client → server):**
| Event         | Payload          | Description                 |
|---------------|------------------|-----------------------------|
| `join:role`   | `'admin'`        | Join admin/staff room       |
| `join:issue`  | `issueId`        | Track a specific issue      |
| `leave:issue` | `issueId`        | Stop tracking               |

**Listen (server → client):**
| Event                   | Description                      |
|-------------------------|----------------------------------|
| `notification:new`      | New notification for user        |
| `notification:admin`    | Broadcast to admin room          |
| `issue:new`             | New issue reported               |
| `issue:updated`         | Issue changed                    |
| `issue:statusChanged`   | Status updated on tracked issue  |
| `issue:assigned`        | Issue assigned to staff          |
| `issue:comment`         | New comment on tracked issue     |

---

## 🗃️ Issue Status Flow

```
pending → assigned → in_progress → resolved → closed
                                 ↘ rejected
```

---

## 🏷️ Issue Categories
`road` · `water` · `electricity` · `sanitation` · `street_light` · `park` · `drainage` · `building` · `noise` · `other`

## 🔥 Issue Priorities
`low` · `medium` · `high` · `critical`
