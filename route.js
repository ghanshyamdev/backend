require('dotenv').config()

var express = require('express')
var router = express.Router()
const request = require('request-promise')

const AWS = require('aws-sdk');
const path = require('path');
var multer = require('multer')
var multerS3 = require('multer-s3')

const {getArticlePaginated} = require('./database')

const BASE_URL = process.env.BASE_URL

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY 
  });
  var s3 = new AWS.S3();
  var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'test-task-ghanshyam',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString()+path.extname(file.originalname))
      }
    })
  })
router.get('/articles/page/:pno/records/:size',async function (req, res) {    
    try {         
        if(!req.params.pno || !req.params.size){
            return res.status(422).send({msg:"please provide pno(Page Number) and size(Records per page)"}) 
        }   
        let articles = await getArticlePaginated(req.params.pno,req.params.size);
        res.send(articles);
      } catch (error) {
        console.error(`Error: ${error.message}`)
        res.status(401).send(error.error)
      }
})

router.post('/articles/new', upload.single('photo'), async (req, res, next) => {
    try {    
        if(!req.body.title || !req.body.desc || !req.body.price || !req.body.rating || !req.file){
            return res.status(422).send({msg:"required field missing."})
        }       
                     
        const articleResponse = await request({
          uri: `${BASE_URL}/articles`,   
          json: true,       
          method: 'POST',
          headers: {
            'Authorization': req.headers["authorization"],            
          },
          body: {            
            title: req.body.title,
            desc: req.body.desc,
            price: req.body.price,
            rating: req.body.rating,
            imageURL: req.file.location                
          }
        })
               
        res.send(articleResponse)
      } catch (error) {
        console.error(`Error: ${error.message}`)
        res.status(401).send(error.error)
      }    
    
});

module.exports = router