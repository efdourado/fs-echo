import * as adminService from '../../../../services/adminService';
import { fetchArtistById } from '../../../../services/collectionService';

export const artistFormConfig = {
  initialState: {
    name: '',
    description: '',
    image: '',
    banner: '',
    genre: '',
    verified: false,
  },
  api: {
    fetchById: fetchArtistById,
    create: adminService.createArtist,
    update: adminService.updateArtist,
  },
  processDataForForm: (data) => ({
    ...data,
    genre: data.genre?.join(', ') || '',
  }),
  processDataForSubmit: (data) => ({
    ...data,
    genre: data.genre.split(',').map(g => g.trim()).filter(Boolean),
  }),
  fields: [
    { name: 'name', label: 'Artist Name', type: 'text', required: true },
    { name: 'verified', label: 'Verified', component: 'checkbox' },
    { name: 'description', label: 'Description', component: 'textarea', rows: '3', span: 'span-2' },
    { name: 'image', label: 'Artist Image URL', type: 'url', span: 'span-2' },
    { name: 'banner', label: 'Banner URL', type: 'url', span: 'span-2' },
    { name: 'genre', label: 'Genres (comma-separated)', type: 'text', span: 'span-2' },
] };