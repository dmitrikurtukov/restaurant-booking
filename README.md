# Smart Restaurant Booking System

This repository contains my CGI summer practice assignment solution (single repo for backend + frontend).

## Overview

The application helps a restaurant guest:

- view restaurant layout,
- filter availability by date/time, party size, and zone,
- get table recommendations based on fit and preferences,
- create reservations via API.

Recommendation logic considers:

- table capacity fit (avoid wasting large tables for small groups),
- table features (`QUIET`, `WINDOW`, `NEAR_KIDS`, `ACCESSIBLE`),
- occupancy mode: `random | real | mixed` (for testing purposes).

---

## Tech Stack

### Backend

- **Java 25**
- **Spring Boot 4.0.3**
- **Spring Data JPA** (PostgreSQL)
- **Liquibase**
- **Lombok**
- **JUnit 5 + Mockito**

### Frontend

- **React 19 + TypeScript**
- **Vite**
- **Mantine UI**
- **Tanstack Query**
- **Axios**
- **Lucide React** (icons)
- **React Toastify** (reservation feedback)

### Infrastructure

- **Docker Compose** (PostgreSQL)

---

## Repository Structure

```text
.
├── backend/                # Spring Boot backend
├── frontend/               # React frontend
└── docker-compose.yml      # PostgreSQL container
```

---

## How to Run

Make sure you have **Java 25**, **Docker Desktop**, and **Node.js** installed.

### 1. Start database

```sh
docker compose up -d
```

### 2. Run backend

You can run the backend in two ways (with a PostgreSQL container running):

1. Run the `RestaurantBookingBackendApplication` class from your IDE  
   (`backend/src/main/java/ee/cgi/restaurant/RestaurantBookingBackendApplication.java`)

2. Or run with Gradle:

```sh
cd backend
./gradlew bootRun
```

Backend URL:  
`http://localhost:8080`

### 3. Run frontend

```sh
cd frontend
npm install
npm run dev
```

Frontend URL (default Vite):  
`http://localhost:5173`

---

## Backend API

Main endpoints:

- `GET /api/layout`
- `GET /api/availability`
- `POST /api/reservations`

Example:

```sh
curl "http://localhost:8080/api/availability?start=2026-02-28T19:00:00&partySize=2&preferences=QUIET,WINDOW&durationMinutes=120"
```

---

## Configuration

Main config file:  
`backend/src/main/resources/application.yaml`

Availability mode:

```yaml
app:
  availability:
    mode: mixed # random | real | mixed
```

Validation rules:

- default reservation duration: `120` minutes
- allowed duration: `1..300` minutes
- API error handling: `400`, `404`, `409`

---

## Assignment Progress

### Core

- [x] Availability filtering (date/time, party size, zone)
- [x] Table recommendation logic
- [x] Reservation creation with overlap validation
- [x] Visual layout API support (`/api/layout`)
- [x] Liquibase migrations and seed data
- [x] Unit tests for core backend logic

### Bonus (current status)

- [ ] Dynamic table merge
- [ ] Average visit time improvements (2–3h modeling)
- [ ] Admin layout editor
- [x] External food/recipe API integration
- [ ] Production-ready Docker setup for full stack

---

## Development Process

### Time Spent

- **Backend:** ~28h
- **Frontend:** ~18h

### Challenges and Solutions

- **Liquibase checksum mismatch / migration startup failure:**  
  At one point, the backend could not start because Liquibase checksums no longer matched existing records in
  `DATABASECHANGELOG`.  
  I fixed it by resetting checksums and re-running migrations:
  `UPDATE DATABASECHANGELOG SET MD5SUM = NULL;`
  Then I verified that migrations were applied correctly.

- **Recommendation scoring formula design:**  
  A challenge was to keep the scoring logic both short and meaningful, balancing table fit (capacity efficiency) and
  user preferences.  
  I asked ChatGPT for suggestion how can I implement a compact weighted formula where `fitScore` rewards minimal seat
  waste, while `preferenceScore` adds bonuses for matching features and penalties for missing requested preferences.

- **Deterministic occupancy generation for demo availability:**  
  I knew how to randomly mark any % of tables as occupied, but initially I did not know how to make the result stable
  for the same time range.  
  I implemented deterministic randomization by seeding the random generator from the requested interval (`start`,
  `end`), so repeated requests for the same interval return the same occupied set.  
  I used ChatGPT for assistance to finalize this approach and then adapted it to my service logic.

- **Interactive SVG floor plan (frontend):**  
  The most difficult frontend part was building a readable SVG table map with zones, labels, recommendation
  highlighting, and table selection that still looks clean on different screen sizes.  
  I used ChatGPT assistance to iterate on the layout/model split and rendering approach, then adapted and refactored the
  code to match my project architecture.