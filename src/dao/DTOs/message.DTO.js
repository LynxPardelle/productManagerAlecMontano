export default class MessageDTO {
  constructor(message) {
    this.email = message.email ?? "Unknow";
    this.date = message.date ?? new Date();
    this.message = message.message ?? "Unknow";
  }
}
