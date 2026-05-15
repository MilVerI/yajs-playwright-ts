import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base.page.js';
import { HeaderFragment } from '../page_fragments/header.fragment.js';
import { CartStep } from './cart.step.js';

export class CheckoutPage extends BasePage {
  protected readonly url = '/checkout';
  public readonly header: HeaderFragment;
  readonly cart: CartStep;
  public readonly currentStepLabel: Locator;
  public readonly currentStepIndicator: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderFragment(page);
    this.cart = new CartStep(page);
    this.currentStepLabel = page.locator(
      'aw-wizard-navigation-bar ul li.current .label',
    );
    this.currentStepIndicator = page.locator(
      'aw-wizard-navigation-bar ul li.current .step-indicator',
    );
  }
}
