var express = require('express');
var controller = require('./user.controller');
const bodyParser = require('body-parser');
// var admin = require("firebase-admin");

const router = express.Router();
router.use(bodyParser.json());

function checkAuth(req, res, next) {
	var token = req.body.token || req.query.token;
	if (token){
		next();
	}
	else {
		return res.status(401).send({message: 'Authentication Failed'});
	}
}

router.get('/', controller.getUsers);
router.get('/login', controller.getUser);
router.get('/admins', controller.getAdmins);
router.get('/home_text', controller.getHomeTitle);
router.post('/', controller.createUser);
router.post('/:id', controller.updateUser);
router.post('/home_text', controller.updateHomeTitle);
router.delete('/:id', controller.deleteUser);


module.exports = router;