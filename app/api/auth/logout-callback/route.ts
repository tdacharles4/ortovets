import { NextRequest, NextResponse } from 'next/server';

// This page is reached after Shopify logout.
// If it was a popup, it sends a message and closes.
// If it was the main window, it redirects to the home page.
export async function GET(request: NextRequest) {
  const script = `
    <script>
      (function() {
        let targetOrigin = '${process.env.NEXT_PUBLIC_APP_URL || ''}';
        if (!targetOrigin || targetOrigin === 'undefined') {
          targetOrigin = window.location.origin;
        } else {
          targetOrigin = targetOrigin.replace(/\\/$/, "");
        }

        if (window.opener) {
          window.opener.postMessage({ type: 'LOGOUT_SUCCESS' }, targetOrigin);
          window.close();
        } else {
          // If no opener, we are likely in the main window redirection flow.
          // Redirect to the homepage.
          window.location.href = '/';
        }
      })();
    </script>
  `;

  return new NextResponse(
    `<!DOCTYPE html><html><head><title>Logging out...</title></head><body>${script}<p>Cerrando sesión... serás redirigido en un momento.</p></body></html>`,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );
}
