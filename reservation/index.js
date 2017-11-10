var express = require('express');
var controller = require('./reservation.controller');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());


function checkAuth(req, res, next) {
	var token = req.body.token || req.query.token;
	if (token) {
		next();
	} else {
		console.log('there');
		console.log(req.query.token);
		return res.status(401).send({message: 'Authentication Failed'});
	}
}




router.get('/', controller.getReserves);

router.post('/request', controller.requestReserve);
router.post('/accept', controller.acceptReserve);
router.post('/reject', controller.rejectReserve);
router.post('/cancel', controller.cancelReserve);


module.exports = router;