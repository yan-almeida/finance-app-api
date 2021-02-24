import { randomBytes } from 'crypto';

import * as multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    randomBytes(16, (error, hash) => {
      if (error) {
        cb(error, file.originalname);
      }
      const filename = `${hash.toString('HEX')}.png`;
      cb(null, filename);
    });
  },
});

export const uploads = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (request, file, callback) => {
    const formats = ['image/jpeg', 'image/jpg', 'image/png'];

    if (formats.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Format not accepted'));
    }
  },
});
