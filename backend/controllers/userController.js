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

  async createUser(req, res) {
    try {
      const user = await this.model.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async updateUser(req, res) {
    const { id } = req.params;
    try {
      const user = await this.model.updateById(id, req.body);
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
} } }