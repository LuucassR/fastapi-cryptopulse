import { expect, test } from "@playwright/test";

test("check search bar functionality", async ({ page }) => {
  await page.goto("https://fastapi-cryptopulse.vercel.app/market");

  await expect(
    page.getByText("Bitcoin", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Monero", {
      exact: true,
    }),
  ).toBeVisible();

  await expect(page.getByRole("textbox")).toBeVisible();

  await page.getByRole("textbox").fill("meme");

  await expect(
    page.getByText("Memecoin", {
      exact: true,
    }),
  ).toBeVisible();
});

test("Link go to respective crypto", async ({ page }) => {
  await page.goto("https://fastapi-cryptopulse.vercel.app/market");

  await expect(page.getByText("Ethereum", { exact: true })).toBeVisible();

  expect(page.getByRole("link", { name: "#2 Ethereum ETH" })).toBeVisible();

  await page.getByRole("link", { name: /^#2 /i }).click();

  await expect(page).toHaveURL(
    "https://fastapi-cryptopulse.vercel.app/coins/eth-ethereum",
  );

  await expect(page.getByRole("img")).toBeVisible();

  await expect(page.getByPlaceholder("0.00")).toBeVisible();

  expect(page.getByText("estado")).toBeVisible();
  expect(page.getByText("#2")).toBeVisible();
});
