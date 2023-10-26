export default class UserDTO {
  constructor(user) {
    this.id = user.id ?? 0;
    this.first_name = user.first_name ?? "Unknow";
    this.last_name = user.last_name ?? "Unknow";
    this.email = user.email ?? "Unknow";
    this.password = user.password ?? "Unknow";
    this.role = user.role ?? "Unknow";
  }
}
