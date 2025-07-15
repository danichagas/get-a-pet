const router = require("express").Router();
const UserController = require('../controllers/UserController')

const verifyToken = require('../helpers/verify-token')

router.post('/register', UserController.registerNewUser)
router.post('/login', UserController.userLogin)
router.get('/checkuser', UserController.checkingUserByToken)
router.get('/:id', UserController.getUserById)
router.patch('/edit/:id', verifyToken, UserController.editUser)

module.exports = router