# Event Platform Frontend

This is the frontend for the **Event Platform** — a small app where community members can browse, sign up for, and pay for events.  
It connects to the backend API (`Event Platform API`) and handles authentication with **Clerk**, payments through **Stripe**, and event display and **Shadcn/UI** for all components and UI.

---

## Overview

### What it does
- Shows a list of upcoming events from the API.  
- Lets members sign up or pay for events.  
- Uses **Clerk** for authentication (email, Google, etc.).  
- Uses **Stripe** for secure payments.  
- Connects with the backend at `VITE_API_URL`.

---

## Prerequisites

You’ll need:
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- The backend server running locally (`http://localhost:9000/api`)
- Accounts for:
  - [Clerk](https://clerk.com) (authentication)
  - [Stripe](https://stripe.com) (payments)

---

## Quick Start

1. **Clone the frontend project**

   ```bash
   git clone https://github.com/yourusername/event-platform-frontend.git
   cd event-platform-frontend
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file**

   Copy and paste this into a new file named `.env` in the project root:

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_
   VITE_API_URL=http://localhost:9000/api
   VITE_STRIPE_PUBLIC_KEY=pGP
   ```

   

4. **Run the development server**

   ```bash
   npm run dev
   ```

   You should see something like:

   ```
   VITE v5.x  ready in 500ms
   ➜  Local:   http://localhost:3000/
   ```

   Open that URL in your browser — the frontend should connect to the backend automatically.

---

## Folder Structure

```bash
src/
  ├── components/       # Reusable UI components
  ├── pages/            # Page views (Events, Checkout, Profile)
  ├── components/            # Custom React hooks
  ├── services/         # API calls (axios or fetch wrappers)
  ├── lib/         
  ├── App.jsx           # Main app router
  └── main.jsx          # App entry point
```

---

## Environment Variables

| Key                          | Description                                          |
| ---------------------------- | ---------------------------------------------------- |
| `VITE_CLERK_PUBLISHABLE_KEY` | Your Clerk frontend key (used for authentication UI) |
| `VITE_API_URL`               | Base URL of the backend API                          |
| `VITE_STRIPE_PUBLIC_KEY`     | Stripe publishable key for client-side payments      |

> These variables are injected at build time — restart the dev server after editing `.env`.

---

## Connecting to Backend

Make sure your backend is running before you start the frontend.
The default backend URL is `http://localhost:9000/api`, which matches the `.env` above.

If you deploy the backend (e.g. on Render), update your `.env`:

```env
VITE_API_URL=https://event-platform-api.onrender.com/api
```

---

## Building for Production

When you’re ready to deploy:

```bash
npm run build
```

This will output a production-ready build in the `dist/` folder.

Deploy that folder to any static hosting service (like Vercel, Netlify, or Cloudflare Pages).

---

## Troubleshooting

* **Blank screen or login not working** → Check your `.env` values and Clerk dashboard domain settings.
* **Payments failing** → Ensure Stripe public key matches the one used by your backend.
* **CORS errors** → Confirm your backend allows requests from your frontend URL (`FRONTEND_URL` in backend `.env`).

---

## Security Notes

* Never commit `.env` files to GitHub.
* Use test keys (`pk_test_...`, `sk_test_...`) while developing.
* Set live keys only when deploying to production.

---
