export class PlaylistController {
  constructor(playlistModel) {
    this.model = playlistModel;
  }

  async getAllPlaylists(req, res) {
    try {
      const playlists = await this.model.findAll();
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async getPlaylistById(req, res) {
    const { id } = req.params;
    try {
      const playlist = await this.model.findById(id);
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async createPlaylist(req, res) {
    try {
      const playlist = await this.model.create(req.body);
      res.status(201).json(playlist);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async updatePlaylist(req, res) {
    const { id } = req.params;
    try {
      const playlist = await this.model.updateById(id, req.body);
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
      res.json(playlist);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async deletePlaylist(req, res) {
    const { id } = req.params;
    try {
      const playlist = await this.model.deleteById(id);
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
  } }

  async addSongToPlaylist(req, res) {
    const { id, songId } = req.params;
    try {
      const playlist = await this.model.addSong(id, songId);
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
      res.json(playlist);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async removeSongFromPlaylist(req, res) {
    const { id, songId } = req.params;
    try {
      const playlist = await this.model.removeSong(id, songId);
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
      res.json(playlist);
    } catch (error) {
      res.status(400).json({ error: error.message });
  } }

  async getPlaylistsByOwner(req, res) {
    const { ownerId } = req.params;
    try {
      const playlists = await this.model.findByOwner(ownerId);
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ error: error.message });
} } }