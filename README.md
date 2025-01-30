# Instashare

Welcome to the Instashare project repository! This project consists of a web application with a frontend developed in React and a backend built with Node.js and Express.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Testing](#testing)

---

## Project Description

This project is a web application that allows system users to share files on the Instashare platform with the community. The frontend is built with React for a dynamic and responsive user interface, while the backend uses Node.js and Express to handle server logic, RESTful APIs, and database connections. It employs Prisma ORM.

---

## Features

- **Frontend (React):**
  - Modern and responsive user interface.
  - Routing with React Router.
  - State management with Context API.
  - Consumption of RESTful APIs from the backend.

- **Backend (Node.js/Express):**
  - RESTful API to handle HTTP requests.
  - Connection to a MySQL database using Prisma ORM.
  - Authentication and authorization with JWT.
  - Data validation with express-validator.

---

## Technologies Used

### Frontend
- **React**: Library for building user interfaces.
- **React Router**: Routing in the application.
- **Axios**: HTTP client for consuming APIs.
- **Context API**: Global state management.

### Backend
- **Node.js**: Runtime environment for server-side JavaScript.
- **Express**: Framework for building RESTful APIs.
- **MySQL**: Database for storing information.
- **Prisma ORM**: ORM/ODM for interacting with the database.
- **JWT**: Authentication and authorization.
- **express-validator**: Data validation in requests.

### Development Tools
- **Git**:  Version control.
- **ESLint**: Linting to maintain clean code.
- **Prettier**: Code formatting.
- **Docker**: Application containerization.

---

## Installation

Follow these steps to set up the project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kalimuscle/instashare.git
   cd project-name
   ```

2. **Docker:**
   ```bash
   docker compose up
   ```

3. **Frontend:**
   ```bash
   cd /client
   npm install
   npm start
   ```

4. **Backend:**
   ```bash
   cd /server
   npm install
   npx prisma migrate dev
   npx prisma generate
   npm run dev
   ```

---

## Testing

### Frontend Testing Tools
- **Jest**: Unit testing.
- **Cypress**: E2E testing.

### Backend Testing Tools
- **Jest**: Unit testing and integration testing.
- **Supertest**: Request testing.