module.exports = class UserDto {
  id;
  name;
  nickname;
  email;
  phone;
  photo;
  role;
  speciality;
  location;
  settings;
  isEmailConfirmed;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.nickname = model.nickname;
    this.email = model.email;
    this.phone = model.phone;
    this.photo = model.photo;
    this.isEmailConfirmed = model.isEmailConfirmed;
    this.role = model.role;
    this.speciality = model.speciality;
    this.location = model.location;
    this.settings = {
      slotSize: model.slotSize,
      workDayFrom: model.workDayFrom,
      workDayTo: model.workDayTo,
      allowChangeAnotherCalendar: model.allowChangeAnotherCalendar,
    };      
  }
}