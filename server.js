const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// ─── Working Hours Middleware ───────────────────────────────────────────────
function workingHoursMiddleware(req, res, next) {
  const now = new Date();
  const day = now.getDay();     // 0 = Sunday, 6 = Saturday
  const hour = now.getHours(); // 0–23

  const isWeekday = day >= 1 && day <= 5;
  const isWorkingHour = hour >= 9 && hour < 17;

  if (isWeekday && isWorkingHour) {
    return next();
  }

  // Outside working hours → send closed page
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[day];
  const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  res.status(503).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Closed – Nexus Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0a0a0f;
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .grid-bg {
      position: fixed; inset: 0;
      background-image: linear-gradient(rgba(255,80,0,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,80,0,0.05) 1px, transparent 1px);
      background-size: 60px 60px;
      animation: gridPulse 4s ease-in-out infinite;
    }
    @keyframes gridPulse { 0%,100%{opacity:.4} 50%{opacity:1} }
    .container {
      position: relative;
      text-align: center;
      padding: 3rem;
      border: 1px solid rgba(255,80,0,0.3);
      background: rgba(255,80,0,0.03);
      max-width: 560px;
      width: 90%;
    }
    .container::before {
      content: '';
      position: absolute;
      top: -1px; left: 20px; right: 20px; height: 2px;
      background: linear-gradient(90deg, transparent, #ff5000, transparent);
    }
    .icon { font-size: 3rem; margin-bottom: 1.5rem; opacity: 0.8; }
    h1 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(3rem, 10vw, 5.5rem);
      letter-spacing: 0.05em;
      line-height: 1;
      color: #ff5000;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      font-size: 1.1rem;
      color: rgba(255,255,255,0.5);
      margin-bottom: 2rem;
      font-weight: 300;
    }
    .info-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 1.25rem 1.5rem;
      margin-bottom: 1rem;
    }
    .info-label { font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: #ff5000; margin-bottom: 0.3rem; }
    .info-value { font-size: 1.1rem; font-weight: 500; }
    .hours-note {
      margin-top: 1.5rem;
      font-size: 0.85rem;
      color: rgba(255,255,255,0.35);
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="container">
    <div class="icon">⏱</div>
    <h1>We're Closed</h1>
    <p class="subtitle">This site is only available during working hours.</p>
    <div class="info-card">
      <div class="info-label">Current Time</div>
      <div class="info-value">${currentDay}, ${currentTime}</div>
    </div>
    <div class="info-card">
      <div class="info-label">Available</div>
      <div class="info-value">Mon – Fri &nbsp;·&nbsp; 9:00 AM – 5:00 PM</div>
    </div>
    <p class="hours-note">Come back during business hours to access our site.</p>
  </div>
</body>
</html>
  `);
}

// Apply middleware to ALL routes
app.use(workingHoursMiddleware);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// ─── Routes ────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/services', (req, res) => res.sendFile(path.join(__dirname, 'views', 'services.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'views', 'contact.html')));

// 404
app.use((req, res) => {
  res.status(404).send('<h1 style="font-family:sans-serif;text-align:center;margin-top:4rem">404 — Page not found</h1>');
});

app.listen(PORT, () => {
  console.log(`✅ Nexus Studio running at http://localhost:${PORT}`);
  console.log(`⏰ Access is restricted to Mon–Fri, 9:00–17:00`);
});
