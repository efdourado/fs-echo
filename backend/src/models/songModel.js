import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  duration: { type: Number, required: true },
  audioUrl: { type: String },
  coverImage: { type: String, default: "" },
  releaseDate: { type: Date },
  isExplicit: { type: Boolean, default: false },
  genre: { type: [String], default: [] },
  plays: { type: Number, default: 0 },
  lyrics: { type: String, default: "" },
}, { timestamps: true });

const Song = mongoose.model("Song", songSchema);

export class SongModel {
  async findAll() {
    return await Song.find().populate('artist');
  }

  async findById(id) {
    return await Song.findById(id).populate('artist');
  }

  async incrementPlayCount(id) {
    return await Song.findByIdAndUpdate(id, { $inc: { plays: 1 } }, { new: true });
} }

export default Song;