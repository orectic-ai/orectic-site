/*
 * Vercel serverless function — POST /api/contact
 *
 * Accepts a JSON contact payload from the site's "Request access" form.
 * If RESEND_API_KEY is set, it delivers the message via Resend. Otherwise it
 * logs the submission to the function logs and returns success, so the form
 * works in preview deployments without any secrets configured.
 *
 * Optional env vars (set per-environment in the Vercel dashboard):
 *   RESEND_API_KEY  - enables real email delivery
 *   CONTACT_TO      - destination address (default hello@orectic.ai)
 *   CONTACT_FROM    - verified sender (default Resend onboarding sender)
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (err) {
      console.error("contact: invalid JSON body", err);
      return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }
  }

  const { name = "", email = "", org = "", role = "", message = "" } = body || {};

  if (!name.trim() || !email.trim() || !message.trim()) {
    return res
      .status(400)
      .json({ ok: false, error: "Name, email, and message are required" });
  }

  // Always log so a submission is never lost — even before delivery is wired.
  console.log("contact submission", { name, email, org, role, message });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "hello@orectic.ai";
  const from = process.env.CONTACT_FROM || "Orectic Site <onboarding@resend.dev>";

  if (!apiKey) {
    // No delivery configured (e.g. preview). Acknowledge so the UX completes;
    // the submission is captured in the function logs above.
    return res.status(200).json({ ok: true, delivered: false });
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `Orectic inquiry — ${name}${org ? ` (${org})` : ""}`,
        text: `Name: ${name}\nEmail: ${email}\nOrganization: ${org}\nRole: ${role}\n\n${message}`,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error("contact: Resend delivery failed", r.status, detail);
      return res.status(502).json({ ok: false, error: "Delivery failed" });
    }

    return res.status(200).json({ ok: true, delivered: true });
  } catch (err) {
    console.error("contact: delivery threw", err);
    return res.status(502).json({ ok: false, error: "Delivery error" });
  }
}
