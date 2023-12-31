export default class UserDTO {
  constructor(user) {
    this.id = user.id ?? 0;
    this.first_name = user.first_name ?? "Unknow";
    this.last_name = user.last_name ?? "Unknow";
    this.email = user.email ?? "Unknow";
    this.age = user.age ?? 0;
    this.password = user.password ?? "Unknow";
    this.role = user.role ?? "Unknow";
    this.documents = user.documents ?? [];
    this.last_connection = user.last_connection ?? Date.now();
  }
}
