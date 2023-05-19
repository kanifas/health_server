const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserModel = require('../models/user-model');
const SpecialityModel = require('../models/speciality-model');
const mailService = require('./mail.service');
const tokenService = require('./token-service');
const { ApiError } = require('./error.service');
const UserDto = require('../dtos/user-dto');
const { validationResult } = require('express-validator');
const { roles } = require('../constants')

class UserService {
  async signup({name, nickname, email, password, phone, location, speciality, role = roles.USER}) {
    const allUsers = await UserModel.find();

    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
    }

    // const foundSpeciality = await SpecialityModel.findOne({ name: speciality });
    // let newSpeciality;
    // if (!foundSpeciality) {
    //   newSpeciality = await SpecialityModel.create({ name: speciality })
    // }

    // console.log(newSpeciality);

    const hashedPassword = await bcrypt.hash(password, 5);
    const signupConfirmLink = uuid.v4();

    const user = await UserModel.create({
      name,
      nickname,
      email,
      phone,
      password: hashedPassword,
      signupConfirmLink,
      location,
      //speciality: newSpeciality,
      speciality,
      role: allUsers.length === 0 ? roles.SUPER : role,
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


  async fetchUsers() {
    const users = await UserModel.find();
    const normalizedUsers = users.map((u) => new UserDto(u))
    return normalizedUsers
  }


  async deleteUser(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw ApiError.BadRequest(`Такого пользователя нет`);
    }

    const result = await UserModel.findByIdAndDelete(id);
    result.statusText = `Пользователь успешно удален`;
    return result
  }
  
  
  async updateUser(id, rest) {
    const updateResult = await UserModel.findByIdAndUpdate(id, {...rest});

    if (!updateResult) {
      throw ApiError.BadRequest(`Пользователь не найден`);
    }
    return updateResult
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