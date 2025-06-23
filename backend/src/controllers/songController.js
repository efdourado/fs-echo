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
  } }
   
  async createSong(req, res) {
    try {
      // Todos os dados, incluindo audioUrl e duration, vêm do body
      const songData = { ...req.body };
      
      // Validação simples
      if (!songData.audioUrl || !songData.duration) {
          return res.status(400).json({ error: 'Audio URL and duration are required.' });
      }

      const song = await this.model.create(songData);
      res.status(201).json(song);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  async updateSong(req, res) {
    const { id } = req.params;
    try {
      const updateData = { ...req.body };
      
      const song = await this.model.updateById(id, updateData);
      if (!song) {
        return res.status(404).json({ error: 'Song not found' });
      }
      res.json(song);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  async deleteSong(req, res) {
    const { id } = req.params;
    try {
      const song = await this.model.deleteById(id);
      if (!song) {
        return res.status(404).json({ error: 'Song not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
} } }