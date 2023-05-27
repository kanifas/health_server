const occupationService = require('../service/occupation-service');
const { ApiError } = require('../service/error.service');

class OccupationController {
  async createOccupation(req, res, next) {
    const name = req.body.name.trim().replace(/\s{2,}/g, ' ').toLowerCase();
    try {
      const result = await occupationService.create(name);
      return res.json(result);
    } catch (err) {
      next(err)
    }
  }


  async deleteOccupation(req, res, next) {
    try {
      const result = await occupationService.delete(req.body.id);
      return res.json(result);
    } catch (err) {
      next(err)
    }
  }


  async getOccupations(req, res, next) {
    try {
      const result = await occupationService.fetch();
      res.json(result);
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new OccupationController();
