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
    { name: 'banner', label: 'Banner', type: 'url'},
    { name: 'image', label: 'Profile picture', type: 'url'},
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'verified', label: 'Verified', component: 'checkbox', description: '(Artist Status)' },
    { name: 'description', label: 'Description', component: 'textarea', rows: '6', span: 'span-2' },
    { name: 'genre', label: 'Genres', type: 'text', span: 'span-2' },
] };