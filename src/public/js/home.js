const socket = io();
socket.emit("message", "Hello World!");
socket.on("message", (data) => {
  console.log(data);
});
socket.on("evento_para_todos_menos_el_socket_actual", (data) => {
  console.log(data);
});
socket.on("evento_para_todos", (data) => {
  console.log(data);
});
/* Products */
socket.emit("get-products", "all");
socket.on("send-products", (data) => {
  console.log(data);
  const productDiv = document.getElementById("products");
  if (!productDiv) {
    const body = document.querySelector("body");
    productDiv = document.createElement("div");
    productDiv.setAttribute("id", "products");
    body.appendChild(productDiv);
  }
  productDiv.innerHTML = "";
  if (data.status === "success") {
    data.data.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.innerHTML = `
      <h3>${product.title}</h3>
      <p>Descripción: ${product.description}</p>
      <p>Precio: $${product.price}</p>
      <p>Cantidad: ${product.stock}</p>
      <p>Categoría: ${product.category}</p>
      ${!!product.thumbnail ? `<p>${product.thumbnail}</p>` : ""}
      `;
      productDiv.appendChild(productElement);
    });
  } else {
    productDiv.innerHTML = data.message;
  }
});
socket.on("error", (error) => {
  console.log(error);
});
