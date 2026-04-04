import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function toFrenchReservationDateLabel(dateInput: string): string {
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return dateInput;

  const formatted = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(d);

  // "lundi 06 avril 2026" -> "Lundi 06 Avril 2026"
  return formatted
    .split(" ")
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(" ");
}

function getTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("[Mailer] SMTP incomplet: vérifie SMTP_HOST, SMTP_USER, SMTP_PASS.");
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return transporter;
}

function resolveFromAddress(): string {
  const configuredFrom = process.env.MAIL_FROM?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();

  if (configuredFrom && configuredFrom.includes("@")) {
    return configuredFrom;
  }
  if (configuredFrom && smtpUser) {
    const safeLabel = configuredFrom.replace(/"/g, "'");
    return `"${safeLabel}" <${smtpUser}>`;
  }
  return smtpUser || "contact@moonkeyparis.fr";
}

export async function sendReservationReceivedEmail(input: {
  to: string;
  prenom: string;
  nombre_personnes: number;
}): Promise<void> {
  const tx = getTransporter();
  if (!tx) return;

  const from = resolveFromAddress();
  const subject = "Moonkey Paris - Demande de réservation reçue";
  const nb =
    input.nombre_personnes === 1
      ? "1 personne"
      : `${input.nombre_personnes} personnes`;
  const text = `Bonjour ${input.prenom},

Nous vous confirmons que votre demande de réservation a bien été reçue.
Nombre de personnes : ${nb}
Une réponse vous sera délivrée rapidement.

Cordialement,
L'équipe Moonkey Paris`;

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Moonkey Paris - Demande de réservation reçue</title>
</head>
<body bgcolor="#ffffff" style="background-color:#ffffff;margin:0;padding:0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;background:#ffffff;">
          <tr>
            <td style="padding:24px 20px 20px 20px;" align="center">
              <img src="https://img.mailinblue.com/10920874/images/content_library/original/69cb30444ec5dc981bb478ca.png" width="150" alt="Moonkey Paris" style="display:block;border:0;max-width:150px;height:auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:0 20px 30px 20px;" align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top:3px solid #aaaaaa;">
                <tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 20px 10px 20px;font-family:Arial,Helvetica,sans-serif;color:#414141;">
              <h2 style="margin:0;font-size:32px;line-height:1.25;font-weight:700;">Bonjour ${input.prenom},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:5px 20px 20px 20px;font-family:Arial,Helvetica,sans-serif;color:#414141;font-size:16px;line-height:1.6;">
              Nous vous confirmons que votre demande de réservation a bien été reçue.<br/>
              <strong>Nombre de personnes :</strong> ${input.nombre_personnes === 1 ? "1 personne" : `${input.nombre_personnes} personnes`}<br/>
              Une réponse vous sera délivrée rapidement.
            </td>
          </tr>
          <tr>
            <td style="padding:5px 20px 30px 20px;font-family:Arial,Helvetica,sans-serif;color:#414141;font-size:16px;line-height:1.6;">
              Cordialement,<br />
              <strong>L'équipe Moonkey Paris</strong>
            </td>
          </tr>
        </table>

        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;background:#eff2f7;">
          <tr>
            <td style="padding:24px 20px 8px 20px;" align="center">
              <h4 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:1.4;color:#1f2d3d;">Moonkey Paris</h4>
              <p style="margin:4px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#3b3f44;">
                192 Rue Raymond Losserand, 75014 Paris
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 20px 24px 20px;" align="center">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#666666;">
                Cet email a été envoyé à ${input.to}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await tx.sendMail({
    from,
    to: input.to,
    subject,
    text,
    html,
  });
}

export async function sendReservationConfirmedEmail(input: {
  to: string;
  prenom: string;
  date: string;
  creneau: string;
  nombre_personnes: number;
}): Promise<void> {
  const tx = getTransporter();
  if (!tx) return;

  const from = resolveFromAddress();
  const subject = "Moonkey Paris - Réservation confirmée";
  const prettyDate = toFrenchReservationDateLabel(input.date);
  const nb =
    input.nombre_personnes === 1
      ? "1 personne"
      : `${input.nombre_personnes} personnes`;
  const text = `Bonjour ${input.prenom},

Votre réservation est confirmée.

Date : ${prettyDate}
Horaire : ${input.creneau}
Nombre de personnes : ${nb}

Nous serons ravis de vous accueillir chez Moonkey Paris.
Au-delà de 30 minutes de retard, la réservation sera considérée comme annulée.
En cas de problème, merci de nous contacter au 07 44 54 87 13.

Cordialement,
L'équipe Moonkey Paris`;

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Moonkey Paris - Réservation confirmée</title>
</head>
<body bgcolor="#ffffff" style="background-color:#ffffff;margin:0;padding:0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;background:#ffffff;">
          <tr>
            <td style="padding:24px 20px 20px 20px;" align="center">
              <img src="https://img.mailinblue.com/10920874/images/content_library/original/69cb30444ec5dc981bb478ca.png" width="150" alt="Moonkey Paris" style="display:block;border:0;max-width:150px;height:auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:0 20px 30px 20px;" align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top:3px solid #aaaaaa;">
                <tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 20px 10px 20px;font-family:Arial,Helvetica,sans-serif;color:#414141;">
              <h2 style="margin:0;font-size:32px;line-height:1.25;font-weight:700;">Bonjour ${input.prenom},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:5px 20px 20px 20px;font-family:Arial,Helvetica,sans-serif;color:#414141;font-size:16px;line-height:1.6;">
              Votre réservation est confirmée.<br /><br />
              <strong>Date :</strong> ${prettyDate}<br />
              <strong>Horaire :</strong> ${input.creneau}<br />
              <strong>Nombre de personnes :</strong> ${input.nombre_personnes === 1 ? "1 personne" : `${input.nombre_personnes} personnes`}<br /><br />
              Nous serons ravis de vous accueillir chez Moonkey Paris.<br /><br />
              Au-delà de 30 minutes de retard, la réservation sera considérée comme annulée.<br />
              En cas de problème, merci de nous contacter au <strong>07 44 54 87 13</strong>.
            </td>
          </tr>
          <tr>
            <td style="padding:5px 20px 30px 20px;font-family:Arial,Helvetica,sans-serif;color:#414141;font-size:16px;line-height:1.6;">
              Cordialement,<br />
              <strong>L'équipe Moonkey Paris</strong>
            </td>
          </tr>
        </table>

        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;background:#eff2f7;">
          <tr>
            <td style="padding:24px 20px 8px 20px;" align="center">
              <h4 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:1.4;color:#1f2d3d;">Moonkey Paris</h4>
              <p style="margin:4px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#3b3f44;">
                192 Rue Raymond Losserand, 75014 Paris
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 20px 24px 20px;" align="center">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#666666;">
                Cet email a été envoyé à ${input.to}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await tx.sendMail({
    from,
    to: input.to,
    subject,
    text,
    html,
  });
}

export async function sendReservationCancelledEmail(input: {
  to: string;
  prenom: string;
  date: string;
  creneau: string;
  nombre_personnes: number;
}): Promise<void> {
  const tx = getTransporter();
  if (!tx) return;

  const from = resolveFromAddress();
  const subject = "Moonkey Paris - Réservation non retenue";
  const prettyDate = toFrenchReservationDateLabel(input.date);
  const nb =
    input.nombre_personnes === 1
      ? "1 personne"
      : `${input.nombre_personnes} personnes`;
  const text = `Bonjour ${input.prenom},

Nous vous remercions pour votre demande.
Malheureusement, nous ne pouvons pas confirmer votre réservation pour :

Date : ${prettyDate}
Horaire : ${input.creneau}
Nombre de personnes : ${nb}

N’hésitez pas à nous recontacter pour un autre créneau.

Cordialement,
L'équipe Moonkey Paris`;

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Moonkey Paris - Réservation non retenue</title>
</head>
<body bgcolor="#ffffff" style="background-color:#ffffff;margin:0;padding:0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;background:#ffffff;">
          <tr>
            <td style="padding:24px 20px 20px 20px;" align="center">
              <img src="https://img.mailinblue.com/10920874/images/content_library/original/69cb30444ec5dc981bb478ca.png" width="150" alt="Moonkey Paris" style="display:block;border:0;max-width:150px;height:auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:0 20px 30px 20px;" align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top:3px solid #aaaaaa;">
                <tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 20px 10px 20px;font-family:Arial,Helvetica,sans-serif;color:#414141;">
              <h2 style="margin:0;font-size:32px;line-height:1.25;font-weight:700;">Bonjour ${input.prenom},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:5px 20px 20px 20px;font-family:Arial,Helvetica,sans-serif;color:#414141;font-size:16px;line-height:1.6;">
              Nous vous remercions pour votre demande.<br />
              Malheureusement, nous ne pouvons pas confirmer votre réservation pour :<br /><br />
              <strong>Date :</strong> ${prettyDate}<br />
              <strong>Horaire :</strong> ${input.creneau}<br />
              <strong>Nombre de personnes :</strong> ${input.nombre_personnes === 1 ? "1 personne" : `${input.nombre_personnes} personnes`}<br /><br />
              N’hésitez pas à nous recontacter pour un autre créneau.
            </td>
          </tr>
          <tr>
            <td style="padding:5px 20px 30px 20px;font-family:Arial,Helvetica,sans-serif;color:#414141;font-size:16px;line-height:1.6;">
              Cordialement,<br />
              <strong>L'équipe Moonkey Paris</strong>
            </td>
          </tr>
        </table>

        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;background:#eff2f7;">
          <tr>
            <td style="padding:24px 20px 8px 20px;" align="center">
              <h4 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:1.4;color:#1f2d3d;">Moonkey Paris</h4>
              <p style="margin:4px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#3b3f44;">
                192 Rue Raymond Losserand, 75014 Paris
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 20px 24px 20px;" align="center">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#666666;">
                Cet email a été envoyé à ${input.to}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await tx.sendMail({
    from,
    to: input.to,
    subject,
    text,
    html,
  });
}

