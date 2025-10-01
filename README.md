# CareerGO: AI-Powered Career Intelligence Platform

## Project Overview
CareerGO is a modern, full-stack application designed to provide highly personalized career recommendations. It utilizes advanced Large Language Models (LLMs) via an external API to analyze a user's skills, interests, and goals, generating a detailed career roadmap and actionable insights.

The project is built on a decoupled, API-driven architecture, separating the frontend presentation from the backend logic for enhanced scalability and performance.

---

## Key Features
- **Advanced AI Integration**: Utilizes the Perplexity AI (sonar-pro) LLM for complex reasoning and generating detailed, professional-grade career reports.
- **Efficient Single-Call Architecture**: Optimizes cost and performance by generating the recommendation once and storing the result on the client to serve both the UI display and the PDF download, avoiding redundant LLM calls.
- **Reactive Backend**: The API uses Spring WebFlux (Mono) to handle slow LLM calls in a non-blocking manner, significantly increasing the application's stability and responsiveness.
- **Dynamic Document Generation**: Features on-demand, server-side PDF report generation using the iText library.
- **Modern User Interface**: Built with React and styled using Tailwind CSS for a clean, animated, and responsive user experience.

---

## Technical Stack

| Category       | Technologies |
|-----------------|--------------|
| Backend/API     | Java 21+, Spring Boot, Spring WebFlux (Reactive), REST APIs, Maven |
| AI/LLM          | Perplexity AI API (sonar-pro), CommonMark (Markdown Processing) |
| Frontend/UI     | React (TSX), Vite, Framer Motion, Tailwind CSS |
| Database (Phase 2 Ready) | MySQL, Spring Data JPA (Ready for user authentication and data persistence) |

---

## Local Setup and Run Guide

Follow these steps to get both the backend and frontend running simultaneously.

### Prerequisites
- **Java Development Kit (JDK) 21+**
- **Node.js** (v20+ or v22+)
- **Maven**
- **Perplexity AI API Key** (Required for the backend to function)

---

### 1. Configure the Backend (Spring Boot)
Navigate to the Backend directory:
```
cd Spring
```
Edit API Key:
Open `src/main/resources/application.properties` and replace the placeholder with your actual Perplexity API key:
```
perplexity.api.key=YOUR_PERPLEXITY_API_KEY_HERE
```
Start the Backend API:
```
mvn spring-boot:run
```

The API will start on:
```
http://localhost:8080
```
---

### 2. Start the Frontend (React/Vite)

Open a new terminal window and navigate to the frontend directory:
```
cd frontend
```
Install Dependencies (run only once):
```
npm install
```

Start the Development Server:
```
npm run dev
```

The frontend UI will start on:
```
http://localhost:5173
```
---
### Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```
---
