import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://fastapi-cryptopulse.vercel.app/");

  await expect(page).toHaveTitle("frontend");
});

test("check redirect", async ({ page }) => {
  await page.goto("https://fastapi-cryptopulse.vercel.app/");

  await page.getByRole("link", { name: "Explorar Monedas" }).click();
  
  await expect(page).toHaveURL("https://fastapi-cryptopulse.vercel.app/market");
  
});

test("check NavBar", async ({ page }) => {
  await page.goto("https://fastapi-cryptopulse.vercel.app/market")
  
  await expect(page.getByRole("link", { name: "Sign Up" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Log In" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Portfolio" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Market" })).toBeVisible();
})
