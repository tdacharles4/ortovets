import { NextRequest, NextResponse } from 'next/server';

// This page is opened in the popup. It sends a message to the main window
// that logout was successful, and then the main window closes the popup.
export async function GET(request: NextRequest) {
  const script = `
    <script>
      if (window.opener) {
        window.opener.postMessage({ type: 'LOGOUT_SUCCESS' }, '${process.env.NEXT_PUBLIC_APP_URL}');
      }
    </script>
  `;

  return new NextResponse(
    `<!DOCTYPE html><html><head><title>Logging out...</title></head><body>${script}<p>You have been logged out. This window will close automatically.</p></body></html>`,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );
}
