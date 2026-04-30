# yajs-playwright-ts

A Playwright testing automation framework built with TypeScript for end-to-end testing. This repository provides a structured setup for writing and running automated tests with Playwright.

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** (comes with Node.js)

## Installation

1. Clone the repository:

```bash
gh repo clone MilVerI/yajs-playwright-ts
```

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install --help
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory for any environment-specific configurations:

```env
# Example configuration
BASE_URL=https://example.com
```

### Playwright Configuration

Playwright configuration is defined in `playwright.config.ts`. Key settings include:

- Test directory: `tests/`
- Timeout: Configurable per test
- Browsers: Chrome, Firefox, Safari
- Reporting: HTML and trace reports

### ESLint

The project uses ESLint with TypeScript support. Configuration is in `eslint.config.ts`.

## Usage

### Running Tests

Run all tests in headed mode with Playwright UI:

```bash
npm run chromium:run:all
```

### Running Specific Tests

Run a specific test file:

```bash
npx playwright test tests/login.spec.ts
```

Run tests matching a pattern:

```bash
npx playwright test --grep "login"
```

### Debugging Tests

Run tests in debug mode:

```bash
npx playwright test --debug
```

### View Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## Project Structure

```
yajs-playwright-ts/
├── tests/                    # Test files
│   ├── example.spec.ts      # Example test suite
│   └── login.spec.ts        # Login test suite
├── playwright-report/        # Generated test reports
├── test-results/            # Test execution results
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript configuration
├── eslint.config.ts         # ESLint configuration
├── package.json             # Project dependencies
└── README.md                # This file
```

## Scripts

| Script                     | Description                                               |
| -------------------------- | --------------------------------------------------------- |
| `npm run chromium:run:all` | Run all tests in Chromium browser with headed mode and UI |

## Writing Tests

Create new test files in the `tests/` directory with the `.spec.ts` extension:

```typescript
import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('https://example.com');
  // Your test code here
});
```

## Dependencies

### Main Dependencies

- **@playwright/test**: Playwright testing framework

### Dev Dependencies

- **TypeScript**: Type checking for JavaScript
- **ESLint**: Code linting
- **dotenv**: Environment variable management
- **@stylistic/eslint-plugin**: Code style linting

## License

ISC
