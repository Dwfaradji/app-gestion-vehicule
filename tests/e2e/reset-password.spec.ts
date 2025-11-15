import { test, expect } from "@playwright/test";
import { prisma } from "../utils/prismaClient";
import bcrypt from "bcryptjs";
import { login, logout } from "../utils/auth";

// Full password reset flow using API + UI
// Strategy: create a temporary user, request reset, read token from DB,
// complete reset via UI, and verify login with new password. Cleanup afterwards.

test.describe("Password reset flow", () => {
  test("forgot -> reset -> login works for a temporary user", async ({ page, request }) => {
    const email = `reset.e2e+${Date.now()}@example.com`;
    const originalPassword = "TempUser!2345";
    const newPassword = "NewPass!23456";

    // Create a temporary user directly in DB
    const user = await prisma.user.create({
      data: {
        email,
        name: "Reset E2E User",
        passwordHash: await bcrypt.hash(originalPassword, 10),
        role: "USER",
        status: "APPROVED",
        mustChangePassword: false,
      },
    });

    try {
      // Request password reset via API (this sets resetToken + expiry)
      const res = await request.post("/api/auth/forgot", { data: { email } });
      expect(res.ok()).toBeTruthy();

      // Read token from DB
      const withToken = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
      expect(withToken.resetToken).toBeTruthy();
      const token = withToken.resetToken as string;

      // Visit reset page and submit new password
      await page.goto(`/reset/${token}`);
      await page.getByPlaceholder("Nouveau mot de passe").fill(newPassword);
      await page.getByPlaceholder("Confirmer le mot de passe").fill(newPassword);
      await page.getByRole("button", { name: "Mettre à jour le mot de passe" }).click();

      // After successful reset, page triggers redirect to /login after ~2.5s
      await page.waitForURL("**/login", { timeout: 10000 });
      await expect(page).toHaveURL(/\/login$/);

      // Verify that we can login with the new password
      await login(page, email, newPassword);

      // And logout to clean session
      await logout(page);
    } finally {
      // Cleanup: remove the temporary user
      await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
    }
  });
});
