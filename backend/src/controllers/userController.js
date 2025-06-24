import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
}); };

export class UserController {
  constructor(userModel) {
    this.model = userModel;
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.model.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getUserById(req, res) {
    const { id } = req.params;
    try {
      const user = await this.model.findById(id);
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async updateUser(req, res) {
    const { id } = req.params;
    try {
      const { password, ...updateData } = req.body;
      if (password) {
          return res.status(400).json({ message: "password cannot be updated through this route. Please use a dedicated password change function."});
      }

      const user = await this.model.updateById(id, updateData);
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const user = await this.model.deleteById(id);
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async registerUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'please add all fields' });
    }

    try {
      const userExistsByEmail = await this.model.findByEmail(email);
      if (userExistsByEmail) {
        return res.status(400).json({ message: 'user with this email already exists' });
      }
      const userExistsByUsername = await this.model.findByUsername(username);
      if (userExistsByUsername) {
        return res.status(400).json({ message: 'username is already taken' });
      }

      const user = await this.model.create({ username, email, password });

      if (user) {
        const userObject = user.toObject();
        delete userObject.password;

        res.status(201).json({
          ...userObject,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json({ message: 'invalid user data' });
      }
    } catch (error) {
      console.error("registration error:", error);
      res.status(500).json({ message: 'server error during registration', error: error.message });
  } }

  async loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'please provide email and password' });
    }

    try {
      const user = await this.model.findByEmail(email);

      if (user && (await user.comparePassword(password))) {
        // FIXED: Return the full user object
        const userObject = user.toObject();
        delete userObject.password;

        res.json({
          ...userObject,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: 'invalid email or password' });
      }
    } catch (error) {
      console.error("login error:", error);
      res.status(500).json({ message: 'server error during login', error: error.message });
  } }

  async getCurrentUser(req, res) {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(404).json({ message: 'user not found' });
} } }