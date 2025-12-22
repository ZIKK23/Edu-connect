# EduConnect - Modern GraphQL Education Platform

🚀 **EduConnect** adalah platform manajemen pendidikan modern yang dibangun dengan **GraphQL**, **PostgreSQL**, **React**, dan **Docker**. Aplikasi ini menyediakan sistem CRUD lengkap untuk mengelola **Students**, **Courses**, dan **Enrollments** dengan ant armuka modern, responsif, dan user-friendly.

## ✨ Fitur Utama

### 🎓 Students Management

- CRUD lengkap untuk data mahasiswa dengan validasi
- Avatar dengan initial nama
- Grid layout responsif dengan hover effects
- Real-time data synchronization

### 📚 Courses Management

- Manajemen mata kuliah dengan credit tracking
- Informasi lecturer lengkap
- Visual icons untuk credits, lecturer, dan course ID
- Course enrollment statistics

### ✅ Enrollments Management

- Hubungkan mahasiswa dengan mata kuliah
- Grade management (A, B+, A-, dll) dengan color-coded badges
- Visual interface dengan student dan course information
- Edit grade functionality

### 📊 Dashboard

- Summary cards dengan real-time statistics
- Recent enrollments list
- Popular courses grid
- Average enrollments per student analytics

### � Modern UI/UX Features

- **Professional Icons**: Lucide React icons untuk konsistensi visual
- **Enhanced Modals**: High-contrast readable forms dengan better spacing
- **Modern Buttons**: Gradient styling dengan hover animations
- **Responsive Design**: Mobile-friendly di semua devices
- **Dark Theme Support**: Clean dark mode dengan green accents
- **Toast Notifications**: Real-time feedback untuk user actions
- **Smooth Animations**: Transitions dan micro-interactions

## 🏗️ Architecture

```
┌─────────────────┐      ┌───────────────────┐      ┌──────────────────┐
│   React UI      │─────▶│  Apollo GraphQL   │─────▶│  PostgreSQL      │
│  (Vite + React) │      │    Server         │      │  (2 Databases)   │
│   Port 5000     │◀─────│   Port 4000       │◀─────│  Ports 5432/5433 │
└─────────────────┘      └───────────────────┘      └──────────────────┘
       │                           │
       │                           │
  Lucide Icons              GraphQL Schema
   Tailwind CSS             Query Resolvers
```

### Tech Stack

**Frontend:**

- React 18 with Hooks
- Vite (Build tool)
- Apollo Client (GraphQL client)
- Lucide React (Modern icon library)
- Tailwind CSS v4
- React Hot Toast (Notifications)
- React Router (Navigation)

**Backend:**

- Node.js 18+
- Apollo Server
- Express.js
- GraphQL
- PostgreSQL Driver

**Database:**

- PostgreSQL 15 Alpine
- Separate databases for Students & Courses with enrollment relations

**DevOps:**

- Docker & Docker Compose
- Multi-stage builds
- Nginx (Production frontend server)

## 🚀 Quick Start with Docker

### Prerequisites

- Docker Desktop installed
- Ports 4000, 5000, 5432, 5433 available

### 1. Clone Repository

```bash
git clone https://github.com/Asricky/EduConnect-Project.git
cd EduConnect-Project
```

### 2. Launch All Services

```bash
docker-compose up -d --build
```

This will:

- Create 2 PostgreSQL databases (students & courses)
- Build and start GraphQL backend
- Build and start React frontend
- Initialize database schema automatically

### 3. Access Application

- **Frontend:** http://localhost:5000
- **GraphQL Playground:** http://localhost:4000/graphql
- **Database Students:** localhost:5432
- **Database Courses:** localhost:5433

### 4. Stop All Services

```bash
docker-compose down
```

### 5. Update After Code Changes

```bash
# Stop and rebuild specific service
docker-compose down frontend
docker-compose up -d --build frontend

# Or rebuild everything
docker-compose down
docker-compose up -d --build
```

## 🛠️ Development Setup (Without Docker)

### 1. Setup Databases

```bash
# Login to PostgreSQL
psql -U postgres

# Run initialization scripts
\i database/init-students.sql
\i database/init-courses.sql
```

### 2. Install Dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 3. Configure Environment

Create `.env` file in root:

```env
# Students Database
DB_HOST_STUDENTS=localhost
DB_PORT_STUDENTS=5432
DB_NAME_STUDENTS=educonnect_students_db

# Courses Database
DB_HOST_COURSES=localhost
DB_PORT_COURSES=5433
DB_NAME_COURSES=educonnect_courses_db

# Common Database Config
DB_USER=educonnect
DB_PASSWORD=educonnect123

# Backend
GRAPHQL_PORT=4000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 4. Start Development Servers

**Backend (Terminal 1):**

```bash
cd backend
npm run dev
# Server: http://localhost:4000
```

**Frontend (Terminal 2):**

```bash
cd frontend
npm run dev
# Server: http://localhost:5173
```

## 📡 GraphQL API

### Core Types

```graphql
type Student {
  id: ID!
  name: String!
  email: String!
  createdAt: String
}

type Course {
  id: ID!
  title: String!
  credits: Int!
  lecturer: String!
  createdAt: String
}

type Enrollment {
  id: ID!
  student: Student!
  course: Course!
  grade: String
  createdAt: String
}
```

### Example Queries

**Get All Students:**

```graphql
query {
  students {
    id
    name
    email
    createdAt
  }
}
```

**Get Student with Courses:**

```graphql
query {
  studentCourses(studentId: "1") {
    student {
      name
      email
    }
    courses {
      title
      credits
      grade
    }
  }
}
```

**Get Dashboard Stats:**

```graphql
query {
  dashboardStats {
    totalStudents
    totalCourses
    totalEnrollments
    averageEnrollmentsPerStudent
  }
}
```

### Example Mutations

**Create Student:**

```graphql
mutation {
  createStudent(input: { name: "John Doe", email: "john@example.com" }) {
    id
    name
    email
  }
}
```

**Create Enrollment with Grade:**

```graphql
mutation {
  createEnrollment(input: { studentId: "1", courseId: "2", grade: "A" }) {
    id
    student {
      name
    }
    course {
      title
    }
    grade
  }
}
```

**Update Student:**

```graphql
mutation {
  updateStudent(
    id: "1"
    input: { name: "Jane Doe", email: "jane@example.com" }
  ) {
    id
    name
    email
  }
}
```

## 📁 Project Structure

```
EduConnect-Project/
├── backend/                      # GraphQL Backend
│   ├── db/
│   │   └── index.js             # PostgreSQL connections (2 databases)
│   ├── graphql/
│   │   ├── schema.graphql       # Complete GraphQL schema
│   │   └── resolvers/
│   │       ├── index.js         # Resolver aggregator
│   │       ├── studentResolvers.js
│   │       ├── courseResolvers.js
│   │       └── enrollmentResolvers.js
│   ├── server.js                # Apollo Server setup
│   ├── package.json
│   └── Dockerfile               # Backend container
│
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnimatedBackground.jsx
│   │   │   ├── Modal.jsx        # Enhanced modal w/ X icon
│   │   │   ├── Navbar.jsx       # Nav with Lucide icons
│   │   │   └── ThemeToggle.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Students.jsx     # CRUD with icons
│   │   │   ├── Courses.jsx      # CRUD with icons
│   │   │   └── Enrollments.jsx  # CRUD with icons
│   │   ├── graphql/
│   │   │   ├── queries.js       # All queries
│   │   │   └── mutations.js     # All mutations
│   │   ├── styles/
│   │   │   └── index.css        # Global styles + components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile               # Multi-stage build + Nginx
│
├── database/
│   ├── init-students.sql        # Students DB schema & seeds
│   └── init-courses.sql         # Courses DB schema & seeds
│
├── docker-compose.yml           # Multi-container orchestration
└── README.md
```

## 🎨 UI/UX Improvements

### Recent Enhancements

1. **Lucide React Icons** (replaced all emojis)

   - Professional SVG icons throughout the app
   - Consistent icon sizing and colors
   - Better accessibility

2. **Enhanced Modal Readability**

   - Increased label font-weight (600)
   - Better form spacing (1.5rem between fields)
   - Improved input padding (0.875rem)
   - Enhanced focus states (4px shadow)
   - Modal buttons with border separator

3. **Modern Button Styling**

   - Primary: Green gradient with hover lift
   - Secondary: White/gray with border
   - Danger: Red gradient for delete actions
   - Consistent sizing and spacing

4. **Responsive Grid Layouts**
   - Students: Auto-fill grid with min 300px cards
   - Courses: Card-based layout with icons
   - Enrollments: List view with student/course info

## 🐳 Docker Services

### Service: postgres-students

- **Image:** postgres:15-alpine
- **Port:** 5432
- **Database:** educonnect_students_db
- **Tables:** students, enrollments
- **Auto-init:** Runs init-students.sql

### Service: postgres-courses

- **Image:** postgres:15-alpine
- **Port:** 5433
- **Database:** educonnect_courses_db
- **Tables:** courses
- **Auto-init:** Runs init-courses.sql

### Service: backend

- **Build:** ./backend/Dockerfile
- **Port:** 4000
- **Depends:** Both PostgreSQL (healthy status)
- **GraphQL:** /graphql endpoint
- **Health:** /health endpoint

### Service: frontend

- **Build:** Multi-stage (Node + Nginx)
- **Port:** 5000
- **Build time:** ~15-20 seconds
- **Size:** ~82MB (optimized Alpine)
- **Serves:** Production build via Nginx
- **Routing:** SPA support with try_files

## 🧪 Testing & Verification

### Test GraphQL API

**Using curl:**

```bash
# Health check
curl http://localhost:4000/health

# Get students
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ students { id name email } }"}'
```

**Using GraphQL Playground:**

1. Open http://localhost:4000/graphql
2. Use interactive UI to test queries/mutations
3. Explore schema documentation

### Test Frontend

1. Open http://localhost:5000
2. Navigate between pages using navbar
3. Test CRUD operations:
   - Create new student/course/enrollment
   - Edit existing records
   - Delete records (with confirmation)
4. Check modal readability
5. Verify icon rendering
6. Test form validation

## 📦 Production Deployment

### Build for Production

```bash
# Build all images
docker-compose build

# Test production build locally
docker-compose up
```

### Deploy to Cloud

**Railway:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**AWS ECS:**

1. Push images to ECR
2. Create ECS task definitions
3. Configure RDS PostgreSQL
4. Set up load balancer

**DigitalOcean:**

1. Use App Platform
2. Connect GitHub repo
3. Configure database
4. Deploy with auto-build

## 🔧 Environment Variables

| Variable           | Description         | Default                | Example    |
| ------------------ | ------------------- | ---------------------- | ---------- |
| `DB_HOST_STUDENTS` | Students DB host    | postgres-students      | localhost  |
| `DB_PORT_STUDENTS` | Students DB port    | 5432                   | 5432       |
| `DB_NAME_STUDENTS` | Students database   | educonnect_students_db | -          |
| `DB_HOST_COURSES`  | Courses DB host     | postgres-courses       | localhost  |
| `DB_PORT_COURSES`  | Courses DB port     | 5432                   | 5433       |
| `DB_NAME_COURSES`  | Courses database    | educonnect_courses_db  | -          |
| `DB_USER`          | Database user       | educonnect             | educonnect |
| `DB_PASSWORD`      | Database password   | educonnect123          | -          |
| `GRAPHQL_PORT`     | Backend server port | 4000                   | 4000       |
| `FRONTEND_URL`     | Frontend URL (CORS) | http://localhost:5000  | -          |
| `NODE_ENV`         | Environment         | development            | production |

## 🐛 Troubleshooting

### Container Issues

```bash
# View all containers
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs -f  # Follow mode

# Restart specific service
docker-compose restart backend

# Remove and rebuild
docker-compose down
docker-compose up -d --build
```

### Database Connection Problems

```bash
# Check database health
docker-compose logs postgres-students
docker-compose logs postgres-courses

# Connect to database directly
docker exec -it educonnect-postgres-students psql -U educonnect -d educonnect_students_db

# Reset databases
docker-compose down -v  # Remove volumes
docker-compose up -d
```

### Port Already in Use

```bash
# Find process using port
netstat -ano | findstr :5000
netstat -ano | findstr :4000

# Kill process or change ports in docker-compose.yml
```

### Frontend Build Errors

```bash
# Clear node_modules and rebuild
cd frontend
rm -rf node_modules package-lock.json
npm install
docker-compose up -d --build frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines

- Follow existing code structure
- Use Lucide React icons (not emojis)
- Maintain consistent styling with Tailwind
- Test all CRUD operations before PR
- Update README if adding new features

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Asricky (Zikri)**

- GitHub: [@Asricky](https://github.com/Asricky)
- Repository: [EduConnect-Project](https://github.com/Asricky/EduConnect-Project)

---

⭐ **Star this repo** if you find it helpful!

🐛 Found a bug? [Open an issue](https://github.com/Asricky/EduConnect-Project/issues)!

💡 Have suggestions? [Create a pull request](https://github.com/Asricky/EduConnect-Project/pulls)!

📧 Questions? Feel free to reach out!
