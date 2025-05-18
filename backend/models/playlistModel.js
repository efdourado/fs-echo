import Playlist from '../schemas/playlistSchema.js';

export class PlaylistModel {
  async findAll() {
    return await Playlist.find().populate('owner');
  }

  async findById(id) {
    return await Playlist.findById(id).populate('owner').populate('songs.song');
  }

  async create(playlistData) {
    const playlist = new Playlist(playlistData);
    return await playlist.save();
  }

  async updateById(id, updateData) {
    return await Playlist.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await Playlist.findByIdAndDelete(id);
  }

  async findByOwner(ownerId) {
    return await Playlist.find({ owner: ownerId });
  }

  async addSong(playlistId, songId) {
    return await Playlist.findByIdAndUpdate(
      playlistId,
      { $push: { songs: { song: songId } } },
      { new: true }
  ); }

  async removeSong(playlistId, songId) {
    return await Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { songs: { song: songId } } },
      { new: true }
); } }