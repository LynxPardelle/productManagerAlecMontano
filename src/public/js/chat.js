const socket = io();
let loggedInUser = "";
socket.emit("get-messages", 10);
socket.on("send-messages", (data) => {
  console.log(data);
  const messagesDiv = document.getElementById("messages");
  if (!messagesDiv) {
    const body = document.querySelector("body");
    messagesDiv = document.createElement("div");
    messagesDiv.setAttribute("id", "messages");
    body.appendChild(messagesDiv);
  }
  messagesDiv.innerHTML = "";
  if (data.status === "success") {
    data.data.forEach((message) => {
      const messageElement = document.createElement("div");
      messageElement.innerHTML = `
      <p>${message.user} - ${parseDate(message.date)}</p>
      <p>${message.message}</p>
      `;
      messagesDiv.appendChild(messageElement);
    });
  } else {
    messagesDiv.innerHTML = data.message;
  }
});
socket.on("error", (error) => {
  console.log(error);
});
let userDisabled = false;
let submitDisabled = true;
const form = document.getElementById("form");
const inputUser = document.getElementById("inputUser");
const inputMessage = document.getElementById("inputMessage");
const submitButton = document.getElementById("submitButton");
const changeUserButton = document.getElementById("changeUserButton");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  if (!inputUser.attributes.getNamedItem("disabled"))
    inputUser.setAttribute("disabled", true);
  console.log(data);
  data.date = new Date().toLocaleString();
  if (loggedInUser !== data.user) {
    loggedInUser = data.user;
    socket.emit("user-join", data);
  }
  socket.emit("new-message", data);
});
inputUser.addEventListener("change", (event) => {
  console.log(event.target.value);
  if (event.target.value.length < 0) {
    userDisabled = false;
    if (inputUser.attributes.getNamedItem("disabled"))
      inputUser.attributes.removeNamedItem("disabled");
  } else if (inputMessage.value.length > 0) {
    submitDisabled = false;
    if (submitButton.attributes.getNamedItem("disabled"))
      submitButton.attributes.removeNamedItem("disabled");
  } else {
    submitDisabled = true;
    if (!submitButton.attributes.getNamedItem("disabled"))
      submitButton.setAttribute("disabled", true);
  }
});
inputMessage.addEventListener("change", (event) => {
  console.log(event.target.value);
  if (event.target.value.length < 0) {
    submitDisabled = true;
    if (!submitButton.attributes.getNamedItem("disabled"))
      submitButton.setAttribute("disabled", true);
  } else if (inputUser.value.length > 0) {
    submitDisabled = false;
    if (submitButton.attributes.getNamedItem("disabled"))
      submitButton.attributes.removeNamedItem("disabled");
  }
});
changeUserButton.addEventListener("click", (event) => {
  event.preventDefault();
  userDisabled = false;
  if (inputUser.attributes.getNamedItem("disabled"))
    inputUser.attributes.removeNamedItem("disabled");
});
socket.on("send-message", (data) => {
  console.log(data);
  const messagesDiv = document.getElementById("messages");
  if (!messagesDiv) {
    const body = document.querySelector("body");
    messagesDiv = document.createElement("div");
    messagesDiv.setAttribute("id", "messages");
    body.appendChild(messagesDiv);
  }
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `
    <p>${data.data.user} - ${parseDate(data.data.date)}</p>
    <p>${data.data.message}</p>
    `;
  messagesDiv.appendChild(messageElement);
});
function parseDate(date) {
  let parsedDate = new Date(date);
  return `${parsedDate.getDate()}/${parsedDate.getMonth()}/${parsedDate.getFullYear()} ${parsedDate.getHours()}:${parsedDate.getMinutes()}:${parsedDate.getSeconds()}`;
}
