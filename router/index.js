const { Router } = require('express');
const {
  signup,
  signin,
  logout,
  deleteUser,
  signupConfirm,
  refreshToken,
  getUsers,
} = require('../controllers/user-controller');
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
router.post('/delete', deleteUser);

router.get('/signup/confirm/:link', signupConfirm);
router.get('/refresh', refreshToken);
router.get('/users', authMiddleware, getUsers);

module.exports = router;