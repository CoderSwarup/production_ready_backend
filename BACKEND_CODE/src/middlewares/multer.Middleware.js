import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Public/temp');
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });

export const multiUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverimage', maxCount: 1 },
]);
