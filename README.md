📌 Task Manager Frontend – Angular

This repository contains the Angular frontend application for the Task Manager project.
It is designed to work with an ASP.NET Core Web API backend and provides a full UI for managing tasks and user authentication.

⚠️ Note:
This project is also integrated into a separate ASP.NET Core repository where the Angular app is served as a production build.
This repo exists to showcase the full frontend source code.

🚀 Features

✅ User authentication (Login / Register)
🔐 JWT authentication with refresh token handling
👤 User-specific task management
📈 Productivity score tracking
🔍 Advanced filtering (status, category, priority)
✔️ Task completion toggle
⏰ Overdue task highlighting
🎯 Clean and responsive UI

🛠️ Tech Stack

Angular (Standalone Components)
TypeScript
HTML / CSS
Angular Forms (ngModel)
RxJS (Observables)

🧩 Project Structure

services/
tasks.service.ts → API communication for tasks
account.service.ts → Authentication & token handling
filter.service.ts → Filtering logic
statistics.service.ts → Task metrics
components/
Task Manager UI
Login / Register صفحات
Navigation Bar

🔐 Authentication Flow

User logs in → receives JWT + Refresh Token
JWT is stored in localStorage
HTTP requests include JWT in Authorization header
When token expires → refresh token is used to generate a new JWT

📡 API Integration

This frontend connects to the backend API:

👉 (link your ASP.NET repo here)

Main endpoints used:

/api/tasks
/api/account/login
/api/account
/api/account/generate-new-jwt-token

💡 Purpose

This project was built to demonstrate:

Angular application structure
State & UI management
Integration with a secure ASP.NET Core API
JWT authentication flow with refresh tokens
Clean and maintainable frontend architecture

📷 Future Improvements

UI/UX enhancements
Better error handling
Form validation improvements
Dark mode

🔗 Related Repository

👉 Backend (ASP.NET Core API):
https://github.com/00r3e/Angular_ASPNETCore_TaskManager
