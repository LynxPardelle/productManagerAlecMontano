const socket = io();
/* Products */
const urlParams = new URLSearchParams(window.location.search);
let limit = urlParams.get("limit");
const page = urlParams.get("page");
const sort = urlParams.get("sort");
const query = urlParams.get("query");
const searchType = document.getElementById("search-type");
const searchQuery = document.getElementById("search-query");
const searchSort = document.getElementById("search-sort");
const queryLabel = document.getElementById("query-label");
const limitInput = document.getElementById("limit");
if (!!sort && !!searchSort && ["asc", "desc"].includes(sort)) {
  searchSort.value = sort;
}
if (
  !!query &&
  !!searchQuery &&
  (query.includes("category") || query.includes("stock"))
) {
  if (query.includes("category")) {
    searchType.value = "category";
    searchQuery.value = query.split(":")[1].split("}")[0].replace(/"/g, "");
  } else if (query.includes("stock")) {
    if (!!queryLabel) queryLabel.innerHTML = "Disponibilidad";
    searchType.value = "disponibility";
    searchQuery.setAttribute("type", "checkbox");
    searchQuery.setAttribute("checked", !!query.includes("{$not: 0}"));
    searchQuery.value = !!query.includes("{$not: 0}") ? "on" : "off";
  }
}
if (!!limit && !!limitInput) limitInput.value = limit;
if (!!limit || !!page || !!sort || !!query) {
  socket.emit(
    "get-products",
    `filter:?${!!limit ? `limit=${limit}` : ""}${
      !!page ? `&page=${page}` : ""
    }${!!sort ? `&sort=${sort}` : ""}${!!query ? `&query=${query}` : ""}`
  );
} else {
  socket.emit("get-products", "all");
}
socket.on("send-products", (data) => {
  console.log(data);
  const body = document.querySelector("body");
  const productDiv = document.getElementById("products");
  if (!productDiv) {
    productDiv = document.createElement("div");
    productDiv.setAttribute("id", "products");
    body.appendChild(productDiv);
  }
  const pagesDiv = document.getElementById("pages");
  if (!pagesDiv) {
    pagesDiv = document.createElement("div");
    pagesDiv.setAttribute("id", "pages");
    body.appendChild(pagesDiv);
  }
  productDiv.innerHTML = "";
  pagesDiv.innerHTML = "";
  if (data.status === "success") {
    data.payload.forEach((product) => {
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
    if (data.totalPages > 1) {
      if (!!data.hasPrevPage) {
        const prevLink = document.createElement("a");
        prevLink.setAttribute("href", data.prevLink);
        prevLink.innerHTML = "Anterior";
        pagesDiv.appendChild(prevLink);
      }
      const pageElement = document.createElement("p");
      pageElement.classList.add("m-0");
      pageElement.classList.add("fw-bold");
      pageElement.innerHTML = `Página ${data.page} de ${data.totalPages}`;
      pagesDiv.appendChild(pageElement);
      if (!!data.hasNextPage) {
        const nextLink = document.createElement("a");
        nextLink.setAttribute("href", data.nextLink);
        nextLink.innerHTML = "Siguiente";
        pagesDiv.appendChild(nextLink);
      }
    }
  } else {
    productDiv.innerHTML = data.message;
  }
});
socket.on("error", (error) => {
  console.log(error);
});
/* Search with the type of search, the search as query and the sort sending the client to an url to get those queries */
const searchForm = document.getElementById("search-form");
if (!!searchForm) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchTypeValue = searchType.value;
    const searchQueryValue = searchQuery.value;
    const searchQueryChecked = searchQuery.checked;
    const searchSortValue = searchSort.value;
    console.log(
      searchTypeValue,
      searchQueryValue,
      searchQueryChecked,
      searchSortValue
    );
    window.location.href = `/products${
      !!searchTypeValue ||
      !!searchQueryValue ||
      !!searchSortValue ||
      !!page ||
      !!limit
        ? `?page=${!!page ? page : 1}${
            !!searchTypeValue && !!searchQueryValue
              ? `&query={"${
                  searchTypeValue === "disponibility"
                    ? "stock"
                    : searchTypeValue
                }":${
                  searchTypeValue === "disponibility"
                    ? `${searchQueryChecked === true ? `{$not:"0"}` : `"0"`}`
                    : `"${searchQueryValue}"`
                }}`
              : ""
          }${!!searchSortValue ? `&sort=${searchSortValue}` : ""}${
            !!limit ? `&limit=${limit}` : ""
          } `
        : ""
    }`;
  });
}
/* Change the input type of searchQuery to checkbox if the user select disponibility option in the serach-type and change the input option of search-query if the user selects the category option in the serch-type and after the changes, put the value as empty or false */
searchType.addEventListener("change", (event) => {
  if (event.target.value === "disponibility") {
    if (!!queryLabel) queryLabel.innerHTML = "Disponibilidad";
    searchQuery.setAttribute("type", "checkbox");
    searchQuery.setAttribute("checked", true);
  } else if (event.target.value === "category") {
    if (!!queryLabel) queryLabel.innerHTML = "Búsqueda";
    searchQuery.setAttribute("type", "text");
    searchQuery.setAttribute("value", "");
  }
});
if (!!limitInput) {
  limitInput.addEventListener("change", (event) => {
    limit = event.target.value > 0 ? event.target.value : 9999;
  });
}
