var controller = require('./controllers');
var router = require('express').Router();

//Connect controller methods to their corresponding routes
router.get('/messages', controller.messages.get);

router.post('/messages', controller.messages.post);

router.options('/messages', controller.messages.get);

router.get('/users', controller.users.get);

router.post('/users', controller.users.post);

router.post('/friends', controller.friends.post);

router.get('/friends', controller.friends.get);


module.exports = router;

