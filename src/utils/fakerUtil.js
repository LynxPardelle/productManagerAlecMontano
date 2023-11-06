import { fakerDE as faker } from "@faker-js/faker";
export const generateUser = () => {
  let numOfProducts = faker.number.int({ min: 1, max: 7 });
  let products = [];
  for (let i = 0; i < numOfProducts; i++) {
    products.push(generateProduct());
  }
  return {
    id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.random.arrayElement(["admin", "user"]),
  };
};
export const generateProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    code: faker.commerce.productAdjective(),
    stock: faker.number.int({ min: 0, max: 100 }),
    image: faker.image.url(),
  };
};
