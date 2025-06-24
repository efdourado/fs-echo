export class PlaylistController {
  constructor(playlistModel) {
    this.model = playlistModel;
  }

  async getAllPlaylists(req, res) {
    try {
      const playlists = await this.model.findAll();
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getPlaylistById(req, res) {
    const { id } = req.params;
    try {
      const playlist = await this.model.findById(id);
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMyPlaylists(req, res) {
    try {
      const playlists = await this.model.findByOwner(req.user._id);
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createPlaylist(req, res) {
    try {
      const playlistData = {
        ...req.body,
        owner: req.user._id
      };
      const playlist = await this.model.create(playlistData);
      res.status(201).json(playlist);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updatePlaylist(req, res) {
    const { id } = req.params;
    try {
      const playlist = await this.model.findById(id);
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      // CORREÇÃO APLICADA AQUI
      if (playlist.owner._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User not authorized to update this playlist' });
      }
      const updatedPlaylist = await this.model.updateById(id, req.body);
      res.json(updatedPlaylist);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deletePlaylist(req, res) {
    const { id } = req.params;
    try {
      const playlist = await this.model.findById(id);
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      // CORREÇÃO APLICADA AQUI
      if (playlist.owner._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User not authorized to delete this playlist' });
      }
      await this.model.deleteById(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addSongToPlaylist(req, res) {
    const { id, songId } = req.params;
    try {
      const playlist = await this.model.findById(id);
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      // CORREÇÃO APLICADA AQUI
      if (playlist.owner._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User not authorized to modify this playlist' });
      }
      const updatedPlaylist = await this.model.addSong(id, songId);
      if (!updatedPlaylist) {
        return res.status(409).json({ message: 'Song is already in this playlist.' });
      }
      res.json(updatedPlaylist);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeSongFromPlaylist(req, res) {
    const { id, songId } = req.params;
    try {
      const playlist = await this.model.findById(id);
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      // CORREÇÃO APLICADA AQUI
      if (playlist.owner._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'User not authorized to modify this playlist' });
      }
      const updatedPlaylist = await this.model.removeSong(id, songId);
      res.json(updatedPlaylist);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPlaylistsByOwner(req, res) {
    const { ownerId } = req.params;
    try {
      const playlists = await this.model.findByOwner(ownerId);
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: error.message });
  } } }