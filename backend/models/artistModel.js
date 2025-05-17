import Artist from '../schemas/artistSchema.js';

export class ArtistModel {
  async findAll() {
    return await Artist.find();
  }

  async findById(id) {
    return await Artist.findById(id);
  }

  async create(artistData) {
    const artist = new Artist(artistData);
    return await artist.save();
  }

  async updateById(id, updateData) {
    return await Artist.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await Artist.findByIdAndDelete(id);
} }