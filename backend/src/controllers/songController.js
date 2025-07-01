import { ArtistModel } from '../models/artistModel.js';

export class SongController {
  constructor(songModel) {
    this.model = songModel;
    this.artistModel = new ArtistModel();
  }

  async getAllSongs(req, res) {
    try {
      const songs = await this.model.findAll();
      res.json(songs);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async incrementPlay(req, res) {
    const { id } = req.params;
    try {
      const song = await this.model.incrementPlayCount(id);
      if (!song) {
        return res.status(404).json({ error: 'song not found' });
      }

      if (song.artist) {
        await this.artistModel.updateTopSongs(song.artist);
      }

      res.status(200).json({ message: 'Play count updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
  } }
  
  async getSongById(req, res) {
    const { id } = req.params;
    try {
      const song = await this.model.findById(id);
      if (!song) {
        return res.status(404).json({ error: 'song not found' });
      }
      res.json(song);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }
   
  async createSong(req, res) {
    try {
      const songData = { ...req.body };
      
      if (!songData.audioUrl || !songData.duration) {
          return res.status(400).json({ error: 'Audio URL and duration are required.' });
      }

      const song = await this.model.create(songData);
      
      if (song.artist) {
        await this.artistModel.updateTopSongs(song.artist);
      }

      res.status(201).json(song);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
  } }

  async updateSong(req, res) {
    const { id } = req.params;
    try {
      const updateData = { ...req.body };
      
      const originalSong = await this.model.findById(id);
      if (!originalSong) {
        return res.status(404).json({ error: 'Song not found' });
      }
      const oldArtistId = originalSong.artist?._id.toString();

      const updatedSong = await this.model.updateById(id, updateData);
      const newArtistId = updatedSong.artist?._id.toString();

      if (oldArtistId && oldArtistId !== newArtistId) {
        await this.artistModel.updateTopSongs(oldArtistId);
      }
      if (newArtistId) {
        await this.artistModel.updateTopSongs(newArtistId);
      }

      res.json(updatedSong);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
  } }

  async deleteSong(req, res) {
    const { id } = req.params;
    try {
      const song = await this.model.deleteById(id);
      if (!song) {
        return res.status(404).json({ error: 'Song not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
} } }