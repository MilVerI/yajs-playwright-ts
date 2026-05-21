import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page.js';
import { HeaderFragment } from '../page_fragments/header.fragment.js';
import { CartStep } from './cart.step.js';
import { SignInStep } from './signIn.step.js';
import { BillingAddressStep } from './billingAddress.step.js';
import { PaymentStep } from './payment.step.js';

export class CheckoutPage extends BasePage {
  protected readonly url = '/checkout';
  public readonly header: HeaderFragment;
  readonly cart: CartStep;
  public readonly currentStepLabel: Locator;
  public readonly currentStepIndicator: Locator;
  readonly signIn: SignInStep;
  readonly billingAddress: BillingAddressStep;
  readonly payment: PaymentStep;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderFragment(page);
    this.cart = new CartStep(page);
    this.signIn = new SignInStep(page);
    this.billingAddress = new BillingAddressStep(page);
    this.payment = new PaymentStep(page);
    this.currentStepLabel = page.locator(
      'aw-wizard-navigation-bar ul li.current .label',
    );
    this.currentStepIndicator = page.locator(
      'aw-wizard-navigation-bar ul li.current .step-indicator',
    );
  }
}
