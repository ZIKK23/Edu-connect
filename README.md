# EduConnect

A modern education management platform for managing students, courses, and enrollments with a beautiful, responsive interface.

![React](https://img.shields.io/badge/React-18-blue) ![GraphQL](https://img.shields.io/badge/GraphQL-API-e10098) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

---

## 🎯 About

EduConnect is a full-stack web application that provides a comprehensive solution for managing educational institutions. Track students, organize courses, manage enrollments, and monitor analytics through an intuitive dashboard.

### Features

- ✅ **Student Management** - Add, edit, and manage student records
- ✅ **Course Catalog** - Organize courses with credits and lecturer information
- ✅ **Enrollment System** - Link students to courses with grade tracking
- ✅ **Analytics Dashboard** - Real-time statistics and insights
- ✅ **Modern UI** - Responsive design with dark mode support

---

## �️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Apollo Client
- **Backend:** Node.js, Apollo Server, GraphQL, Express
- **Database:** PostgreSQL (dual database architecture)
- **DevOps:** Docker, Docker Compose, Nginx

---

## 🚀 Quick Start

### Prerequisites

- Docker Desktop installed
- Ports 4000, 5000, 5432, 5433 available

### Installation

1. Clone the repository

```bash
git clone https://github.com/ZIKK23/Edu-connect.git
cd Edu-connect
```

2. Start with Docker

```bash
docker-compose up -d --build
```

3. Access the application

- **Web App:** http://localhost:5000
- **GraphQL API:** http://localhost:4000/graphql

4. Stop the application

```bash
docker-compose down
```

---

## 💻 Development

### Running Locally (without Docker)

1. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

2. Setup PostgreSQL databases (run the SQL files in `/database`)

3. Create `.env` file in root

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=educonnect_db
DB_PORT=3306
```

4. Start development servers

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## 📖 Usage

### Web Interface

Navigate through the application using the sidebar:

- **Dashboard** - View statistics and recent activity
- **Students** - Manage student records
- **Courses** - Manage course catalog
- **Enrollments** - Create and manage student enrollments

### GraphQL API

Access the interactive GraphQL Playground at http://localhost:4000/graphql to:

- Explore the complete API schema
- Test queries and mutations
- View documentation

Example query:

```graphql
query {
  students {
    id
    name
    email
  }
}
```

---

## 📁 Project Structure

```
EduConnect-Project/
├── backend/          # GraphQL API server
├── frontend/         # React application
├── database/         # SQL initialization scripts
└── docker-compose.yml
```

---

## 🐛 Troubleshooting

**Port already in use:**

```bash
netstat -ano | findstr :5000
# Change ports in docker-compose.yml if needed
```

**Database connection issues:**

```bash
docker-compose logs postgres-students
docker-compose down -v && docker-compose up -d
```

**Rebuild containers:**

```bash
docker-compose down
docker-compose up -d --build
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Links

- **Repository:** [github.com/ZIKK23/Edu-connect](https://github.com/ZIKK23/Edu-connect)
- **Report Bugs:** [zikrihilmi15@gmail.com](mailto:zikrihilmi15@gmail.com)

---

<div align="center">

Made with ❤️ using React, GraphQL, and PostgreSQL

⭐ Star this repo if you find it useful!

</div>
