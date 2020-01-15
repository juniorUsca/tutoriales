const express = require('express')
const multer = require('multer')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const googleStorage = require('./googleStorage')
const uploadDocuments = require('./routes/upload-documents')


// create express app
const app = express()

// configure multer
const upload = multer({
  dest: `uploads/`,
  limits: {
    files: 5, // allow up to 5 files per request,
    fileSize: 4 * 1024 * 1024 // 4 MB (max file size)
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|zip|rar|doc|docx)$/)) {
      cb(new Error('Tipo de Archivo no Permitido.'), false);
      //cb(null, false);
      return
    }
    cb(null, true);
  }
})

// enable CORS
app.use(cors())

// add other middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//app.use(morgan('dev'))


const routeUplaod = upload.array('documents')
// routes
app.post('/upload-documents', (req, res, next) => {
  routeUplaod(req,res, (err) => {
    if(err) {
      if (err.message === 'File too large') return res.status(500).send('Máximo 4Mb por archivo')
      if (err.message === 'Too many files') return res.status(500).send('Máximo 5 archivos')
      res.status(500).send(err.message)
    }
    else next(err);
  })
} , uploadDocuments)


// start the app 
const port = process.env.PORT || 4003

app.listen(port, () =>
  console.log(`App is listening on port ${port}.`)
);