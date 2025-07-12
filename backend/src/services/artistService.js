import { ArtistModel } from '../models/artistModel.js';
import Artist from '../models/artistModel.js';

export class ArtistService {
  constructor() {
    this.artistModel = new ArtistModel();
  }

  async getAllArtists() {
    return await this.artistModel.findAll();
  }

  async getArtistById(id) {
    return await this.artistModel.findById(id);
  }

  async createArtist(artistData) {
    return await this.artistModel.create(artistData);
  }

  async updateArtist(id, updateData) {
    return await this.artistModel.updateById(id, updateData);
  }

  async deleteArtist(id) {
    return await this.artistModel.deleteById(id);
  }

  async addAlbumToArtist(artistId, albumId) {
    return await Artist.findByIdAndUpdate(artistId, {
      $addToSet: { albums: albumId }
}); } }