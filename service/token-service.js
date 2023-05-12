const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, { expiresIn: '10m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '5d' });

    return {
      accessToken,
      refreshToken
    }
  }

  validateToken(token, secret) {
    try {
      const tokenData = jwt.verify(token, secret);
      return tokenData;
    } catch (err) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    // пробуем найти в базе
    // пока что на одного юзера один токен
    // если кто-то рефрешнит токен, то на другом устрйстве токен будет невалидным
    const tokenData = await tokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    // Иначе, скорее всего юзер логинется в первый раз (нет записи своего айдишника в БД)
    // Создаем
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }


  async deleteToken(refreshToken) {
    const token = await tokenModel.deleteOne({ refreshToken });
    return token;
  }


  async findToken(refreshToken) {
    const token = await tokenModel.findOne({ refreshToken });
    return token;
  }
}

module.exports = new TokenService();