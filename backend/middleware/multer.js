import multer from 'multer';

// Configure multer storage
const storage = multer.memoryStorage(); // Store files in memory for processing

//single file upload middleware
export const singleUpload = multer({ storage }).single('file'); // 'file' is the field name in the form

//multiple file upload middleware
export const multipleUpload = multer({storage}).array('files', 5); // 'files' is the field name in the form, and 5 is the max number of files

