import { ArtistService } from '../services/artistService.js';

export class ArtistController {
  constructor() {
    this.artistService = new ArtistService();
  }

  async getAllArtists(req, res) {
    try {
      const artists = await this.artistService.getAllArtists();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getArtistById(req, res) {
    const { id } = req.params;
    try {
      const artist = await this.artistService.getArtistById(id);
      if (!artist) {
        return res.status(404).json({ error: 'artist not found' });
      }
      res.json(artist);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async createArtist(req, res) {
    try {
      const artistData = { ...req.body };
      
      if (artistData.socials && typeof artistData.socials === 'string') {
        artistData.socials = JSON.parse(artistData.socials);
      }
      
      if (artistData.genre && typeof artistData.genre === 'string') {
        artistData.genre = artistData.genre.split(',').map(g => g.trim()).filter(g => g);
      }
      
      const artist = await this.artistService.createArtist(artistData);
      res.status(201).json(artist);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async updateArtist(req, res) {
    const { id } = req.params;
    try {
      const updateData = { ...req.body };

      if (updateData.socials && typeof updateData.socials === 'string') {
        updateData.socials = JSON.parse(updateData.socials);
      }
      
      if (updateData.genre && typeof updateData.genre === 'string') {
        updateData.genre = updateData.genre.split(',').map(g => g.trim()).filter(g => g);
      }

      const artist = await this.artistService.updateArtist(id, updateData);
      if (!artist) {
        return res.status(404).json({ error: 'Artist not found' });
      }
      res.json(artist);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async deleteArtist(req, res) {
    const { id } = req.params;
    try {
      const artist = await this.artistService.deleteArtist(id);
      if (!artist) {
        return res.status(404).json({ error: 'Artist not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
} } }