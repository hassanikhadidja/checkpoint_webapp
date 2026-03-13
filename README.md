# Nexus Studio — Express Web App

A 3-page web application built with **Express.js**, featuring a custom working-hours middleware.

## Features
- ✅ 3 pages: Home, Our Services, Contact Us
- ✅ Shared navigation bar on every page
- ✅ Custom middleware restricts access to **Mon–Fri, 9:00–17:00**
- ✅ Polished "Closed" page shown outside working hours
- ✅ CSS-styled with a dark, editorial design system
- ✅ Scroll-triggered animations, responsive layout

## Project Structure
```
webapp/
├── server.js            ← Express server + working-hours middleware
├── package.json
├── public/
│   └── css/
│       └── style.css    ← Shared stylesheet
└── views/
    ├── index.html       ← Home page
    ├── services.html    ← Our Services
    └── contact.html     ← Contact Us
```

## Setup

```bash
# Install dependencies
npm install

# Start the server
npm start
# → http://localhost:3000
```

## Working Hours Middleware

Located in `server.js`, the `workingHoursMiddleware` function:

```js
function workingHoursMiddleware(req, res, next) {
  const now  = new Date();
  const day  = now.getDay();   // 0=Sun … 6=Sat
  const hour = now.getHours(); // 0–23

  const isWeekday     = day >= 1 && day <= 5;
  const isWorkingHour = hour >= 9 && hour < 17;

  if (isWeekday && isWorkingHour) return next();

  // Otherwise → 503 Closed page
  res.status(503).send(/* closed HTML */);
}

app.use(workingHoursMiddleware); // applied globally
```

## Routes

| Route       | Page          |
|-------------|---------------|
| `GET /`     | Home          |
| `GET /services` | Our Services |
| `GET /contact`  | Contact Us   |
