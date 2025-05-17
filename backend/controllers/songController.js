export class SongController {
  constructor(songModel) {
    this.model = songModel;
  }

  async getAllSongs(req, res) {
    try {
      const songs = await this.model.findAll();
      res.json(songs);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }
  
  async getSongById(req, res) {
    const { id } = req.params;
    try {
      const song = await this.model.findById(id);
      if (!song) {
        return res.status(404).json({ error: 'song not found' });
      }
      res.json(song);
    } catch (error) {
      res.status(500).json({ error: error.message });
} } }