/*eslint-disable*/
var express = require('express');
var multer = require('multer');
var app = express();
var fs = require('fs-extra');
const bodyParser = require('body-parser');
//const http = require('http');
// var DIR = './uploades/';
 
var storage = multer.diskStorage({
  destination: async function (req, file, cb) {

    var direc = 'D:/wrkspace/Pdf generator/node-pdf-master/output/' + req.query._id;
    //var dir = constants.PDF_OUTPUT_DIR + jsonParsed._id;
    
    await fs.ensureDir(direc)
    .then(() => {
      console.log('success!')
      return 'File is uploaded';
      //res.send(outputFile);
    })
    .catch(err => {
      console.error(err)
    })

    var outputFile = 'D:/wrkspace/Pdf generator/node-pdf-master/output/' + req.query._id + '/' + file.originalname;
    console.log('_id' + req.query._id);
    console.log('Direc' + direc);
    cb(null, direc)
  },
  filename: function (req, file, cb) {
    if(req.query.flag == 'true') {
      file.originalname = "PAN-" + file.originalname;
    }
    console.log(file.originalname);
    cb(null, file.originalname);
    return 'File is uploaded'; 
  }
})

//var upload = multer({ storage: storage }).any();

/*var whitelist = ['http://10.2.108.66:8100', 'http://localhost:8100', 'http://10.2.108.65:2000', 'http://localhost:2000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin ) {
      callback(null, true)
    } else {
      callback(null, true)
      //callback(new Error('Not allowed by CORS'))
    }
  }
}

// Then pass them to cors:
app.use(cors(corsOptions));*/

app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', 'http://10.2.108.65:8100');
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', "true");
  res.setHeader("Content-Type", "multipart/form-data"); 
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
 
app.use(function(err,req,res,next){
  //console.log(err);
  res.status(422).send({error: err.message});
});

app.get('/api', function (req, res) {
  res.end('file catcher example');
});

var filesys = require('fs');
 
app.post('/deleteFile', function (req, res, next) {
  console.log('Before delete..');
  console.log('Body :' + req.body.filename);
  try {
    var path = 'D:/wrkspace/Pdf generator/node-pdf-master/output/' + req.body.id + '/' + req.body.filename;
    if (filesys.existsSync(path)) {
      filesys.unlink('D:/wrkspace/Pdf generator/node-pdf-master/output/' + req.body.id + '/' + req.body.filename, function(error) {
        if (error) {
            throw error;
        }
        console.log('Deleted dog.jpg!!');
        res.status(200).send('Delete Succeeded :' + req.body.filename);
      });
    } else {
      res.status(300).send('The file you are trying to delete is not found');
    }
  } catch(err) {
    console.error(err)
    res.send(error);
  }
});

app.post('/api', async function (req, res, next) {
  try {
    console.log('Before upload..');
    //multer({ storage: storage }).any(); 
    await multer({ storage: storage }).any()(req, res, next, function (err) {
    if (err) {
      return res.end(err.toString());
      }
    });
    console.log('After upload..');
    res.status(200).send('File is uploaded');
  } catch (error) {
    res.send(error);
  }
});

/*app.get('/hello',function(req,res){
  res.send("HelloWorld..1..2..3..4..!");
});

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  //res.end('Hello Node.js\n');
}).listen(3030, "10.2.108.65");*/

var PORT = process.env.PORT || 3030;
 
app.listen(PORT, "10.2.108.65", function () {
  console.log('Working on port ' + PORT);
});