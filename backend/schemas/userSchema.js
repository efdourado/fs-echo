import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '' },
  bio: { type: String, default: '' },
  favoriteGenres: { type: [String], default: [] },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followingArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
  likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  recentlyPlayed: [{
    song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    playedAt: { type: Date, default: Date.now }
  }],
  isAdmin: { type: Boolean, default: false },
  isArtist: { type: Boolean, default: false },
  artistProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  socials: {
    instagram: { type: String, default: '' },
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;