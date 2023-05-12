const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserModel = require('../models/user-model');
const mailService = require('./mail.service');
const tokenService = require('./token-service');
const { ApiError } = require('./error.service');
const UserDto = require('../dtos/user-dto');
const { validationResult } = require('express-validator');

class UserService {
  async signup(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const signupConfirmLink = uuid.v4();

    const user = await UserModel.create({
      email,
      password: hashedPassword,
      signupConfirmLink,
    });

    await mailService.sendConfirmationMail(
      email,
      `${process.env.API_URL}:${process.env.SERVER_PORT}/api/signup/confirm/${signupConfirmLink}`
    );

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens,  user: userDto }
  }


  async signupConfirm(signupConfirmLink) {
    const user = await UserModel.findOne({ signupConfirmLink })
    if (!user) {
      throw ApiError.BadRequest('Некорректная ссылка активации');
    }
    user.isEmailConfirmed = true;
    await user.save();
  }


  async signin(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`Нет пользователя с почтовым адресом ${email}`);
    }

    const isPasswordEquals = await bcrypt.compare(password, user.password);

    if (!isPasswordEquals) {
      throw ApiError.BadRequest('Неверный пароль')
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens,  user: userDto }
  }

  
  async logout(refreshToken) {
    const result = await tokenService.deleteToken(refreshToken);
    return result
  }


  async getUsers() {
    const users = await UserModel.find();
    return users
  }


  async delete(email) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest(`Такого пользователя (${email}) не существует`);
    }

    const result = await UserModel.deleteOne({ email });
    result.statusText = `Пользователь ${email} успешно удален`;
    /*
      {
        acknowledged: true,
        deletedCount: 1,
        statusText: "Пользователь EMAIL успешно удален"
      }
    */
    return result
  }


  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateToken(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens,  user: userDto }
  }
}

module.exports = new UserService()