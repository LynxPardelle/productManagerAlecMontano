let carritoId = localStorage.getItem("carritoId");
const uParams = new URLSearchParams(window.location.search);
let cartId = uParams.get("cartId");
if (!!cartId) {
  carritoId = cartId;
}
let purchased = false;
let purchasedInfo = {};
let fullCart = {};
getCart();
async function createCart() {
  if (!carritoId) {
    let cart = await fetch(window.location.origin + "/api/carts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    if (!cart.status === 200) throw new Error("Error creating cart");
    cart = await cart.json();
    carritoId = cart.data._id;
    localStorage.setItem("carritoId", carritoId);
  }
}
async function addProductToCart(pid) {
  try {
    let cartUpdated = await fetch(
      `${window.location.origin}/api/carts/${carritoId}/product/${pid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!cartUpdated.status === 200) throw new Error("Error updating cart");
    cartUpdated = await cartUpdated.json();
    console.log(cartUpdated);
    if (cartUpdated.status === "error") throw new Error(cartUpdated.message);
    getCart("add", pid);
  } catch (error) {
    console.error(error);
  }
}
async function deleteProductFromCart(pid) {
  try {
    let cartUpdated = await fetch(
      `${window.location.origin}/api/carts/${carritoId}/product/${pid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!cartUpdated.status === 200) throw new Error("Error updating cart");
    cartUpdated = await cartUpdated.json();
    if (cartUpdated.status === "error") throw new Error(cartUpdated.message);
    getCart("delete", pid);
  } catch (error) {
    console.error(error);
  }
}
async function getCart(type = undefined, pid = undefined) {
  createCart();
  try {
    let cart = await fetch(`${window.location.origin}/api/carts/${carritoId}`);
    if (!cart.status === 200) throw new Error("Error getting cart");
    cart = await cart.json();
    console.log(cart);
    fullCart = cart.data;
    /* Search for cart-show element if not cart-show element, create an button in body with position-absolute top-0 and end-0 classes to go to /cart/:id route */
    let cartShow = document.getElementById("cart-show");
    if (!cartShow) {
      const body = document.getElementsByTagName("body")[0];
      const cartButton = document.createElement("button");
      cartButton.classList.add("btn");
      cartButton.classList.add("btn-dark");
      cartButton.classList.add("position-fixed");
      cartButton.classList.add("bottom-0");
      cartButton.classList.add("end-0");
      cartButton.innerHTML = "Ver Carrito";
      cartButton.addEventListener("click", () => {
        window.location.href = `/cart?carId=${carritoId}`;
      });
      body.appendChild(cartButton);
    } else {
      cartShow.innerHTML = `<h2 class="text-center">Carrito</h2>
        <ul class="list-group">
          ${cart.data.products.map(
            (product) =>
              `<li class="list-group-item">
                Producto: ${product.product.title}
                <br/>
                Cantidad: ${product.quantity}
                <br />
                <button onclick="addProductToCart('${product.product._id}')" class="btn btn-dark">+</button>
                <button onclick="deleteProductFromCart('${product.product._id}')" class="btn btn-dark">-</button>
              </li>`
          )}
          </ul>
          <button id="purchase-button" class="btn btn-success text-light d-block mx-auto my-3"
          >Comprar</button>${
            purchased
              ? `<div class="alert alert-success" role="alert">
            Compra realizada con éxito!
          </div>${
            !!purchasedInfo?.data?.ticket
              ? `<div class="alert alert-success" role="alert">
            Ticket: ${purchasedInfo.data.ticket._id}
          </div>
          <div class="alert alert-success" role="alert">
            Código: ${purchasedInfo.data.ticket.code}
            </div>
            <div class="alert alert-success" role="alert">
            Fecha: ${purchasedInfo.data.ticket.purchase_datetime}
            </div>
            <div class="alert alert-success" role="alert">
            Monto: ${purchasedInfo.data.ticket.amount}
            </div>`
              : ""
          }${
                  !!purchasedInfo?.data?.notPurchasedProducts &&
                  purchasedInfo.data.notPurchasedProducts.length > 0
                    ? `<div class="alert alert-danger" role="alert">
            Productos no comprados: <ul class="list-group">
            ${purchasedInfo.data.notPurchasedProducts.map(
              (product) => `<li class="list-group-item">
              ${product.product.title}
              </li>
              `
            )}
            </ul>
              La razón de esto es que no hay stock suficiente para estos productos.
          </div>`
                    : ""
                }`
              : ""
          }`;
      setTimeout(() => {
        let purchaseButton = document.getElementById("purchase-button");
        if (!!purchaseButton) {
          purchaseButton.addEventListener("click", () => {
            console.log("Comprando");
            purchaseCart();
          });
        }
      }, 100);
    }
    if (type && pid && (type === "add" || type === "delete")) {
      let product = fullCart.products.find(
        (product) => product.product._id === pid
      );
      if (alertPlaceholder) alertPlaceholder.innerHTML = "";
      if (product) {
        console.log("product", product);
        appendAlert(
          `
        ¡Has ${type === "add" ? "agregado" : "quitado"} un producto ${
            type === "add" ? "al" : "del"
          } carrito!
        <br/>
        Producto: ${product.product.title}
        <br/>
        Cantidad: ${product.quantity}
        <br/>
        <button onclick="addProductToCart('${
          product.product._id
        }')" class="btn btn-dark">Agregar 1</button>
        <button onclick="deleteProductFromCart('${
          product.product._id
        }')" class="btn btn-dark">Eliminar 1</button>
        `,
          type === "add" ? "success" : "danger"
        );
      } else {
        appendAlert(
          `
        ¡Has eliminado un producto del carrito!
        `,
          "danger"
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function purchaseCart() {
  try {
    let purchase = await fetch(
      `${window.location.origin}/api/carts/${carritoId}/purchase`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(purchase);
    if (!purchase.status === 200) throw new Error("Error updating cart");
    purchase = await purchase.json();
    purchased = true;
    purchasedInfo = purchase;
    console.log(purchase);
    getCart();
  } catch (error) {
    console.error(error);
  }
}

const alertPlaceholder = document.getElementById("cartAlerts");
const appendAlert = (message, type) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  alertPlaceholder.append(wrapper);
};
