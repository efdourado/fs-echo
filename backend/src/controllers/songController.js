import * as mm from 'music-metadata';

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
      const songData = { ...req.body };
      
      if (!req.files || !req.files.audioUrl) {
          return res.status(400).json({ error: 'Audio file is required.' });
      }

      const audioFile = req.files.audioUrl[0];
      songData.audioUrl = `/uploads/audio/${audioFile.filename}`;
      
      const metadata = await mm.parseFile(audioFile.path);
      songData.duration = metadata.format.duration;

      if (req.files.coverImage) {
        songData.coverImage = `/uploads/images/${req.files.coverImage[0].filename}`;
      }

      const song = await this.model.create(songData);
      res.status(201).json(song);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
  } }

  async updateSong(req, res) {
    const { id } = req.params;
    try {
      const updateData = { ...req.body };
      
      if (req.files) {
        if (req.files.audioUrl) {
            const audioFile = req.files.audioUrl[0];
            updateData.audioUrl = `/uploads/audio/${audioFile.filename}`;
            const metadata = await mm.parseFile(audioFile.path);
            updateData.duration = metadata.format.duration;
        }

        if (req.files.coverImage) {
            updateData.coverImage = `/uploads/images/${req.files.coverImage[0].filename}`;
      } }

      const song = await this.model.updateById(id, updateData);
      if (!song) {
        return res.status(404).json({ error: 'Song not found' });
      }
      res.json(song);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
  } }

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