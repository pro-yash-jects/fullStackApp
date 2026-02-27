# TradeGate Frontend

A simple React trading application built with Vite, React, and Tailwind CSS.

## Features

- Stock search and real-time quotes
- User authentication (login/signup)
- Trading dashboard
- Watchlist management
- Dark/Light theme toggle
- Admin panel

## Tech Stack

- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- Recharts (for stock charts)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (see `.env.example`):
```
VITE_API_URL=/api
```

3. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173` and proxy API requests to `http://localhost:3000`.

## Building for Production

```bash
npm run build
```

This creates a production build in the `dist` folder.

## Deploying to Vercel

1. Push your code to GitHub

2. Import your repository in Vercel

3. Configure environment variables in Vercel dashboard:
   - `VITE_API_URL` = Your backend API URL (e.g., `https://your-backend.herokuapp.com/api`)

4. Deploy! Vercel will automatically:
   - Run `npm run build`
   - Deploy the `dist` folder
   - Handle client-side routing (configured in `vercel.json`)

## Environment Variables

- `VITE_API_URL`: Backend API base URL
  - Local: `/api` (uses Vite proxy)
  - Production: Full backend URL (e.g., `https://api.example.com/api`)

## Project Structure

```
src/
├── api/          # Axios configuration
├── components/   # Reusable components
├── context/      # React context (Auth, Theme)
├── pages/        # Page components
├── App.jsx       # Main app component
└── main.jsx      # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Notes

This is a student project focused on simplicity and learning. Not all features are production-grade.
