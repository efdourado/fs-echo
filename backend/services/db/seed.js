import { connectToDatabase } from '../../config/db.js';

import { artistData } from '../../../frontend/src/assets/db/artistData.js';
import { songData } from '../../../frontend/src/assets/db/songData.js';
import { userData } from '../../../frontend/src/assets/db/userData.js';
import { albumData } from '../../../frontend/src/assets/db/albumData.js';
import { playlistData } from '../../../frontend/src/assets/db/playlistData.js';

import Artist from '../../schemas/artistSchema.js';
import Song from '../../schemas/songSchema.js';
import User from '../../schemas/userSchema.js';
import Album from '../../schemas/albumSchema.js';
import Playlist from '../../schemas/playlistSchema.js';

await connectToDatabase();

async function clearCollections() {
  console.log('Clearing collections...');
  // await Artist.deleteMany({});
  // await Song.deleteMany({});
  // await User.deleteMany({});
  // await Album.deleteMany({});
  await Playlist.deleteMany({});
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

    // console.log('Inserting albums...');
    // const insertedAlbums = await Album.insertMany(albumData);
    // console.log(`Inserted ${insertedAlbums.length} albums`);

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