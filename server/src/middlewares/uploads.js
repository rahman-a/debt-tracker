import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDirectory = path.resolve(__dirname, '../../uploads')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDirectory)
  },
  filename(req, file, cb) {
    let fileName
    if (file.originalname === 'blob') {
      fileName = `${file.fieldname}-${Date.now()}-.png`
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
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match('blob')) {
      cb(new Error(req.t('upload_image_extension')))
    }
    cb(undefined, true)
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

export const chatRoomImageHandler = multer({
  storage,
  limits: {
    fileSize: 500000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|PNG|JPG|JPEG|)$/)) {
      cb(new Error(req.t('upload_chat_image_extension')))
    }
    cb(undefined, true)
  },
})

export const chatUploadHandler = multer({
  storage,
  limits: {
    fileSize: 5000000,
  },
  // fileFilter(req, file, cb){
  //     if(!file.originalname.match(/\.(png|jpg|jpeg|PNG|JPG|JPEG|doc|docx|pdf|xlsx|pptx)$/)) {
  //         cb(new Error('please upload image with following extension [png, jpg, jpeg, svg, pdf, docx. xlsx, pptx]'))
  //     }
  //     cb(undefined, true)
  // }
})
