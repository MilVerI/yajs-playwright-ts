
import type { Locator, Page } from '@playwright/test';
import { PageConstructor } from '../page.constructor.js';

export class BillingAddressStep extends PageConstructor {
  public readonly proceedToCheckoutButton: Locator;
  public readonly bullingAddressContainer: Locator;
  public readonly countrySelect: Locator;
  public readonly postalCodeInput: Locator;
  public readonly houseNumberInput: Locator;
  public readonly cityInput: Locator;
  public readonly streetInput: Locator;
  public readonly stateInput: Locator;

  constructor(page: Page) {
    super(page);
    this.bullingAddressContainer = page.locator('app-address');
    this.countrySelect = this.bullingAddressContainer.getByTestId('country');
    this.postalCodeInput =
      this.bullingAddressContainer.getByTestId('postal_code');
    this.houseNumberInput =
      this.bullingAddressContainer.getByTestId('house_number');
    this.proceedToCheckoutButton =
      this.bullingAddressContainer.getByTestId('proceed-3');
    this.cityInput = this.bullingAddressContainer.getByTestId('city');
    this.streetInput = this.bullingAddressContainer.getByTestId('street');
    this.stateInput = this.bullingAddressContainer.getByTestId('state');
  }
}
