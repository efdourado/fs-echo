import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';
import Playlist from '../models/playlistModel.js';
import { AlbumModel } from '../models/albumModel.js';
import { SongModel } from '../models/songModel.js';

export class UserService {
  constructor() {
    this.userModel = new UserModel();
    this.albumModel = new AlbumModel();
    this.songModel = new SongModel();
  }

  _generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  }); }

  async getAllUsers() {
    return this.userModel.findAll();
  }

  async getUserById(id) {
    return this.userModel.findById(id);
  }

  async getAllArtists() {
    return this.userModel.findAll({ isArtist: true });
  }

  async getArtistProfileById(id) {
    const artistDoc = await this.userModel.findById(id);
    if (!artistDoc || !artistDoc.isArtist) {
      const err = new Error('Artist not found');
      err.statusCode = 404;
      throw err;
    }

    const albumDocs = await this.albumModel.findByArtist(id);
    const songDocs = await this.songModel.findByArtist(id);

    // Convert all Mongoose documents to plain objects to prevent serialization errors
    const artist = artistDoc.toObject();
    const albums = albumDocs.map(doc => doc.toObject());
    const songs = songDocs.map(doc => doc.toObject());

    artist.albums = albums;
    artist.topSongs = songs.slice(0, 10);

    return artist;
  }

  async updateUser(id, updateData) {
    if (updateData.password) {
      const err = new Error("Password cannot be updated through this route.");
      err.statusCode = 400;
      throw err;
    }
    return this.userModel.updateById(id, updateData);
  }

  async deleteUser(id) {
    await Playlist.deleteMany({ owner: id });
    return this.userModel.deleteById(id);
  }

  async registerUser({ username, email, password }) {
    if (!username || !email || !password) {
      const err = new Error('Please add all fields');
      err.statusCode = 400;
      throw err;
    }
    
    const userExistsByEmail = await this.userModel.findByEmail(email);
    if (userExistsByEmail) {
      const err = new Error('User with this email already exists');
      err.statusCode = 400;
      throw err;
    }

    const user = await this.userModel.create({ username, email, password });
    
    const userObject = user.toObject();
    delete userObject.password;
    
    return {
      ...userObject,
      token: this._generateToken(user._id),
  }; }


  async loginUser({ email, password }) {
    if (!email || !password) {
      const err = new Error('Please provide email and password');
      err.statusCode = 400;
      throw err;
    }
    
    const user = await this.userModel.findByEmail(email);

    if (user && (await user.comparePassword(password))) {
      const userObject = user.toObject();
      delete userObject.password;

      return {
        ...userObject,
        token: this._generateToken(user._id),
      };
    } else {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
  } }
  
  
  async createUser(userData) {
    if (!userData.username || !userData.email) {
      const err = new Error('Username and email are required.');
      err.statusCode = 400;
      throw err;
    }

    const userExists = await this.userModel.findByEmail(userData.email);
    if (userExists) {
        const err = new Error('User with this email already exists.');
        err.statusCode = 409;
        throw err;
    }

    if (!userData.password) {
      userData.password = "default000";
    }

    return this.userModel.create(userData);
  }
}