import * as adminService from '../../../../services/adminService';
import { fetchUserById } from '../../../../services/userService';

export const userFormConfig = {
  initialState: {
    username: '',
    email: '',
    bio: '',
    profilePic: '',
    isAdmin: false,
    isArtist: false,
  },
  api: {
    fetchById: fetchUserById,
    
    update: adminService.updateUser,
  },
  processDataForForm: (data) => data,
  processDataForSubmit: (data) => data,
  fields: [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'bio', label: 'Bio', component: 'textarea', rows: '3', span: 'span-2' },
    { name: 'profilePic', label: 'Profile Picture URL', type: 'url', span: 'span-2' },
    { name: 'isAdmin', label: 'Administrator', component: 'checkbox' },
    { name: 'isArtist', label: 'Artist', component: 'checkbox' },
], };