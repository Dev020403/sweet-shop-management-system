A full-stack web application for managing a sweet shop's inventory, built with Spring Boot and React following Test-Driven Development principles.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)
- [Project Structure](#project-structure)
- [License](#license)

## Overview

This Sweet Shop Management System provides a complete solution for managing sweet shop operations including inventory tracking, user authentication, and sales processing. The application consists of a Spring Boot REST API backend with a React frontend, developed using test-driven development practices.

## Features

### 🔐 Authentication
- User registration and login functionality
- JWT token-based authentication
- Role-based access control (Admin/Customer)

### 🍬 Sweet Management
- Add, view, update, and delete sweets
- Search and filter sweets by name, category, or price range
- Real-time inventory tracking

### 📦 Inventory Management
- Purchase sweets with automatic quantity reduction
- Restock functionality for admin users
- Out-of-stock handling and validation

### 👤 User Roles
- **Customer**: Browse, search, and purchase sweets
- **Admin**: Full CRUD operations on sweets and inventory management

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: PostgreSQL
- **Authentication**: Spring Security with JWT
- **Testing**: JUnit 5, Mockito, TestContainers
- **Build Tool**: Maven
- **Documentation**: Swagger/OpenAPI 3

### Frontend
- **Framework**: React 18
- **Language**: JavaScript (ES6+)
- **State Management**: Context API with useReducer
- **Styling**: CSS Modules with Bootstrap 5
- **HTTP Client**: Axios
- **Testing**: React Testing Library, Jest
- **Build Tool**: Create React App

### Database & Tools
- **Database**: PostgreSQL 14+
- **Version Control**: Git
- **Package Manager**: npm (frontend), Maven (backend)

## Prerequisites

Make sure you have the following installed:

- Java 17 or higher
- Node.js (v16 or higher)
- npm
- PostgreSQL (v12 or higher)
- Maven 3.6+
- Git

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sweet-shop-management-system.git
cd sweet-shop-management-system
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb sweetshop

# Or using psql
psql -U postgres
CREATE DATABASE sweetshop;
\q
```

### 3. Backend Setup (Spring Boot)

```bash
# Navigate to backend directory
cd backend

# Configure application properties
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit the file with your database credentials

# Build and run the application
./mvnw clean install
./mvnw spring-boot:run

# Or using installed Maven
mvn clean install
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

### 4. Frontend Setup (React)

```bash
# Navigate to frontend directory (open new terminal)
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env file with backend URL

# Start development server
npm start
```

The frontend will start on `http://localhost:3000`

### 5. Configuration Files

#### Backend (application.yaml)
```properties
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/sweetshop
    username: postgres
    password: admin123
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

```

#### Frontend (.env)
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_NAME=Sweet Shop Management
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/signin` | Login user | No |

### Sweet Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/sweets` | Get all sweets | Yes |
| POST | `/api/sweets` | Add new sweet | Yes (Admin) |
| GET | `/api/sweets/search` | Search sweets | Yes |
| PUT | `/api/sweets/{id}` | Update sweet | Yes (Admin) |
| DELETE | `/api/sweets/{id}` | Delete sweet | Yes (Admin) |
| POST | `/api/sweets/{id}/purchase` | Purchase sweet | Yes |
| POST | `/api/sweets/{id}/restock` | Restock sweet | Yes (Admin) |

### Request/Response Examples

#### User Registration
```json
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

#### Add Sweet (Admin Only)
```json
POST /api/sweets
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Chocolate Truffle",
  "category": "Chocolate",
  "price": 2.50,
  "quantity": 100
}
```

#### Purchase Sweet
```json
POST /api/sweets/1/purchase
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "quantity": 2
}
```

## Testing

### Backend Testing

```bash
cd backend

# Run all tests
./mvnw test
```

### Test Structure

The project includes:
- **Unit Tests**: Testing individual components and services
- **Integration Tests**: Testing API endpoints and database interactions
- **Frontend Tests**: Component rendering and user interaction tests

## Screenshots

## Screenshots

### Homepage - Sweet Collection
*Browse our delicious sweet collection with search and filter options*  
![Homepage](https://github.com/user-attachments/assets/0b91b289-ebfc-4a97-82d2-3a779d9e66fc)

### User Authentication
*Secure login with JWT authentication*  
![Login Page](https://github.com/user-attachments/assets/8b64d386-634b-4568-86bd-e6c8c5ce00eb)

### Admin Dashboard
*Complete inventory management for administrators*  
![Admin Dashboard](https://github.com/user-attachments/assets/3d077a96-8bb3-4c52-8d5b-4fac4a07df7e)

### Sweet Purchase Interface
*Easy-to-use purchase interface for customers*  
![Purchase Interface](https://github.com/user-attachments/assets/e4ee1739-bff4-4cb1-b1c5-984c44d81786)

### Restock Interface
*Easy-to-use restock interface for administrators*  
![Restock Interface](https://github.com/user-attachments/assets/8bc1e657-122f-40e4-8f66-1e7c439c69d7)


## My AI Usage

Throughout the development of this project, I leveraged AI tools to enhance productivity and code quality while maintaining full understanding and control over the implementation.

### Tools Used

**Claude (Anthropic)**
I used Claude primarily for architectural planning and code structure guidance. When starting the project, I discussed the overall system design and got suggestions for organizing the Spring Boot application structure. Claude helped me think through the database schema design and recommended best practices for implementing JWT authentication with Spring Security.

**ChatGPT**
I utilized ChatGPT for specific coding challenges and debugging assistance. When I encountered issues with CORS configuration between React and Spring Boot, ChatGPT helped me identify the correct Spring Security configuration. I also used it to generate initial test case structures, which I then customized for my specific business logic requirements.

### How AI Enhanced My Development Process

**Project Structure and Setup**
AI tools helped me quickly establish the proper project structure for both Spring Boot and React applications. Rather than spending time researching directory organization, I got immediate suggestions that I could evaluate and implement.

**Problem Solving**
When I encountered specific technical challenges, particularly with Spring Security configuration and React state management, AI provided multiple solution approaches. This allowed me to compare different strategies and choose the most appropriate one for my use case.

**Code Quality Improvement**
I used AI to review my code patterns and suggest improvements for error handling, validation logic, and REST API design. The suggestions often included edge cases I hadn't initially considered.

**Testing Strategy**
AI assistance was valuable in understanding testing patterns for Spring Boot applications, particularly around MockMvc usage and integration testing setup.

### My Approach to AI Collaboration

I maintained a collaborative approach with AI tools rather than relying on them for direct code generation. I would typically:

1. Present my current implementation or challenge
2. Discuss different approaches with the AI
3. Ask for specific guidance on best practices
4. Implement the solution myself, incorporating the insights gained
5. Iterate and refine based on my understanding

This approach ensured that I fully understood every piece of code in the project while benefiting from AI's knowledge of best practices and common patterns.

### Impact on Learning and Development

Using AI tools enhanced my learning experience by exposing me to different coding patterns and architectural approaches I might not have discovered otherwise. The interactive nature of discussing problems with AI helped me think through challenges more systematically and consider edge cases earlier in the development process.

## Project Structure

```
sweet-shop-management-system/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/sweetshop/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── entity/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   ├── config/
│   │   │   │   └── dto/
│   │   │   └── resources/
│   │   │       |- application.yaml
│   │   │      
│   │   └── test/
│   ├── target/
│   ├── pom.xml
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   └── README.md
├── screenshots/
└── README.md
```

---

**Developed with Spring Boot & React**
