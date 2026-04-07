import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

type EnquiryPayload = {
  source?: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  place?: string;
  course?: string;
  message?: string;
  dob?: string;
  gender?: string;
  state?: string;
  city?: string;
  qualification?: string;
  yearOfPassing?: string;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_EMAIL_TO;

  if (!host || !user || !pass || !to) {
    return null;
  }

  return { host, port, user, pass, to };
}

export async function POST(request: NextRequest) {
  const config = getSmtpConfig();
  if (!config) {
    return NextResponse.json({ error: "SMTP is not configured" }, { status: 500 });
  }

  const body = (await request.json()) as EnquiryPayload;
  const name = body.name?.trim();
  const username = body.username?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim();
  const place = body.place?.trim();
  const course = body.course?.trim();
  const source = body.source?.trim() || "Website enquiry";

  const lines = [
    ["Source", source],
    ["Name", name],
    ["Username", username],
    ["Email", email],
    ["Phone", phone],
    ["Place", place],
    ["Course", course],
    ["Message", body.message?.trim()],
    ["Date of Birth", body.dob?.trim()],
    ["Gender", body.gender?.trim()],
    ["State", body.state?.trim()],
    ["City", body.city?.trim()],
    ["Qualification", body.qualification?.trim()],
    ["Year of Passing", body.yearOfPassing?.trim()]
  ].filter(([, value]) => Boolean(value)) as Array<[string, string]>;

  if (!name || !username || !email || !phone || !course) {
    return NextResponse.json({ error: "All fields are required" }, { status: 422 });
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });

  await transporter.sendMail({
    from: `Yenepoya Website <${config.user}>`,
    to: config.to,
    replyTo: email,
    subject: `New ${source.toLowerCase()} from ${name}`,
    text: lines.map(([label, value]) => `${label}: ${value}`).join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #12303a;">
        <h2 style="margin: 0 0 12px;">${source}</h2>
        <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 640px;">
          <tbody>
            ${lines
              .map(
                ([label, value]) => `
                  <tr>
                    <td style="padding: 8px 12px; border: 1px solid #dbe5e8; font-weight: 700; width: 180px;">${label}</td>
                    <td style="padding: 8px 12px; border: 1px solid #dbe5e8;">${value}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
  });

  return NextResponse.json({ success: true }, { status: 200 });
}