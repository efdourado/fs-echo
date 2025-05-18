import User from '../schemas/userSchema.js';

export class UserModel {
  async findAll() {
    return await User.find();
  }

  async findById(id) {
    return await User.findById(id);
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findByUsername(username) {
    return await User.findOne({ username });
} }