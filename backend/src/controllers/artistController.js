export class ArtistController {
  constructor(artistModel) {
    this.model = artistModel;
  }

  async getAllArtists(req, res) {
    try {
      const artists = await this.model.findAll();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getArtistById(req, res) {
    const { id } = req.params;
    try {
      const artist = await this.model.findById(id);
      if (!artist) {
        return res.status(404).json({ error: 'artist not found' });
      }
      res.json(artist);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async createArtist(req, res) {
    try {
      const artistData = { ...req.body };
      
      if (artistData.socials) {
        artistData.socials = JSON.parse(artistData.socials);
      }
      
      // FIX: Converte a string de gêneros em um array
      if (artistData.genre && typeof artistData.genre === 'string') {
        artistData.genre = artistData.genre.split(',').map(g => g.trim()).filter(g => g);
      }

      if (req.files) {
        if (req.files.image) {
          artistData.image = `/uploads/images/${req.files.image[0].filename}`;
        }
        if (req.files.banner) {
          artistData.banner = `/uploads/images/${req.files.banner[0].filename}`;
        }
      }

      const artist = await this.model.create(artistData);
      res.status(201).json(artist);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async updateArtist(req, res) {
    const { id } = req.params;
    try {
      const updateData = { ...req.body };

      if (updateData.socials) {
        updateData.socials = JSON.parse(updateData.socials);
      }

      // FIX: Converte a string de gêneros em um array
      if (updateData.genre && typeof updateData.genre === 'string') {
        updateData.genre = updateData.genre.split(',').map(g => g.trim()).filter(g => g);
      }

      if (req.files) {
         if (req.files.image) {
          updateData.image = `/uploads/images/${req.files.image[0].filename}`;
        }
        if (req.files.banner) {
          updateData.banner = `/uploads/images/${req.files.banner[0].filename}`;
        }
      }

      const artist = await this.model.updateById(id, updateData);
      if (!artist) {
        return res.status(404).json({ error: 'Artist not found' });
      }
      res.json(artist);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async deleteArtist(req, res) {
    const { id } = req.params;
    try {
      const artist = await this.model.deleteById(id);
      if (!artist) {
        return res.status(404).json({ error: 'Artist not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }
}