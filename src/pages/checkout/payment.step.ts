import type { Locator, Page } from '@playwright/test';
import { PageConstructor } from '../page.constructor.js';

export class PaymentStep extends PageConstructor {
  public readonly paymentContainer: Locator;
  public readonly confirmButton: Locator;
  public readonly paymentMethodSelect: Locator;
  public readonly creditCardNumberInput: Locator;
  public readonly cardHolderNameInput: Locator;
  public readonly expirationDateInput: Locator;
  public readonly cvvInput: Locator;
  public readonly paymentSuccessMessageAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.paymentContainer = page.locator('app-payment');
    this.confirmButton = this.paymentContainer.getByTestId('finish');
    this.paymentMethodSelect =
      this.paymentContainer.getByTestId('payment-method');
    this.creditCardNumberInput =
      this.paymentContainer.getByTestId('credit_card_number');
    this.cardHolderNameInput =
      this.paymentContainer.getByTestId('card_holder_name');
    this.expirationDateInput =
      this.paymentContainer.getByTestId('expiration_date');
    this.cvvInput = this.paymentContainer.getByTestId('cvv');
    this.paymentSuccessMessageAlert = this.paymentContainer.getByTestId(
      'payment-success-message',
    );
  }
}
