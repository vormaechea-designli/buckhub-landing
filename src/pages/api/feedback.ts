import type { APIRoute } from "astro";

// Server-rendered endpoint (Vercel serverless function), never prerendered.
export const prerender = false;

const VALID_TYPES = new Set(["Suggestion", "Bug", "Question"]);

function env(name: string): string | undefined {
  // Works in dev (import.meta.env) and on Vercel runtime (process.env).
  return (import.meta.env as any)[name] ?? (process.env as any)?.[name];
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const type = String(payload?.type || "").trim();
  const message = String(payload?.message || "").trim();
  const email = String(payload?.email || "").trim();
  const pageUrl = String(payload?.url || "").trim();

  if (!VALID_TYPES.has(type)) {
    return json({ ok: false, error: "Invalid feedback type." }, 400);
  }
  if (!message) {
    return json({ ok: false, error: "Message is required." }, 400);
  }

  const token = env("GITHUB_TOKEN");
  const repo = env("GITHUB_REPO");
  const slackWebhook = env("SLACK_WEBHOOK_URL");

  let issueUrl: string | null = null;
  let issueNumber: number | null = null;
  const warnings: string[] = [];

  // 1) Create a GitHub Issue (only if a token with Issues permission is set).
  if (token && repo) {
    try {
      const title = `[${type}] ${message.slice(0, 60)}${message.length > 60 ? "…" : ""}`;
      const body = [
        `**Type:** ${type}`,
        `**From:** ${email || "(no email provided)"}`,
        `**Page:** ${pageUrl || "(unknown)"}`,
        "",
        "---",
        "",
        message,
        "",
        "_Submitted via the Buck Hub feedback widget._",
      ].join("\n");

      const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "buckhub-feedback-widget",
        },
        body: JSON.stringify({
          title,
          body,
          labels: ["feedback", type.toLowerCase()],
        }),
      });

      if (res.ok) {
        const issue = await res.json();
        issueUrl = issue.html_url;
        issueNumber = issue.number;
      } else {
        const detail = await res.text();
        warnings.push(`GitHub issue creation failed (${res.status}): ${detail.slice(0, 200)}`);
      }
    } catch (err) {
      warnings.push(`GitHub request error: ${String(err)}`);
    }
  } else {
    warnings.push("GITHUB_TOKEN/GITHUB_REPO not configured — issue not created.");
  }

  // 2) Notify Slack (only if a webhook is configured).
  if (slackWebhook) {
    try {
      const summary = issueUrl
        ? `:speech_balloon: New *${type}* feedback — <${issueUrl}|#${issueNumber}>\n> ${message.slice(0, 280)}\n_Page:_ ${pageUrl}`
        : `:speech_balloon: New *${type}* feedback (no issue created)\n> ${message.slice(0, 280)}\n_Page:_ ${pageUrl}`;
      await fetch(slackWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary }),
      });
    } catch (err) {
      warnings.push(`Slack notification error: ${String(err)}`);
    }
  }

  if (warnings.length) console.warn("[feedback]", warnings.join(" | "));

  // Always return ok so the user sees a confirmation; the client also records
  // the feedback in PostHog as a durable backstop.
  return json({ ok: true, issueUrl, issueCreated: Boolean(issueUrl) });
};
