import express from 'express';

import { ArtistController } from '../controllers/artistController.js';
import { SongController } from '../controllers/songController.js';
import { UserController } from '../controllers/userController.js';
import { AlbumController } from '../controllers/albumController.js';
import { PlaylistController } from '../controllers/playlistController.js';

import { ArtistModel } from '../models/artistModel.js';
import { SongModel } from '../models/songModel.js';
import { UserModel } from '../models/userModel.js';
import { AlbumModel } from '../models/albumModel.js';
import { PlaylistModel } from '../models/playlistModel.js';
import { connectToDatabase } from '../config/db.js';

import { createAuthRouter } from './authRoutes.js';

const router = express.Router();

await connectToDatabase();

const artistController = new ArtistController(new ArtistModel());
const songController = new SongController(new SongModel());
const userController = new UserController(new UserModel());
const albumController = new AlbumController(new AlbumModel());
const playlistController = new PlaylistController(new PlaylistModel());

const authRouter = createAuthRouter(userController);

router.use('/auth', authRouter);

router.get('/', (req, res) => {
  res.json({
    endpoints: [
      '/auth/register',
      '/auth/login',
      '/auth/me',
      '/artists',
      '/artist/:id',
      '/songs',
      '/song/:id',
      '/users',
      '/user/:id',
      '/albums',
      '/album/:id',
      '/playlists',
      '/playlist/:id'
] }); });

router.get('/artists', artistController.getAllArtists.bind(artistController));
router.get('/artist/:id', artistController.getArtistById.bind(artistController));

router.get('/songs', songController.getAllSongs.bind(songController));
router.get('/song/:id', songController.getSongById.bind(songController));

router.get('/users', userController.getAllUsers.bind(userController));
router.get('/user/:id', userController.getUserById.bind(userController));
router.put('/user/:id', userController.updateUser.bind(userController));
router.delete('/user/:id', userController.deleteUser.bind(userController));

router.get('/albums', albumController.getAllAlbums.bind(albumController));
router.get('/album/:id', albumController.getAlbumById.bind(albumController));
router.post('/albums', albumController.createAlbum.bind(albumController));
router.put('/album/:id', albumController.updateAlbum.bind(albumController));
router.delete('/album/:id', albumController.deleteAlbum.bind(albumController));
router.get('/artist/:artistId/albums', albumController.getAlbumsByArtist.bind(albumController));

router.get('/playlists', playlistController.getAllPlaylists.bind(playlistController));
router.get('/playlist/:id', playlistController.getPlaylistById.bind(playlistController));
router.post('/playlists', playlistController.createPlaylist.bind(playlistController));
router.put('/playlist/:id', playlistController.updatePlaylist.bind(playlistController));
router.delete('/playlist/:id', playlistController.deletePlaylist.bind(playlistController));
router.post('/playlist/:id/song/:songId', playlistController.addSongToPlaylist.bind(playlistController));
router.delete('/playlist/:id/song/:songId', playlistController.removeSongFromPlaylist.bind(playlistController));
router.get('/user/:ownerId/playlists', playlistController.getPlaylistsByOwner.bind(playlistController));

export default router;