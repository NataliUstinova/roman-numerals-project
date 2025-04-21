# Roman Numerals Converter [![CI/CD Pipeline](https://github.com/NataliUstinova/roman-numerals-project/actions/workflows/ci.yml/badge.svg)](https://github.com/NataliUstinova/roman-numerals-project/actions/workflows/ci.yml)


A full-stack application that converts between Roman numerals and Arabic numbers, with caching capabilities.
![img.png](frontend/public/img.png)
## Features

- Convert Arabic numbers to Roman numerals
- Convert Roman numerals to Arabic numbers
- Caching of previous conversions for faster response
- History of all conversions
- Ability to clear conversion history

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Testing**: Jest with Supertest

## Running with Docker
1. Make sure you have Docker and Docker Compose installed.
  Build the Docker images:
  ```bash
  docker compose build
  ```
2. Start the containers:
  ```bash
  docker compose up -d
   ```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080


## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. The pipeline includes:

1. **Testing**:
   - Runs on every push and pull request to the main branch
   - Tests both backend and frontend projects
   - Automatically installs dependencies and runs tests

2. **Build**:
   - Builds Docker images for both backend and frontend
   - Pushes images to Docker Hub on successful main branch pushes
   - Uses Docker Buildx for efficient image building

3. **Deployment**:
   - Automatically deploys using Docker Compose on main branch pushes
   - Installs Docker Compose plugin
   - Starts containers in detached mode

View the pipeline status and details: 
[![CI/CD Pipeline](https://github.com/NataliUstinova/roman-numerals-project/actions/workflows/ci.yml/badge.svg)](https://github.com/NataliUstinova/roman-numerals-project/actions/workflows/ci.yml)

