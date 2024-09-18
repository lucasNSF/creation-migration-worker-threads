function createProduct() {
  const productNames = [
    "iOS phone",
    "Notebook",
    "Android phone",
    "TV",
    "Smart TV",
  ];

  const prices = [199.99, 250.45, 124.99, 599.99, 1000, 2999.99];

  return {
    name: productNames[Math.floor(Math.random() * productNames.length)],
    amount: 100,
    description: "A great product!",
    price: prices[Math.floor(Math.random() * prices.length)],
  };
}

export { createProduct };
