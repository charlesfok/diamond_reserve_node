var express = require('express');
var controller = require('./diamond.controller');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());


function checkAuth(req, res, next) {
	var token = req.body.token || req.query.token;
	console.log('Coin Token');
	console.log(token);
	if (token) {
		next();

	} else {
		console.log('there');
		console.log(req.query.token);
		return res.status(401).send({message: 'Authentication Failed'});
	}
}


router.get('/', controller.getDiamonds);
router.post('/', controller.createDiamond);
router.get('/:id', controller.getDiamond);
router.put('/:id', controller.updateDiamond);
router.delete('/:id', controller.deleteDiamond);

/**
 * Errors on "/api/coins/*" routes.
 */
// router.use((err, req, res, next) => {
//   // Format error and forward to generic error handler for logging and
//   // responding to the request
//   err.response = {
//     message: err.message,
//     internalCode: err.code
//   };
//   next(err);
// });

module.exports = router;