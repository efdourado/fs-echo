import { AlbumService } from '../services/albumService.js';
import { ArtistService } from '../services/artistService.js';

export class AlbumController {
  constructor() {
    this.albumService = new AlbumService();
    this.artistService = new ArtistService();
  }

  async getAllAlbums(req, res) {
    try {
      const albums = await this.albumService.getAllAlbums();
      res.json(albums);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getAlbumById(req, res) {
    const { id } = req.params;
    try {
      const album = await this.albumService.getAlbumById(id);
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.json(album);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async createAlbum(req, res) {
    try {
      const album = await this.albumService.createAlbum(req.body);
      if (album.artist) {
        await this.artistService.addAlbumToArtist(album.artist, album._id);
      }
      res.status(201).json(album);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async updateAlbum(req, res) {
    const { id } = req.params;
    try {
      const originalAlbum = await this.albumService.getAlbumById(id);
      const updatedAlbum = await this.albumService.updateAlbum(id, req.body);
      if (!updatedAlbum) {
        return res.status(404).json({ error: 'Album not found' });
      }

      const originalArtistId = originalAlbum.artist.toString();
      const newArtistId = updatedAlbum.artist.toString();

      if (originalArtistId !== newArtistId) {
        await this.artistService.updateArtist(originalArtistId, {
          $pull: { albums: updatedAlbum._id }
        });
        await this.artistService.addAlbumToArtist(newArtistId, updatedAlbum._id);
      }

      res.json(updatedAlbum);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async deleteAlbum(req, res) {
    const { id } = req.params;
    try {
      const album = await this.albumService.deleteAlbum(id);
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getAlbumsByArtist(req, res) {
    const { artistId } = req.params;
    try {
      const albums = await this.albumService.getAlbumsByArtist(artistId);
      res.json(albums);
    } catch (error) {
      res.status(500).json({ error: error.message });
} } }