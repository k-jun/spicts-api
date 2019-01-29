const AWS = require('aws-sdk')
const uuid = require('uuid/v1')
const express = require('express');
const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.S3AccessKeyId,
  secretAccessKey: process.env.S3SecretAccessKey,
  region: "ap-northeast-1"
})

const DynamoDB = new AWS.DynamoDB({
  accessKeyId: process.env.DDBAccessKeyId,
  secretAccessKey: process.env.DDBSecretAccessKey,
  region: "ap-northeast-1"
})


router.get('/', async function(req, res) {
  return res.send({ message: "apiは動いています！" });
});

router.post('/post_piece_image', async function(req, res) {
  const { url, id } = req.body
  const params = {
    Item: {
      "id": { S: id },
      "url": { S: url }
    },
    TableName: "SpictsPieceImages"
   };
  DynamoDB.putItem(params, (err, data) => {
    if (err) { res.status(403).send({ message: err }) }
    return res.send({ data });
  })
});

router.get('/get_main_image', async function(req, res) {
  const params = {
    TableName: "SpictsMainImages"
   };
  DynamoDB.scan(params, (err, data) => {
    if (err) { res.status(403).send({ message: err }) }
    return res.send({ data });
  })
});

router.post('/post_main_image', async function(req, res) {
  const { url, id } = req.body
  const params = {
    Item: {
      "id": { S: id },
      "url": { S: url }
    },
    TableName: "SpictsMainImages"
   };
  DynamoDB.putItem(params, (err, data) => {
    if (err) { res.status(403).send({ message: err }) }
    return res.send({ data });
  })
});

router.get('/get_piece_image', async function(req, res) {
  const params = {
    TableName: "SpictsPieceImages"
   };
  DynamoDB.scan(params, (err, data) => {
    if (err) { res.status(403).send({ message: err }) }
    return res.send({ data });
  })
});

router.get('/s3_image_upload', (req, res) => {
    const key = `${uuid()}.jpeg`

    s3.getSignedUrl('putObject', {
        Bucket: 'spicts',
        ContentType: 'image/jpeg',
        Key: key
    }, (err, url) => res.send({key, url}))
})

module.exports = router;
