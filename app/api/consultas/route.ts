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
    const { firstName, lastName, phone, email, petName, breed, age, details } = await req.json();

    if (!firstName || !lastName || !email || !petName || !details) {
      return NextResponse.json({ success: false, message: 'Missing required form fields.' }, { status: 400 });
    }

    const subject = `Agendar Consulta - ${petName}`;
    const emailBody = `
      <p>Has recibido una nueva solicitud de consulta virtual.</p>
      <h3>Datos del Propietario:</h3>
      <ul>
        <li><strong>Nombre:</strong> ${firstName} ${lastName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</li>
      </ul>
      <h3>Datos de la Mascota:</h3>
      <ul>
        <li><strong>Nombre:</strong> ${petName}</li>
        <li><strong>Raza:</strong> ${breed || 'No proporcionada'}</li>
        <li><strong>Edad:</strong> ${age || 'No proporcionada'}</li>
      </ul>
      <hr>
      <p><strong>Detalles de la consulta:</strong></p>
      <p>${details}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: storeOwnerEmail,
      subject: subject,
      html: emailBody,
      reply_to: email,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ success: false, message: 'Failed to send email.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: '¡Solicitud enviada con éxito!' });

  } catch (error) {
    console.error('Error in consultas route:', error);
    return NextResponse.json({ success: false, message: 'Ocurrió un error en el servidor.' }, { status: 500 });
  }
}
