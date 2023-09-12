/* Get carritoId from local Storage */
let carritoId = localStorage.getItem("carritoId");
const uParams = new URLSearchParams(window.location.search);
let cartId = uParams.get("cartId");
if (!!cartId) {
  carritoId = cartId;
}
getCart();
async function createCart() {
  if (!carritoId) {
    let cart = await fetch("http://localhost:8080/api/carts/", {
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
      `http://localhost:8080/api/carts/${carritoId}/product/${pid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!cartUpdated.status === 200) throw new Error("Error updating cart");
    cartUpdated = await cartUpdated.json();
    getCart();
  } catch (error) {
    console.error(error);
  }
}
async function deleteProductFromCart(pid) {
  try {
    let cartUpdated = await fetch(
      `http://localhost:8080/api/carts/${carritoId}/product/${pid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!cartUpdated.status === 200) throw new Error("Error updating cart");
    cartUpdated = await cartUpdated.json();
    getCart();
  } catch (error) {
    console.error(error);
  }
}
async function getCart() {
  createCart();
  try {
    let cart = await fetch(`http://localhost:8080/api/carts/${carritoId}`);
    if (!cart.status === 200) throw new Error("Error getting cart");
    cart = await cart.json();
    console.log(cart);
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
          </ul>`;
    }
  } catch (error) {
    console.error(error);
  }
}
