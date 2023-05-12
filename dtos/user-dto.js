module.exports = class UserDto {
  id;
  email;
  isEmailConfirmed;

  constructor(model) {
    this.id = model._id;
    this.email = model.email;
    this.isEmailConfirmed = model.isEmailConfirmed;
  }
}