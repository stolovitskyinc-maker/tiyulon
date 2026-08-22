require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const trailsRoutes = require('./routes/trails');
const chatRoutes = require('./routes/chat');
const favoritesRoutes = require('./routes/favorites');
const recommendRoutes = require('./routes/recommend');
const contactRoutes = require('./routes/contact');
const completedRoutes = require('./routes/completed');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/trails', trailsRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/trails', chatRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/completed', completedRoutes);

console.log('>>> All routes registered, including /api/completed');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));