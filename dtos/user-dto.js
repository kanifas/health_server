module.exports = class UserDto {
  id;
  name;
  email;
  phone;
  photo;
  role;
  occupation;
  location;
  settings;
  isEmailConfirmed;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.email = model.email;
    this.phone = model.phone;
    this.photo = model.photo;
    this.isEmailConfirmed = model.isEmailConfirmed;
    this.role = model.role;
    this.occupation = model.occupation.map(oc => ({
      id: oc.id,
      name: oc.name
    }));
    this.location = model.location;
    this.settings = {
      slotSize: model.slotSize,
      workDayFrom: model.workDayFrom,
      workDayTo: model.workDayTo,
      allowChangeAnotherCalendar: model.allowChangeAnotherCalendar,
    };      
  }
}