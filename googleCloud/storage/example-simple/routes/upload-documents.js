const { format } = require('util')
const fs = require('fs')
const uuid = require('uuid/v1')
const { Storage } = require('@google-cloud/storage')

const storage = new Storage({ keyFilename: 'key.json' })
const bucket = storage.bucket('gs://provider-documents')


const uploadDocuments = async (req, res, next) => {
  try {
    const documents = req.files;

    if (!documents || documents.length < 1) {
      res.status(400).send('No hay archivos seleccionados.')
    } else {

      const data = documents.map(file => ({
        path: file.path,
        name: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        publicName: `${uuid()}_${file.originalname}`,
        publicPath: format(`https://storage.googleapis.com/${bucket.name}/`),
      }))

      const dataUp = data.map(file => {
        return bucket.upload(file.path, {
          destination: file.publicName,
          gzip: true,
        })
      })

      // WORKS ON MEMORY STORAGE MULTER
      // const blob = bucket.file(`${uuid()}_${file.originalname}`)
      // const blobStream = blob.createWriteStream({
      //   resumable: false,
      // })
      // blobStream.on('error', err => next(err))
      // blobStream.on('finish', () => {
      //   data.publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
      //   data.publicName = blob.name
      //   console.log('finish')
      // })
      // blobStream.end(file.buffer)

      await Promise.all(dataUp)

      const dataClear = data.forEach(file => {
        fs.unlink(file.path, (err) => {if (err) console.log(err)})
      })

      res.send({
        status: true,
        message: 'Documentos subidos satisfactoriamente.',
        data: data
      })
    }

  } catch (err) {
    console.log('===============', err)
    res.status(500).send(err.message);
  }
}

module.exports = uploadDocuments
