# RaktMitra Backend (MERN)

Express + MongoDB replacement for the original Spring Boot backend.

## Setup

```bash
npm install
cp .env.example .env   # fill in your MONGO_URI and JWT_SECRET
npm run dev            # development (nodemon)
npm start              # production
```

Server runs on `http://localhost:8080`

---

## API Reference

### Auth  `/api/auth`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login, returns JWT |
| GET | `/me` | ✅ | Get own profile |
| PUT | `/update` | ✅ | Update profile |
| PUT | `/change-password` | ✅ | Change password |

### Donors  `/api/donors`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | No | Search donors by bloodGroup, city, state |
| GET | `/:id` | No | Get donor public profile |
| POST | `/donate/:id` | ✅ | Mark yourself as donated |
| GET | `/stats/bloodgroups` | No | Count donors per blood group |

### Blood Requests  `/api/requests`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | No | List requests (filter by bloodGroup, city, urgency) |
| GET | `/:id` | No | Get single request |
| POST | `/` | ✅ | Create blood request |
| PUT | `/:id` | ✅ | Update own request |
| DELETE | `/:id` | ✅ | Delete own request |
| GET | `/my/requests` | ✅ | Get your own requests |

### Blood Camps  `/api/camps`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | No | List camps (filter by city, upcoming=true) |
| GET | `/:id` | No | Get camp details with donors |
| POST | `/` | ✅ | Create a camp |
| POST | `/:id/register` | ✅ | Register as donor for camp |
| DELETE | `/:id/register` | ✅ | Unregister from camp |
| DELETE | `/:id` | ✅ | Delete own camp |

---

## Auth Header
All protected routes need:
```
Authorization: Bearer <your_jwt_token>
```

## Blood Groups
`A+  A-  B+  B-  AB+  AB-  O+  O-`
