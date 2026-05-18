import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_FROM_NUMBER = "whatsapp:+14155238886";
const TEACHER_NUMBER = "whatsapp:+919624835292";

serve(async (req) => {
  try {
    const { record, table } = await req.json();

    let message = "";
    if (table === "demo_requests") {
      message = `*New Demo Request!* ⚗️\n\n*Name:* ${record.name}\n*Standard:* ${record.standard}\n*Board:* ${record.board}\n*Group:* ${record.group_name}\n*WhatsApp:* ${record.whatsapp}\n*City:* ${record.city}\n\nCheck dashboard for details.`;
    } else if (table === "contact_messages") {
      message = `*New Contact Message!* ✉️\n\n*Name:* ${record.name}\n*Email:* ${record.email}\n*Message:* ${record.message}`;
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        },
        body: new URLSearchParams({
          To: TEACHER_NUMBER,
          From: TWILIO_FROM_NUMBER,
          Body: message,
        }),
      },
    );

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
