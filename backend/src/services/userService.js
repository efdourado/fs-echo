import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';
import Playlist from '../models/playlistModel.js';

export class UserService {
  constructor() {
    this.userModel = new UserModel();
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
} } }