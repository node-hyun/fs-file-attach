const express = require('express')
const multer = require('multer')

const { v4: uuid } = require('uuid')
const mime = require('mime-types')

// 파일 이름은 uuid 확장자는 원래 대로 저장하도록 뮬터 옵션 수정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  // filename: (req, file, cb) => cb(null, uuid()),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
})
const upload = multer({ storage })

const app = express()
const PORT = 5000

// app.use(express.static("uploads"))
app.use('/uploads', express.static('uploads'))

app.post('/upload', upload.single('imageTest'), (req, res) => {
  console.log(req.file)
  res.json(req.file)
})

app.listen(PORT, () => console.log('Express server listening on PORT ' + PORT))