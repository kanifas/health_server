const OccupationModel = require('../models/occupation-model');
const { ApiError } = require('./error.service');
const OccupationDto = require('../dtos/occupation-dto');

class OccupationService {
  async create(name) {
    const exist = await OccupationModel.findOne({ name });
    if (exist) {
      throw ApiError.BadRequest(`Такой вид деятельности "${name}" уже существует`);
    }
    const occupation = await OccupationModel.create({ name });
    const occupationDto = new OccupationDto(occupation);
    return { ...occupationDto }
  }


  async delete(id) {
    const deleteResult = await OccupationModel.findByIdAndDelete(id);
    deleteResult.statusText = `Вид деятельности "${deleteResult.name}" успешно удален`;
    return deleteResult
  }


  async fetch() {
    const occupations = await OccupationModel.find()
    if (!occupations.length) {
      return []
    }
    return occupations.map(oc => new OccupationDto(oc));
  }
}

module.exports = new OccupationService()
