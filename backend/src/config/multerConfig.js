import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    const baseDir = path.join(__dirname, '../../../frontend/public/uploads');

    if (file.fieldname === 'coverImage' || file.fieldname === 'image' || file.fieldname === 'banner') {
      uploadPath = path.join(baseDir, 'images');
    } else if (file.fieldname === 'audioUrl') {
      uploadPath = path.join(baseDir, 'audio');
    } else {
      uploadPath = path.join(baseDir, 'others');
    }
    
    ensureDirectoryExistence(path.join(uploadPath, file.originalname));
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
} });

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('audio')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Please upload only images or audio files.'), false);
} };

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});

export default upload;