import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';
import staticRouter from './routes/static.js';

// Imports para o teste
import { protect } from './middlewares/authMiddleware.js';
import { getFeaturedPlaylists } from './controllers/spotifyController.js';
import { connectToDatabase } from './config/db.js';

// Conecte ao banco de dados aqui também para garantir
await connectToDatabase();

const app = express();

app.use(cors());
app.use(express.json());

// ROTA DE TESTE DIRETA
// O Express vai procurar por esta rota primeiro.
app.get('/api/spotify/featured-playlists', protect, getFeaturedPlaylists);


// Rotas originais
app.use('/api', apiRouter);
app.use(staticRouter);

export default app;