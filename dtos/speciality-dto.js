module.exports = class SpecialityDto {
  id;
  name;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
  }
}