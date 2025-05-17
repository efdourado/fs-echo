import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  duration: { type: Number, required: true },
  audioUrl: { type: String},
  coverImage: { type: String, default: '' },
  releaseDate: { type: Date },
  isExplicit: { type: Boolean, default: false },
  genre: { type: [String], default: [] },

  plays: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },

  lyrics: { type: String, default: '' },
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);

export default Song;