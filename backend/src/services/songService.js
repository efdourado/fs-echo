import { SongModel } from '../models/songModel.js';
import { ArtistModel } from '../models/artistModel.js';

export class SongService {
  constructor() {
    this.songModel = new SongModel();
    this.artistModel = new ArtistModel();
  }

  async getAllSongs() {
    return this.songModel.findAll();
  }

  async getSongById(id) {
    return this.songModel.findById(id);
  }

  async createSong(songData) {
    if (!songData.audioUrl || !songData.duration) {
      const err = new Error('Audio URL and duration are required.');
      err.statusCode = 400;
      throw err;
    }
    const song = await this.songModel.create(songData);
    if (song.artist) {
      await this.artistModel.updateTopSongs(song.artist);
    }
    return song;
  }
  
  async updateSong(id, updateData) {
    const originalSong = await this.songModel.findById(id);
    if (!originalSong) {
      const err = new Error('Song not found');
      err.statusCode = 404;
      throw err;
    }
    const oldArtistId = originalSong.artist?._id.toString();

    const updatedSong = await this.songModel.updateById(id, updateData);
    const newArtistId = updatedSong.artist?._id.toString();

    if (oldArtistId && oldArtistId !== newArtistId) {
      await this.artistModel.updateTopSongs(oldArtistId);
    }
    if (newArtistId) {
      await this.artistModel.updateTopSongs(newArtistId);
    }
      
    return updatedSong;
  }

  async incrementPlayCount(id) {
    const song = await this.songModel.incrementPlayCount(id);
    if (song && song.artist) {
      await this.artistModel.updateTopSongs(song.artist);
    }
    return song;
  }

  async deleteSong(id) {
    const song = await this.songModel.deleteById(id);
    if (!song) {
        const err = new Error('Song not found');
        err.statusCode = 404;
        throw err;
    }
    return song;
} }