import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const storeOwnerEmail = process.env.STORE_OWNER_EMAIL;

export async function POST(req: NextRequest) {
  if (!storeOwnerEmail) {
    console.error("STORE_OWNER_EMAIL environment variable is not set.");
    return NextResponse.json({ success: false, message: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const { firstName, lastName, email, phone, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ success: false, message: 'Missing required form fields.' }, { status: 400 });
    }

    const subject = `Contacto - ${firstName} ${lastName}`;
    const emailBody = `
      <p>Has recibido un nuevo mensaje de contacto desde tu sitio web.</p>
      <ul>
        <li><strong>Nombre:</strong> ${firstName} ${lastName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</li>
      </ul>
      <hr>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // This is Resend's default for unverified domains
      to: storeOwnerEmail,
      subject: subject,
      html: emailBody,
      reply_to: email, // Set the reply-to header to the user's email
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ success: false, message: 'Failed to send email.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: '¡Mensaje enviado con éxito!' });

  } catch (error) {
    console.error('Error in contact route:', error);
    return NextResponse.json({ success: false, message: 'Ocurrió un error en el servidor.' }, { status: 500 });
  }
}
