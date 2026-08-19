# 🩸 RaktMitra — वो दोस्ती जो ज़िंदगी बचाए

A full-stack blood donation management platform connecting donors, patients, and blood banks across India.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Styling | Bootstrap 5 |

---

## ✨ Features

- 🔐 User Registration & Login (JWT Auth)
- 💉 Donor Registration & Search (by blood group, city, state)
- 🤕 Patient Registration & Blood Request
- 🏥 Blood Bank Directory
- ⛺ Blood Camp Listings
- 👨‍💼 Admin Panel — manage donors, patients, blood banks
- 📱 WhatsApp Contact Integration
- 🌱 MongoDB Seed Script with dummy data

---

## 📁 Project Structure

```
raktmitra/
├── raktmitra-frontend/     # React + Vite frontend
└── raktmitra mongo/        # Node.js + Express backend
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/raktmitra.git
cd raktmitra
```

### 2. Backend Setup
```bash
cd "raktmitra mongo"
npm install
```

Create a `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/raktmitra
JWT_SECRET=your_secret_key_here
PORT=8080
```

Seed the database with dummy data:
```bash
npm run seed
```

Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd raktmitra-frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`  
Backend runs at: `http://localhost:8080`

---

## 🌱 Dummy Data (after seeding)

| Collection | Records |
|------------|---------|
| Users | 10 |
| Donors | 8 |
| Patients | 8 |
| Blood Banks | 10 |
| Blood Camps | 3 |
| Blood Requests | 5 |

**Login credentials for all seeded users:** `Test@1234`

Sample logins:
- `aarav@example.com` / `Test@1234`
- `priya@example.com` / `Test@1234`
- `rahul@example.com` / `Test@1234`

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/signin` | Login user |
| GET | `/user/details` | Get logged-in user (protected) |

### Donors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/donor` | List all donors |
| GET | `/user/donor/:id` | Get donor by ID |
| POST | `/user/register` | Register as donor (protected) |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/patients` | List all patients |
| GET | `/user/patient/:id` | Get patient by ID |
| POST | `/user/patient/register` | Register as patient (protected) |

### Blood Banks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/banks` | List all blood banks |
| POST | `/admin/add` | Add blood bank (admin) |
| DELETE | `/admin/delete/:id` | Delete blood bank (admin) |

---

## 👥 Team

Built with ❤️ for saving lives.

---

## 📄 License

MIT License
