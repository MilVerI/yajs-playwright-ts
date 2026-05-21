import { PaymentMethods } from '@enums/paymentMethods.js';
import { config } from 'dotenv';

config({ path: '.env.local' });

export const validCustomer = {
  fullName: process.env.VALID_CUSTOMER_FULL_NAME as string,
  email: process.env.VALID_CUSTOMER_EMAIL as string,
  password: process.env.VALID_CUSTOMER_PASSWORD as string,
  country: 'Austria',
  countryCode: 'AT',
  postalCode: '00000',
  houseNumber: '11',
  paymentMethod: PaymentMethods.CREDIT_CARD,
  cardNumber: '1111-1111-1111-1111',
  cardHolderName: process.env.VALID_CUSTOMER_FULL_NAME as string,
  expirationDate: new Date(
    new Date().setMonth(new Date().getMonth() + 3),
  ).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' }),
  cvv: '111',
};
