import Album from '../schemas/albumSchema.js';

export class AlbumModel {
  async findAll() {
    return await Album.find().populate('artist').populate('songs');
  }

  async findById(id) {
    return await Album.findById(id).populate('artist').populate('songs');
  }

  async create(albumData) {
    const album = new Album(albumData);
    return await album.save();
  }

  async updateById(id, updateData) {
    return await Album.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await Album.findByIdAndDelete(id);
  }

  async findByArtist(artistId) {
    return await Album.find({ artist: artistId });
} }