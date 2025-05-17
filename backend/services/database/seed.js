import { connectToDatabase } from '../../config/db.js';
import { artistArray } from '../../../frontend/src/assets/db/a.js';
import { songsArray } from '../../../frontend/src/assets/db/s.js';
import Artist from '../../schemas/artistSchema.js';
import Song from '../../schemas/songSchema.js';

await connectToDatabase();

// const newArtists = artistArray.map(({ id, ...rest }) => rest);
const newSongs = songsArray.map(({ id, ...rest }) => rest);

async function seedDatabase() {
  try {
    console.log('Clearing collections...');
    // await Artist.deleteMany({});
    await Song.deleteMany({});

    console.log('Inserting data...');
    // const insertedArtists = await Artist.insertMany(newArtists);
    const insertedSongs = await Song.insertMany(newSongs);

    console.log('Seed completed successfully!');
    // console.log(`Inserted artists: ${insertedArtists.length}`);
    console.log(`Inserted songs: ${insertedSongs.length}`);
  } catch (error) {
    console.error('Error during seeding:', error.message);
  } finally {
    process.exit();
} }

seedDatabase();
// uncomment artist lines to seed artists first, songs lines to seed songs afterward (seed artists before songs).