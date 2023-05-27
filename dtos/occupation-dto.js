module.exports = class OccupationDto {
  id;
  name;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
  }
}
