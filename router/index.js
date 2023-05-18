const { Router } = require('express');
const {
  signup,
  signin,
  logout,
  deleteUser,
  signupConfirm,
  refreshToken,
  getUsers,
  updateUser,
} = require('../controllers/user-controller');
const {
  createSpeciality,
  updateSpeciality,
  deleteSpeciality,
  getSpecialities,
} = require('../controllers/speciality-controller');

const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

const router = new Router();

router.post('/signup',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  signup
);
router.post('/signin', signin);
router.post('/logout', logout);
router.post('/user/delete', deleteUser);
router.post('/user/update', updateUser);
router.get('/signup/confirm/:link', signupConfirm);
router.get('/refresh', refreshToken);
router.get('/users', authMiddleware, getUsers);

router.post('/speciality/create', authMiddleware, createSpeciality);
router.post('/speciality/update', authMiddleware, updateSpeciality);
router.post('/speciality/delete', authMiddleware, deleteSpeciality);
router.get('/specialities', getSpecialities);

module.exports = router;