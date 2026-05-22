import type { Page } from '@playwright/test';
import { HomePage } from './home.page.js';
import { LoginPage } from './login.page.js';
import { ProductPage } from './product.page.js';
import { CheckoutPage } from './checkout/checkout.page.js';
import { AccountPage } from './account.page.js';

export class AllPages {
  homePage: HomePage;
  loginPage: LoginPage;
  productPage: ProductPage;
  checkoutPage: CheckoutPage;
  accountPage: AccountPage;

  constructor(page: Page) {
    this.homePage = new HomePage(page);
    this.loginPage = new LoginPage(page);
    this.productPage = new ProductPage(page);
    this.checkoutPage = new CheckoutPage(page);
    this.accountPage = new AccountPage(page);
  }
}
