const express = require('express');
const aws = require('aws-sdk');
const request = require('request');

const app = express();
app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);
app.listen(process.env.PORT || 3000);

const S3_BUCKET = process.env.S3_BUCKET;
const CROWDFLOWER_URL = 'https://api.crowdflower.com/v1';
const BASE_JOB_ID = process.env.BASE_JOB_ID;
const CF_API_KEY = process.env.CF_API_KEY;

app.get('/', (req, res) => res.render('upload.html'));

app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

app.get('/copy-job', (req, res) => {
  console.log(`${CROWDFLOWER_URL}/jobs/${BASE_JOB_ID}/copy?key=${CF_API_KEY}`);
  request.get(`${CROWDFLOWER_URL}/jobs/${BASE_JOB_ID}/copy?key=${CF_API_KEY}`,
    (error, response, body) => {
      if(!error) {
        console.log(response.statusCode); // 200
        console.log(response.headers['content-type']); // 'image/png'
      }
      res.write(JSON.stringify({ job_id: JSON.parse(body).id }));
      res.end();
    });
});
