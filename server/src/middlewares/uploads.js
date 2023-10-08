import multer from 'multer'
import path from 'path'

const __dirname = path.join(process.cwd(), 'server/src/middlewares')

const uploadDirectory = path.resolve(__dirname, '../../uploads')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDirectory)
  },
  filename(req, file, cb) {
    let fileName
    if (file.originalname === 'blob') {
      fileName = `${file.fieldname}-${Date.now()}-.${
        file.mimetype.split('/')[1]
      }`
    } else {
      fileName = `${file.fieldname}-${Date.now()}-${path.extname(
        file.originalname
      )}`
    }
    req.fileName = fileName
    cb(null, fileName)
  },
})

export const uploadDocumentsHandler = multer({
  limits: {
    fileSize: 25000000,
  },
  fileFilter(req, file, cb) {
    console.log('file original name: ', file.originalname)
    if (
      file.originalname.match(
        /\.(png|jpg|jpeg|PNG|JPG|JPEG|svg|SVG|pdf|PDF)$/
      ) ||
      file.originalname === 'blob'
    ) {
      cb(undefined, true)
    } else cb(new Error(req.t('upload_image_extension')))
  },
  storage,
})

export const uploadHandler = multer({
  storage,
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|PNG|JPG|JPEG|svg|SVG)$/)) {
      cb(new Error(req.t('upload_image_extension')))
    }
    cb(undefined, true)
  },
})

export const fileUploadHandler = multer({
  storage,
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (
      !file.originalname.match(
        /\.(png|jpg|jpeg|PNG|JPG|JPEG|doc|docx|pdf|xlsx|pptx)$/
      )
    ) {
      cb(new Error(req.t('upload_document_extension')))
    }
    cb(undefined, true)
  },
})
