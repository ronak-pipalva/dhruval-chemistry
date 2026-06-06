import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
// Default onboarding sender. If the user registers a custom domain, they can update this via environment variable.
const NOTIFICATION_TO_EMAIL = Deno.env.get("NOTIFICATION_TO_EMAIL") || "talsaniyadhruval231@gmail.com";
const NOTIFICATION_FROM_EMAIL = Deno.env.get("NOTIFICATION_FROM_EMAIL") || "onboarding@resend.dev";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // GET health endpoint
  if (req.method === "GET") {
    const healthStatus: Record<string, any> = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      supabase: "unknown",
      resend: "unknown",
    };

    // 1. Check Supabase
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (!supabaseUrl || !supabaseKey) {
        healthStatus.supabase = "error: missing environment variables";
        healthStatus.status = "error";
      } else {
        const start = Date.now();
        const res = await fetch(`${supabaseUrl}/rest/v1/notes?limit=1`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        });
        if (res.ok) {
          healthStatus.supabase = `healthy (resolved in ${Date.now() - start}ms)`;
        } else {
          healthStatus.supabase = `error: status ${res.status} (${res.statusText})`;
          healthStatus.status = "error";
        }
      }
    } catch (err) {
      healthStatus.supabase = `error: ${err.message}`;
      healthStatus.status = "error";
    }

    // 2. Check Resend
    try {
      if (!RESEND_API_KEY) {
        healthStatus.resend = "error: missing RESEND_API_KEY environment variable";
        healthStatus.status = "error";
      } else if (!RESEND_API_KEY.startsWith("re_")) {
        healthStatus.resend = "error: invalid RESEND_API_KEY format (must start with 're_')";
        healthStatus.status = "error";
      } else {
        healthStatus.resend = "healthy (configured with sending-only key)";
      }
    } catch (err) {
      healthStatus.resend = `error: ${err.message}`;
      healthStatus.status = "error";
    }

    return new Response(JSON.stringify(healthStatus), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }

  // POST request logic (trigger notifier)
  try {
    const { record, table } = await req.json();
    console.log(`Received notification trigger for table: ${table}`);
    console.log("Record payload:", JSON.stringify(record));

    let subject = "";
    let html = "";

    if (table === "demo_requests") {
      subject = `⚗️ New Demo Request from ${record.name}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            .header { background-color: #0d9488; color: #ffffff; padding: 24px; text-align: center; font-size: 22px; font-weight: bold; }
            .content { padding: 32px; }
            .item { margin-bottom: 16px; border-bottom: 1px solid #f3f4f6; padding-bottom: 12px; }
            .label { font-weight: bold; color: #4b5563; font-size: 13px; text-transform: uppercase; tracking-wider; display: block; margin-bottom: 4px; }
            .value { color: #111827; font-size: 16px; font-weight: 500; }
            .message-box { font-style: italic; background-color: #f3f4f6; padding: 16px; border-radius: 12px; color: #374151; margin-top: 8px; border-left: 4px solid #0d9488; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">⚗️ New Demo Request Received</div>
            <div class="content">
              <div class="item">
                <span class="label">Student Name</span>
                <span class="value">${record.name}</span>
              </div>
              <div class="item">
                <span class="label">Gender</span>
                <span class="value">${record.gender || "N/A"}</span>
              </div>
              <div class="item">
                <span class="label">Standard</span>
                <span class="value">${record.standard} Standard</span>
              </div>
              <div class="item">
                <span class="label">Board</span>
                <span class="value">${record.board} Board</span>
              </div>
              <div class="item">
                <span class="label">Medium</span>
                <span class="value">${record.medium || "N/A"}</span>
              </div>
              <div class="item">
                <span class="label">Preparation Group</span>
                <span class="value">${record.group_name}</span>
              </div>
              <div class="item">
                <span class="label">WhatsApp Number</span>
                <span class="value">
                  <a href="https://wa.me/91${record.whatsapp}" style="color: #0d9488; text-decoration: underline; font-weight: bold;">${record.whatsapp}</a>
                </span>
              </div>
              <div class="item">
                <span class="label">City</span>
                <span class="value">${record.city}</span>
              </div>
              ${record.message ? `
              <div style="margin-top: 24px;">
                <span class="label">Additional Message</span>
                <div class="message-box">"${record.message}"</div>
              </div>
              ` : ''}
            </div>
            <div class="footer">
              This request was automatically submitted. Please check the admin dashboard to manage bookings.
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (table === "contact_messages") {
      subject = `✉️ New Contact Message from ${record.name}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f9fafb; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            .header { background-color: #0ea5e9; color: #ffffff; padding: 24px; text-align: center; font-size: 22px; font-weight: bold; }
            .content { padding: 32px; }
            .item { margin-bottom: 16px; border-bottom: 1px solid #f3f4f6; padding-bottom: 12px; }
            .label { font-weight: bold; color: #4b5563; font-size: 13px; text-transform: uppercase; tracking-wider; display: block; margin-bottom: 4px; }
            .value { color: #111827; font-size: 16px; font-weight: 500; }
            .message-box { font-style: italic; background-color: #f3f4f6; padding: 16px; border-radius: 12px; color: #374151; margin-top: 8px; border-left: 4px solid #0ea5e9; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">✉️ New Inquiry Message</div>
            <div class="content">
              <div class="item">
                <span class="label">Sender Name</span>
                <span class="value">${record.name}</span>
              </div>
              <div class="item">
                <span class="label">Phone / Contact</span>
                <span class="value">
                  <a href="https://wa.me/91${record.email}" style="color: #0ea5e9; text-decoration: underline; font-weight: bold;">${record.email}</a>
                </span>
              </div>
              <div style="margin-top: 24px;">
                <span class="label">Message</span>
                <div class="message-box">"${record.message}"</div>
              </div>
            </div>
            <div class="footer">
              This message was submitted via the contact form on your web app.
            </div>
          </div>
        </body>
        </html>
      `;
    }

    if (!html) {
      console.log(`No email template defined for table: ${table}. Skipping Resend call.`);
      return new Response(JSON.stringify({ status: "skipped", reason: "no template" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable.");
    }

    console.log(`Sending email using Resend API to: ${NOTIFICATION_TO_EMAIL} from: ${NOTIFICATION_FROM_EMAIL}`);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: NOTIFICATION_FROM_EMAIL,
        to: NOTIFICATION_TO_EMAIL,
        subject: subject,
        html: html,
      }),
    });

    const responseText = await response.text();
    console.log("Resend API response status:", response.status);
    console.log("Resend API response body:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { error: "Failed to parse Resend response JSON", text: responseText };
    }

    if (!response.ok) {
      throw new Error(`Resend API call failed with status ${response.status}: ${responseText}`);
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error executing notify-teacher function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
