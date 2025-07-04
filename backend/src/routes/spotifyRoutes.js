import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getFeaturedPlaylists } from '../controllers/spotifyController.js';

console.log('✅ spotifyRoutes.js foi carregado');

const router = express.Router();

router.get('/featured-playlists', protect, getFeaturedPlaylists);

export default router;