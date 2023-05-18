const specialityService = require('../service/speciality-service');
const { ApiError } = require('../service/error.service');

class SpecialityController {
  async createSpeciality(req, res, next) {
    try {
      const result = await specialityService.create(req.body.name);
      return res.json(result);
    } catch (err) {
      next(err)
    }
  }


  async updateSpeciality(req, res, next) {
    try {
      const { id, name } = req.body;
      const result = await specialityService.update(id, name);
      return res.json(result);
    } catch (err) {
      next(err)
    }
  }


  async deleteSpeciality(req, res, next) {
    try {
      const result = await specialityService.delete(req.body.id);
      return res.json(result);
    } catch (err) {
      next(err)
    }
  }


  async getSpecialities(req, res, next) {
    try {
      const result = await specialityService.fetch();
      res.json(result);
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new SpecialityController();
