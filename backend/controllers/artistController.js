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
} } }