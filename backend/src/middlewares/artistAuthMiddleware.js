import Song from '../models/songModel.js';
import Album from '../models/albumModel.js';
import Artist from '../models/artistModel.js';

export const isArtistOwner = async (req, res, next) => {
  if (!req.user || !req.user.isArtist) {
    return res.status(403).json({ message: 'Access denied. Not an artist.' });
  }

  try {
    const artistProfile = await Artist.findById(req.user.artistProfile);
    if (!artistProfile) {
      return res.status(403).json({ message: 'Artist profile not found for user.' });
    }

    let resource;

    if (req.params.id) {
        if (req.baseUrl.includes('songs')) {
            resource = await Song.findById(req.params.id);
        } else if (req.baseUrl.includes('albums')) {
            resource = await Album.findById(req.params.id);
    } }
    
    if (req.params.id === artistProfile._id.toString()) {
        return next();
    }

    if (resource && resource.artist.toString() === artistProfile._id.toString()) {
      return next();
    }

    return res.status(403).json({ message: 'Access denied. You do not own this content.' });

  } catch (error) {
    res.status(500).json({ message: 'Server error during authorization.', error: error.message });
} };