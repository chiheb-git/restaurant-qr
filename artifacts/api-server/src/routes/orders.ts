import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, phone, guests, description, items } = req.body;

    if (!firstName || !lastName || !phone || !items || items.length === 0) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    const itemsList = items
      .map(
        (item: any) =>
          `<tr style="border-bottom:1px solid #eee">
            <td style="padding:10px">${item.name}</td>
            <td style="padding:10px;text-align:center">${item.quantity}</td>
            <td style="padding:10px;text-align:right">${item.price} DZD</td>
          </tr>`
      )
      .join("");

    const total = items.reduce(
      (sum: number, item: any) => sum + Number(item.price) * item.quantity,
      0
    );

    const html = `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0F0F0F;color:#fff;padding:32px;border-radius:12px">
        <h1 style="color:#C9A84C;font-size:24px;margin-bottom:4px">Nouvelle Commande</h1>
        <p style="color:#888;margin-bottom:24px">SOLARIOS Restaurant</p>

        <div style="background:#1A1A1A;border-radius:8px;padding:20px;margin-bottom:20px">
          <h3 style="color:#C9A84C;margin-top:0">Informations Client</h3>
          <p style="margin:6px 0"><strong>Nom:</strong> ${lastName}</p>
          <p style="margin:6px 0"><strong>Prénom:</strong> ${firstName}</p>
          <p style="margin:6px 0"><strong>Téléphone:</strong> ${phone}</p>
          ${guests ? `<p style="margin:6px 0"><strong>Nombre de personnes:</strong> ${guests}</p>` : ""}
          ${description ? `<p style="margin:6px 0"><strong>Description:</strong> ${description}</p>` : ""}
        </div>

        <div style="background:#1A1A1A;border-radius:8px;padding:20px">
          <h3 style="color:#C9A84C;margin-top:0">Détails de la commande</h3>
          <table style="width:100%;border-collapse:collapse;color:#fff">
            <thead>
              <tr style="border-bottom:2px solid #C9A84C">
                <th style="padding:10px;text-align:left">Plat</th>
                <th style="padding:10px;text-align:center">Qté</th>
                <th style="padding:10px;text-align:right">Prix</th>
              </tr>
            </thead>
            <tbody>${itemsList}</tbody>
          </table>
          <div style="text-align:right;margin-top:16px;font-size:18px;font-weight:bold;color:#C9A84C">
            Total: ${total.toLocaleString("fr-DZ")} DZD
          </div>
        </div>

        <p style="color:#666;font-size:12px;margin-top:24px;text-align:center">
          Commande reçue le ${new Date().toLocaleString("fr-FR", { timeZone: "Africa/Algiers" })}
        </p>
      </div>
    `;

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY || "",
      },
      body: JSON.stringify({
        sender: { name: "SOLARIOS Restaurant", email: "chihebmeghraoui@gmail.com" },
        to: [{ email: "gahhalsohaib@gmail.com" }],
        subject: `Nouvelle commande - ${firstName} ${lastName}`,
        htmlContent: html,
      }),
    });

    if (!brevoResponse.ok) {
      const errText = await brevoResponse.text();
      console.error("Brevo error:", errText);
      throw new Error("Brevo send failed");
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Order email error:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi de la commande" });
  }
});

export default router;