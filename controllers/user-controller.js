const { validationResult } = require('express-validator');
const userService = require('../service/user-service');
const { ApiError } = require('../service/error.service');

class UserController {
  async signup(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
      }

      const { email, password } = req.body;
      const userData = await userService.signup(email, password);

      // TODO: когда https то добавить флаг sequre
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 дней
        httpOnly: true
      });

      return res.json(userData);
    } catch (err) {
      next(err)
    }
  }


  async signupConfirm(req, res, next) {
    try {
      const signupConfirmLink = req.params.link;
      await userService.signupConfirm(signupConfirmLink);
      return res.redirect(`${process.env.CLIENT_URL}:${process.env.CLIENT_PORT}`);
    } catch (err) {
      next(err)
    }
  }
  

  async signin(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.signin(email, password);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 дней
        httpOnly: true
      });

      return res.json(userData);
    } catch (err) {
      next(err)
    }
  }
  

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (err) {
      next(err)
    }
  }
  

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refreshToken(refreshToken);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 дней
        httpOnly: true
      });
      return res.json(userData);
    } catch (err) {
      next(err)
    }
  }

  
  async getUsers(req, res, next) {
    try {
      const users = await userService.getUsers();
      res.json(users);
    } catch (err) {
      next(err)
    }
  }


  //TODO: переделать на функцию, которая принимает одного и более пользователей
  //TODO: Обязательно удалить еще связанные токены!!!
  async deleteUser(req, res, next) {
    try {
      const { email } = req.body;
      const result = await userService.delete(email);
      return res.json(result);
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new UserController();