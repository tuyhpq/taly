'use strict';

/**
 * Module dependencies
 */
var config = require('../config/server.config'),
  path = require('path'),
  mongoose = require('mongoose'),
  Modules = mongoose.model(config.names),
  multer = require('multer'),
  configRoot = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create
 */
exports.create = function (req, res) {
  var modules = new Modules(req.body);
  if (req.user) {
    modules.created_by = req.user.displayName;
  }
  modules.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(modules);
    }
  });
};

/**
 * Show
 */
exports.read = function (req, res) {
  // Convert mongoose document to JSON
  var modules = req.modules ? req.modules.toJSON() : {};

  res.json(modules);
};

/**
 * Update
 */
exports.update = function (req, res) {
  var modules = req.modules;

  modules.title = req.body.title;
  modules.author = req.body.author;

  modules.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(modules);
    }
  });
};

/**
 * Delete
 */
exports.delete = function (req, res) {
  var modules = req.modules;

  modules.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(modules);
    }
  });
};

/**
 * List
 */
exports.list = function (req, res) {
  Modules.find().sort('-created').exec(function (err, modules) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(modules);
    }
  });
};

/**
 * Params
 */
exports.byID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: config.names.toUpperCase() + ' is invalid'
    });
  }

  Modules.findById(id).exec(function (err, modules) {
    if (err) {
      return next(err);
    } else if (!modules) {
      return res.status(404).send({
        message: 'No ' + config.names.toUpperCase() + ' with that identifier has been found'
      });
    }
    req.modules = modules;
    next();
  });
};

/**
 * Upload image
 */
exports.uploadsPicture = function (req, res) {
  var multerConfig = configRoot.uploads.upload.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newImage');

  uploadImage()
    .then(function () {
      res.json({ nameFile: configRoot.uploads.upload.image.dest + req.file.filename });
    })
    .catch(function (err) {
      res.status(422).send(err);
    });

  function uploadImage() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }
};

/**
 * Upload file
 */
exports.uploadsFile = function (req, res) {
  var multerConfig = configRoot.uploads.upload.file;
  var upload = multer(multerConfig).single('newFile');

  uploadFile()
    .then(function () {
      res.json({ nameFile: configRoot.uploads.upload.file.dest + req.file.filename });
    })
    .catch(function (err) {
      res.status(422).send(err);
    });

  function uploadFile() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }
};

/**
 * Check activation code from req.query.code
 */
exports.checkCode = function (req, res) {
  var code = req.params.activateCode;
  var time = 0;

  if (code === '687584503440@1') {
    time = 60 * 24;
  } else if (code === '687584503440@3') {
    time = 60 * 24 * 3;
  } else if (code === '687584503440@5') {
    time = 60 * 24 * 5;
  } else if (code === '687584503440@7') {
    time = 60 * 24 * 7;
  } else if (code === '687584503440@vv') {
    time = 9999999;
  } else if (code.length > 13 && code.slice(0, 13) === '687584503440@') {
    var custom = code.slice(13, code.length);
    time = parseInt(custom, 10);
    time = isNaN(time) ? 0 : time;
  }

  return res.json({ 'time': time });
};

/**
 * Get the information of auto application
 */
exports.information = function (req, res) {
  var httpTransport = (configRoot.secure && configRoot.secure.ssl === true) ? 'https://' : 'http://';
  var baseUrl = configRoot.domain || httpTransport + req.headers.host;
  var url = baseUrl + '/modules/autos/client/files/';

  var info = {
    'author': 'Tuý Công Tử - 0164.840.3817',
    'urlRecords': url + 'records',
    'urlFiles': [url + '6c5ddcff25cf45c1a8e08706b92bae9b',
    url + '111b76015432483b9b1ee3981659a6bc',
    url + 'c9d0c9be297c47c9954197ecb04d5efe',
    url + '3872ac9a76a9426a9f771933ea3e9c5a',
    url + '9f80d0a640bb464aa9a6f28a8f0493ee',
    url + 'da72f2af50384900a0111446f7ea3230',
    url + '5696c30b36064de594aaf8ef7681ec07',
	url + '538f0208cbc1492ea5151ff19ca8db00',
	url + '038f899320554c0c869e865a543d901d',
	url + '02a4ba04ef604dfb880b475e739ead91',
	url + '1d36f15e4a60403981f3f724bb2816c7',
	url + '326e6381390a4525a2df127e4c8f6958'],
    'urlCheck': baseUrl + '/api/auto/check/',
    'stop': 'false'
  };

  return res.json(info);
};

/**
 * 
 */
exports.google = function (req, res) {
  console.log('cccccccccccccccccccccc');
  var fs = require('fs');

  var fileMetadata = {
    'name': 'default.png'
  };
  var media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream('./modules/users/client/img/profile/default.png')
  };
  MyDrive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('File Id: ', file.id);
    }
  });
};

var MyDrive;

//getGiDo();
function getGiDo() {
  var fs = require('fs');
  var readline = require('readline');
  var google = require('googleapis');
  var googleAuth = require('google-auth-library');

  var SCOPES = ['https://www.googleapis.com/auth/drive'];
  var TOKEN_DIR = '.credentials/';
  var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';
  // Load client secrets from a local file.
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Drive API.
    console.log({
      content: JSON.parse(content),
      TOKEN_DIR: TOKEN_DIR,
      TOKEN_PATH: TOKEN_PATH
    });
    authorize(JSON.parse(content), listFiles);
  });

  function authorize(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
      if (err) {
        getNewToken(oauth2Client, callback);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        callback(oauth2Client);
      }
    });
  }

  function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'online',
      scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function (code) {
      rl.close();
      oauth2Client.getToken(code, function (err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          return;
        }
        oauth2Client.credentials = token;
        storeToken(token);
        callback(oauth2Client);
      });
    });
  }

  function storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
  }

  function listFiles(auth) {
    var service = google.drive({ version: 'v3', auth: auth });
    MyDrive = service;
    service.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name)"
    }, function (err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      var files = response.files;
      if (files.length == 0) {
        console.log('No files found.');
      } else {
        console.log('Files:');
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          console.log('%s (%s)', file.name, file.id);
        }
      }
    });
  }

}
