const uuid = require('uuid/v1')
const {Storage} = require('@google-cloud/storage');

const getFilename = (req, file, cb) => {
  cb(null,`${uuid()}_${file.originalname}`);
}

// function getFilename (req, file, cb) {
//   crypto.pseudoRandomBytes(16, function (err, raw) {
//     cb(err, err ? undefined : raw.toString('hex'))
//   })
// }

const getDestination = ( req, file, cb ) => {
  cb( null, '' );
}

// function getDestination (req, file, cb) {
//   cb(null, os.tmpdir())
// }

function GoogleStorage (opts) {
  this.getFilename = (opts.filename || getFilename)
  this.getDestination = (opts.destination || getDestination)
  
  const storage = new Storage({keyFilename: opts.keyFilename})
  this.gcsBucket = storage.bucket(opts.bucket)
}

GoogleStorage.prototype._handleFile = function _handleFile (req, file, cb) {
  var that = this

  that.getDestination(req, file, function (err, destination) {
    if (err) return cb(err)

    that.getFilename(req, file, function (err, filename) {
      if (err) return cb(err)

      const gcFile = that.gcsBucket.file(filename)
      const blobStream = gcFile.createWriteStream({
        resumable: false,
      })

      console.log('file', file)

      file.stream.pipe(blobStream)
        .on('error', cb)
        .on('finish', () => {
          cb(null, {
            path: `https://storage.googleapis.com/${that.gcsBucket.name}/${gcFile.name}`,
            filename: filename,
          })
        }
      )
    })
  })
}

GoogleStorage.prototype._removeFile = function _removeFile (req, file, cb) {
  var gcFile = this.gcsBucket.file(file.filename);
  gcFile.delete();
}

module.exports = function (opts) {
  return new GoogleStorage(opts)
}