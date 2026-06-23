// utils/testData.js
//
// Static test data reverse-engineered from the supplied screenshots, so
// scripts assert against values that are known-correct for this catalog
// (OpenCart demo data: iMac == $122.00 / Ex Tax $100.00, etc.)

// A fresh, unique "toto" account is generated for every test run so that
// re-running the suite never collides with an account created on a
// previous run (OpenCart rejects duplicate e-mails).
const runId = Date.now();

const USER = {
  firstName: 'toto',
  lastName: 'toto',
  email: `toto.${runId}@gmail.com`,
  password: 'toto1234',
};

const ADDRESS = {
  company: '',
  address1: '23 rue paris',
  address2: '',
  city: 'Paris',
  postcode: '98000',
  country: 'France, Metropolitan',
  zone: 'Paris',
};

const PRODUCT = {
  name: 'iMac',
  model: 'Product 14',
  brand: 'Apple',
  price: '122.00',
  exTax: '100.00',
};

const ENQUIRY = 'This is a test Enquiry';

module.exports = { USER, ADDRESS, PRODUCT, ENQUIRY };
