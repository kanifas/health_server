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
  createOccupation,
  deleteOccupation,
  getOccupations,
} = require('../controllers/occupation-controller');
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

router.post('/occupation/create', createOccupation);
router.post('/occupation/delete', deleteOccupation);
router.get('/occupations', getOccupations);

module.exports = router;