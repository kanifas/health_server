const SpecialityModel = require('../models/speciality-model');
const { ApiError } = require('./error.service');
const SpecialityDto = require('../dtos/speciality-dto');

class SpecialityService {
  async create(name) {
    // const normalizedUsers;
    const candidate = await SpecialityModel.findOne({ name });
    if (candidate) {
      throw ApiError.BadRequest(`Специализация "${name}"" уже существует`);
    }
    const speciality = await SpecialityModel.create({ name });
    const specialityDto = new SpecialityDto(speciality);
    return { speciality: specialityDto }
  }


  async update(id, name) {
    const speciality = await SpecialityModel.findOne({ id });
    if (!speciality) {
      throw ApiError.BadRequest('Такой специальности нет');
    }
    const oldName = speciality.name;
    speciality.name = name;
    const saveResult = await speciality.save();
    saveResult.statusText = `Специальность "${oldName}" успешно изменена на "${name}"`
  }


  async delete(id) {
    const speciality = await SpecialityModel.findOne({ id });
    if (!speciality) {
      throw ApiError.BadRequest(`Такой специальности нет`);
    }
    const deleteResult = await SpecialityModel.deleteOne({ id });
    result.statusText = `Специальность ${deleteResult.name} успешно удалена`;
    return result
  }


  async fetch() {
    const specialities = await SpecialityModel.find();
    return specialities
  }
}

module.exports = new SpecialityService()
