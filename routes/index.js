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

router.get('/login', function(req, res, next) {
  res.render('soojungLogin', { title: 'Express' });
});

router.get('/hyeonsik', function(req, res, next) {
    res.render('hyeonsik', { title: 'Express' });
});

router.get('/jaejong', function(req, res, next) {
    res.render('layoutJaejong');
});


router.get('/junyup', function(req, res, next) {
  res.render('junyupChat');
});

module.exports = router;
