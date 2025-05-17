import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: '' },
  banner: { type: String, default: '' },
  description: { type: String, required: true },
  monthlyListeners: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  genre: { type: [String], required: true },
  socials: {
    instagram: { type: String, default: '' },
    x: { type: String, default: '' },
    youtube: { type: String, default: '' },
    tiktok: { type: String, default: '' },
  },
  verified: { type: Boolean, default: false },
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
  topSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
}, { timestamps: true });

const Artist = mongoose.model('Artist', artistSchema);

export default Artist;