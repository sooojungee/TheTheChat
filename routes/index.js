var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/chat', function(req, res, next) {
  res.render('layout', { title: 'Express' });
});

router.get('/soo', function(req, res, next) {
  res.render('soojungChat', { title: 'Express' });
});

router.get('/hyeonsik', function(req, res, next) {
    res.render('hyeonsik', { title: 'Express' });
});


module.exports = router;
