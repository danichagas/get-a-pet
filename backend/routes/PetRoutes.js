const router = require('express').Router()

const PetController = require('../controllers/PetController')

const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

router.post('/create', verifyToken, imageUpload.array('images'), PetController.createPet)
router.get('/', PetController.getAll)
route.get('/mypets', verifyToken, PetController.getAllUsersPets)
route.get('/myadoptions', verifyToken, PetController.getAllUsersAdoptions)
router.get('/:id', PetController.getPetById)
router.delete('/:id', verifyToken, PetController.removePetById)
router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePet)
router.patch('/schedule/:id', verifyToken, PetController.scheduleVisit)

module.exports = router