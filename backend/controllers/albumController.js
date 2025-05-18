export class AlbumController {
  constructor(albumModel) {
    this.model = albumModel;
  }

  async getAllAlbums(req, res) {
    try {
      const albums = await this.model.findAll();
      res.json(albums);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getAlbumById(req, res) {
    const { id } = req.params;
    try {
      const album = await this.model.findById(id);
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.json(album);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async createAlbum(req, res) {
    try {
      const album = await this.model.create(req.body);
      res.status(201).json(album);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async updateAlbum(req, res) {
    const { id } = req.params;
    try {
      const album = await this.model.updateById(id, req.body);
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.json(album);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async deleteAlbum(req, res) {
    const { id } = req.params;
    try {
      const album = await this.model.deleteById(id);
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getAlbumsByArtist(req, res) {
    const { artistId } = req.params;
    try {
      const albums = await this.model.findByArtist(artistId);
      res.json(albums);
    } catch (error) {
      res.status(500).json({ error: error.message });
} } }