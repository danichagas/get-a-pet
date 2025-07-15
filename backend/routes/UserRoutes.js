const router = require("express").Router();
const UserController = require('../controllers/UserController')

router.post('/register', UserController.registerNewUser)
router.post('/login', UserController.userLogin)
router.get('/checkuser', UserController.checkingUserByToken)
router.get('/:id', UserController.getUserById)

module.exports = router