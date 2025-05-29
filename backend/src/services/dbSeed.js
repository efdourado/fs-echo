import { connectToDatabase } from '../config/db.js';

import { artistData } from './data/artistData.js';
import { songData } from './data/songData.js';
import { userData } from './data/userData.js';
import { albumData } from './data/albumData.js';
import { playlistData } from './data/playlistData.js';

import Artist from '../models/artistModel.js';
import Song from '../models/songModel.js';
import User from '../models/userModel.js';
import Album from '../models/albumModel.js';
import Playlist from '../models/playlistModel.js';

await connectToDatabase();

async function clearCollections() {
  console.log('Clearing collections...');
  // await Artist.deleteMany({});
  // await Song.deleteMany({});
  // await User.deleteMany({});
  // await Album.deleteMany({});
  // await Playlist.deleteMany({});
}

async function seedDatabase() {
  try {
    await clearCollections();

    // console.log('Inserting artists...');
    // const insertedArtists = await Artist.insertMany(artistData);
    // console.log(`Inserted ${insertedArtists.length} artists`);

    // console.log('Inserting songs...');
    // const insertedSongs = await Song.insertMany(songData);
    // console.log(`Inserted ${insertedSongs.length} songs`);

    // console.log('Inserting users...');
    // const insertedUsers = await User.insertMany(userData);
    // console.log(`Inserted ${insertedUsers.length} users`);

    console.log('Inserting albums...');
    const insertedAlbums = await Album.insertMany(albumData);
    console.log(`Inserted ${insertedAlbums.length} albums`);

    console.log('Inserting playlists...');
    const insertedPlaylists = await Playlist.insertMany(playlistData);
    console.log(`Inserted ${insertedPlaylists.length} playlists`);

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error.message);
  } finally {
    process.exit();
} }

seedDatabase();