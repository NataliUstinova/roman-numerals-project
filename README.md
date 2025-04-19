# Roman Numerals Converter

A full-stack application that converts between Roman numerals and Arabic numbers, with caching capabilities to improve performance.

## Features

- Convert Arabic numbers to Roman numerals
- Convert Roman numerals to Arabic numbers
- Caching of previous conversions for faster response
- History of all conversions
- Ability to clear conversion history

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Testing**: Jest with Supertest

## API Endpoints

- `GET /roman/:inputValue` - Convert Arabic number to Roman numeral
- `GET /arabic/:inputValue` - Convert Roman numeral to Arabic number
- `GET /all` - Get all previous conversions
- `DELETE /remove` - Clear all conversion history

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/NataliUstinova/roman-numerals-project.git
   cd roman-numerals-project
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create a .env file in the backend directory with the following variables:
   ```bash
   touch .env && echo -e "PORT=8080\nMONGODB_URI=mongodb://localhost:27017/roman-numerals-db" > .env
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

4. The application should now be running at http://localhost:3000

### Testing

#### Backend Tests

Run the backend tests with:
```bash
cd backend
npm test
```
