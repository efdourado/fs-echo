// backend/src/models/artistModel.js
import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: "" },
  banner: { type: String, default: "" },
  description: { type: String, required: true },
  monthlyListeners: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  genre: { type: [String], required: true },
  socials: {
    instagram: { type: String, default: "" },
    x: { type: String, default: "" },
    youtube: { type: String, default: "" },
    tiktok: { type: String, default: "" },
  },
  verified: { type: Boolean, default: false },
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
  topSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
}, { timestamps: true } );

const Artist = mongoose.model("Artist", artistSchema);

export class ArtistModel {
  async findAll() {
    // Both populate calls are now here to ensure consistency
    return await Artist.find().populate('albums').populate('topSongs');
  }

  async findById(id) {
    // This is the key change: We are now populating the nested data
    return await Artist.findById(id)
      .populate({
        path: 'topSongs',
        populate: {
          path: 'artist',
          model: 'Artist'
        }
      })
      .populate({
        path: 'albums',
        populate: [
          {
            path: 'artist',
            model: 'Artist'
          },
          {
            path: 'songs',
            populate: {
              path: 'artist',
              model: 'Artist'
            }
          }
        ]
      });
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

export default Artist;