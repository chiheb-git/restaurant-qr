import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, qrCodesTable } from "@workspace/db";
import QRCode from "qrcode";

const router: IRouter = Router();

function formatQr(q: typeof qrCodesTable.$inferSelect) {
  return {
    id: q.id,
    label: q.label,
    targetUrl: q.targetUrl,
    pngBase64: q.pngBase64,
    createdAt: q.createdAt.toISOString(),
  };
}

router.get("/qr", async (req, res): Promise<void> => {
  const [qr] = await db
    .select()
    .from(qrCodesTable)
    .orderBy(desc(qrCodesTable.createdAt))
    .limit(1);
  if (!qr) {
    res.status(404).json({ error: "No QR code found" });
    return;
  }
  res.json(formatQr(qr));
});

router.post("/qr/generate", async (req, res): Promise<void> => {
  const menuUrl = process.env.MENU_URL ?? "https://ton-app.replit.app";
  try {
    const pngBase64 = await QRCode.toDataURL(menuUrl, {
      width: 500,
      margin: 2,
      color: { dark: "#0F0F0F", light: "#FFFFFF" },
    });
    const [qr] = await db
      .insert(qrCodesTable)
      .values({
        label: "Menu QR Code",
        targetUrl: menuUrl,
        pngBase64,
      })
      .returning();
    res.status(201).json(formatQr(qr));
  } catch (err) {
    req.log.error({ err }, "Failed to generate QR code");
    res.status(500).json({ error: "Failed to generate QR code" });
    return;
  }
});

router.get("/qr/download", async (req, res): Promise<void> => {
  const [qr] = await db
    .select()
    .from(qrCodesTable)
    .orderBy(desc(qrCodesTable.createdAt))
    .limit(1);
  if (!qr?.pngBase64) {
    res.status(404).json({ error: "No QR code found" });
    return;
  }
  const base64Data = qr.pngBase64.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Disposition", "attachment; filename=menu-qr.png");
  res.send(buffer);
});

export default router;
