import chai from "chai";
import supertest from "supertest";
import config from "../src/config/config.js";

const expect = chai.expect;
const requester = supertest(`http://localhost:${config.port}`);

describe("Testing Product Manager", () => {
  let products = [];
  let cookie;
  let reqSession;
  describe("Test de Sesiones", () => {
    const userMock = {
      first_name: "Test User",
      last_name: "Tester",
      email: "test@tester.com",
      age: 20,
      password: "test2021",
      role: "admin",
    };
    it("El endpoint POST /api/users/register debe registrar un usuario correctamente", async () => {
      const { statusCode, ok, body } = await requester
        .post("/api/users/register-test")
        .send(userMock);
      expect(ok).to.eqls(true);
      expect(statusCode).to.eqls(200);
    });
    it("El endpoint POST /api/users/login debe loguear un usuario correctamente", async () => {
      const result = await requester
        .post("/api/users/login-test")
        .send({ email: userMock.email, password: userMock.password });
      /* This request will give me a redirection, but I need to put the data that comes from req.session.user into reqSession */
      const cookieResult = result.headers["set-cookie"][0];
      cookie = {
        name: cookieResult.split(";")[0].split("=")[0],
        value: cookieResult.split(";")[0].split("=")[1],
      };
      expect(cookieResult).to.be.ok;
      expect(result.ok).to.eqls(true);
      expect(result.statusCode).to.eqls(200);
      expect(result.body).to.have.property("data");
      expect(result.body.data).to.have.property("first_name");
      expect(result.body.data.first_name).to.eqls(userMock.first_name);
      expect(result.body.data).to.have.property("last_name");
      expect(result.body.data.last_name).to.eqls(userMock.last_name);
      expect(result.body.data).to.have.property("email");
      expect(result.body.data.email).to.eqls(userMock.email);
      expect(result.body.data).to.have.property("age");
      expect(result.body.data.age).to.eqls(userMock.age);
      reqSession = result.body.data;
    });
  });
  describe("Test de Productos", () => {
    let productMockIds = [];
    it("El endpoint GET /api/products debe devolver todos los productos en un arreglo", async () => {
      const { statusCode, ok, body } = await requester.get("/api/products");
      expect(ok).to.eqls(true);
      expect(statusCode).to.eqls(200);
      expect(body).to.have.property("data");
      expect(body.data).to.have.property("docs");
      expect(body.data.docs).to.be.an("array");
      products = body.data;
    });
    /* 
    FIXME: los siguientes tests no funcionan porque no se puede acceder a la ruta sin estar logueado.
    it("El endpoint POST /api/products debe crear un producto correctamente", async () => {
      const productMock = {
        name: "Mascota de prueba 1",
        price: 100,
        description: "Un producto de prueba",
        code: "1234",
        stock: 10,
        image: "https://www.google.com",
        owner: "admin",
      };
      const { statusCode, ok, body } = await requester
        .post("/api/products")
        .send(productMock);
      console.log(statusCode);
      console.log(ok);
      console.log(body);
      expect(ok).to.eqls(true);
      expect(statusCode).to.eqls(200);
      expect(body).to.have.property("data");
      expect(body.data).to.have.property("_id");
      productMockIds.push(body.data._id);
    });
    it("El método PUT debe poder actualizar correctamente a un producto determinado.", async () => {
      const productMock = {
        name: "Mascota de prueba 2",
        price: 100,
        description: "Un producto de prueba",
        code: "1234",
        stock: 10,
        image: "https://www.google.com",
        owner: "admin",
        category: "Pets",
      };
      const { body } = await requester.post("/api/products").send(productMock);
      expect(body).to.have.property("data");
      expect(body.data).to.have.property("_id");
      const result = await requester
        .put(`/api/products/${body.data._id}`)
        .send({
          name: "Mascota de prueba 2.5",
          price: 100,
          description: "Un producto de prueba",
          code: "1234",
          stock: 10,
          image: "https://www.google.com",
          owner: "admin",
          category: "Pets",
        });
      expect(result.body.status).is.to.eqls("success");
      expect(result.statusCode).is.eqls(200);
      expect(result.body).to.have.property("data");
      expect(result.body.data).to.have.property("_id");
      productMockIds.push(result.body.data._id);
    });
    it("El método DELETE debe poder eliminar correctamente a un producto determinado.", async () => {
      for (let i = 0; i < productMockIds.length; i++) {
        const { body, statusCode, ok } = await requester.delete(
          `/api/products/${productMockIds[i]}`
        );
        expect(ok).to.eqls(true);
        expect(statusCode).to.eqls(200);
        expect(body).to.have.property("data");
        expect(body.data).to.have.property("_id");
        expect(body.data._id).to.eqls(productMockIds[i]);
      }
    }); */
  });
  /* 
  FIXME: los siguientes tests no funcionan porque no se puede acceder a la ruta sin estar logueado.
  describe("Test de Carrito", () => {
    let cartId;
    it("El endpoint POST /api/carts debe crear un carrito correctamente", async () => {
      const { statusCode, ok, body } = await requester.post("/api/carts");
      expect(ok).to.eqls(true);
      expect(statusCode).to.eqls(200);
      expect(body).to.have.property("data");
      expect(body.data).to.have.property("_id");
      cartId = body.data._id;
    });
    it("El endpoint POST /api/carts/:cid/products/:pid debe agregar un producto al carrito correctamente", async () => {
      const { body } = await requester.post(
        `/api/carts/${cartId}/products/${products[0]._id}`
      );
      expect(body).to.have.property("data");
      expect(body.data).to.have.property("_id");
      expect(body.data).to.have.property("products");
      expect(body.data.products).to.be.an("array");
      expect(body.data.products[0]).to.have.property("product");
      expect(body.data.products[0].product).to.have.property("_id");
      expect(body.data.products[0].product._id).to.eqls(products[0]._id);
    });
    it("El endpoint GET /api/carts/:cid debe devolver un carrito correctamente", async () => {
      const { body } = await requester.get(`/api/carts/${cartId}`);
      expect(body).to.have.property("data");
      expect(body.data).to.have.property("_id");
      expect(body.data._id).to.eqls(cartId);
      expect(body.data).to.have.property("products");
      expect(body.data.products).to.be.an("array");
      expect(body.data.products[0]).to.have.property("product");
      expect(body.data.products[0].product).to.have.property("_id");
      expect(body.data.products[0].product._id).to.eqls(products[0]._id);
    });
  }); */
});
