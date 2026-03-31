import { expect, test } from "@playwright/test";
import { NavBarTestUnloged, NavBarTestLoged } from "../components/NavBar.utils";
import dotenv from "dotenv";

dotenv.config();

const testerEmail = process.env.VITE_TESTER_EMAIL;
const testerPasswd = process.env.VITE_TESTER_PASSWORD;
const testerUsername = process.env.VITE_TESTER_USERNAME;

const link: string = "https://fastapi-cryptopulse.vercel.app/login";
test.describe("page functionallity", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(link);
  });

  test("check page existense", async ({ page }) => {
    await expect(page).toHaveURL(link);
    await expect(page.getByPlaceholder("Elon@tesla.com")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign-In with username" }),
    ).toBeVisible();
  });
  NavBarTestUnloged(link, "Check NavBar of user who don't log in");

  test.describe("login functionallity", async () => {
    test("login with email", async ({ page }) => {
      await expect(page).toHaveURL(link);

      await page.getByPlaceholder("Elon@tesla.com").fill(testerEmail!);
      await page.getByPlaceholder("••••••••").fill(testerPasswd!);
      await page.getByRole("button", { name: "Sign In" }).click();

      await page.waitForURL("https://fastapi-cryptopulse.vercel.app/login", {
        timeout: 10000,
      });

      await expect(page).toHaveURL(
        "https://fastapi-cryptopulse.vercel.app/login",
      );
    });

    // Check if NavBar of logged user with gmail is correct
    NavBarTestLoged(
      link,
      { gmail: testerEmail! },
      "Check NavBar of user logged with gmail",
    );

    test("login with username functionallity", async ({ page }) => {
      await expect(page).toHaveURL(link);

      // Logout current user
      await page.getByText("Cerrar Sesión").click();

      // Check to Login with username instead of gmail
      await page.getByRole("button", { name: "Sign-In with username" }).click();

      await page.getByPlaceholder("Elon_Pulse").fill(testerUsername!);
      await page.getByPlaceholder("••••••••").fill(testerPasswd!);
      await page.getByRole("button", { name: "Sign In" }).click();

      await expect(page).toHaveURL("https://fastapi-cryptopulse.vercel.app/");
    });

    // Check if NavBar of logged user with username is correct
    NavBarTestLoged(
      link,
      { username: testerUsername! },
      "Check NavBar of user logged with usernanme",
    );
  });
});
