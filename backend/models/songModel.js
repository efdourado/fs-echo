import Song from '../schemas/songSchema.js';

export class SongModel {
  async findAll() {
    return await Song.find().populate('artist');
}
  async findById(id) {
    return await Song.findById(id).populate('artist');
} }