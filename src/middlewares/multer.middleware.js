import multer from 'multer';


const storage = multer.memoryStorage();  
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(file.mimetype);

    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  }
});

export default upload;
