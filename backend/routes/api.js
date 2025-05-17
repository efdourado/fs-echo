import express from 'express';
import { ArtistController } from '../controllers/artistController.js';
import { SongController } from '../controllers/songController.js';
import { ArtistModel } from '../models/artistModel.js';
import { SongModel } from '../models/songModel.js';
import { connectToDatabase } from '../config/db.js';

const router = express.Router();

await connectToDatabase();

const artistController = new ArtistController(new ArtistModel());
const songController = new SongController(new SongModel());

router.get('/', (req, res) => {
  res.json({ endpoints: ['/artists', '/artist/:id', '/songs', 'song/:id'] });
});

router.get('/artists', artistController.getAllArtists.bind(artistController));
router.get('/artist/:id', artistController.getArtistById.bind(artistController));
router.get('/songs', songController.getAllSongs.bind(songController));
router.get('/song/:id', songController.getSongById.bind(songController));

export default router;