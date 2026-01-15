//import Anthropic from "@anthropic-ai/sdk";
//import { SALESFORCE_REPORT_PROMPT } from "./prompts/salesforceSummary";

type AISummaryResult = {
  summary: string;
  metrics: string[];
  trends: string[];
  recommendations: string[];
};

/**
 * Summarise report using Claude API via iframe proxy
 * This is for FREE TESTING - uses Claude API through artifact
 */
export async function summariseReport(
  rows: Record<string, unknown>[]
): Promise<AISummaryResult> {

  // option 1: use the Claude API proxy (FREE for testing)
  if (process.env.NEXT_PUBLIC_CLAUDE_PROXY_URL) {
    return await summariseViaProxy(rows);
  }

  // option 2: direct API call if you have credentials later
  if (process.env.ANTHROPIC_API_KEY) {
    return await summariseViaDirect(rows);
  }

  // fallback: mock data
  return {
    summary: "Sample summary based on provided report rows.",
    metrics: ["Total Records: " + rows.length, "Columns: " + Object.keys(rows[0] || {}).length],
    trends: ["Upwards trend detected"],
    recommendations: ["Review high-performing segments"],
  };
}

/**
 * Use Claude proxy artifact (FREE)
 */
async function summariseViaProxy(
  rows: Record<string, unknown>[]
): Promise<AISummaryResult> {
  const proxyUrl = process.env.NEXT_PUBLIC_CLAUDE_PROXY_URL;
  
  if (!proxyUrl) {
    throw new Error("NEXT_PUBLIC_CLAUDE_PROXY_URL not configured");
  }

  // Create a hidden iframe to communicate with the proxy
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.src = proxyUrl;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const requestId = Math.random().toString(36);
    
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Proxy request timeout'));
    }, 30000); // 30 second timeout

    function cleanup() {
      clearTimeout(timeout);
      window.removeEventListener('message', handleMessage);
      document.body.removeChild(iframe);
    }

    function handleMessage(event: MessageEvent) {

      // security: In production, verify event.origin matches your proxy
      if (event.data.requestId === requestId) {
        if (event.data.type === 'SUMMARIZE_RESPONSE') {
          cleanup();
          resolve(event.data.result);
        } else if (event.data.type === 'SUMMARIZE_ERROR') {
          cleanup();
          reject(new Error(event.data.error));
        }
      }
    }

    window.addEventListener('message', handleMessage);

    // wait for iframe to load, then send request
    iframe.onload = () => {
      iframe.contentWindow?.postMessage({
        type: 'SUMMARIZE_REQUEST',
        requestId: requestId,
        rows: rows.slice(0, 50) // send max 50 rows
      }, '*');
    };
  });
}

/**
 * Direct Claude API call (requires ANTHROPIC_API_KEY)
 * This will be used later when you have API credits
 */
async function summariseViaDirect(
  rows: Record<string, unknown>[]
): Promise<AISummaryResult> {
  const response = await fetch('/api/claude-direct', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows: rows.slice(0, 50) })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}