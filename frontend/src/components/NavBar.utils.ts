import { expect, test } from "@playwright/test";
import type { loginMethod } from "../types"

const homePageLink = "https://fastapi-cryptopulse.vercel.app/"

const NavBarTestUnloged = async (link: string, testTitle: string) => {
  test(testTitle, async ({ page }) => {
    await page.goto(`${link}`);
    await expect(page.locator("div").nth(5)).toBeVisible();
    await expect(page.getByRole("link", { name: "CryptoPulse" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Market" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Portfolio" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Log In" })).toBeVisible();
    await expect(page.getByText("CryptoPulseMarketPortfolioLog")).toBeVisible();
    await expect(page.locator("div").nth(2)).toBeVisible();
    await expect(page.getByRole("navigation")).toBeVisible();
  });
};

const NavBarTestLoged = async (link: string = homePageLink, login: loginMethod, testTitle: string ) => {
  test(testTitle, async ({ page }) => {
    await page.goto(`${link}`);
    await expect(page.locator("div").nth(5)).toBeVisible();
    await expect(page.getByRole("link", { name: "CryptoPulse" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Market" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Portfolio" })).toBeVisible();
    await expect(page.getByText("CryptoPulseMarketPortfolioLog")).toBeVisible();
    await expect(page.getByText("Balance")).toBeVisible();
    await expect(page.getByText(/^\$\d+,\d+\.\d+$/i)).toBeVisible();
    await expect(page.getByText(`Bienvenido, ${login}`)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^Cerrar [a-zA-Z]{0, 10}$/ }),
    ).toBeVisible();
    await expect(page.locator("div").nth(2)).toBeVisible();
    await expect(page.getByRole("navigation")).toBeVisible();
  });
};

export { NavBarTestUnloged, NavBarTestLoged };
