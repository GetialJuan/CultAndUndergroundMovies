import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, token: string) {
  // En un entorno de desarrollo, puedes usar un servicio de prueba como Ethereal
  // En producción, usarías un servicio real como SendGrid, Mailgun, etc.
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER || testAccount.user,
      pass: process.env.EMAIL_SERVER_PASSWORD || testAccount.pass,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const url = `${baseUrl}/verify-email?token=${token}`;

  const mailOptions = {
    from:
      process.env.EMAIL_FROM ||
      '"CULT&UNDERGROUND" <no-reply@cultandunderground.com>',
    to: email,
    subject: 'Verifica tu email - CULT&UNDERGROUND',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e11d48;">Bienvenido a CULT&UNDERGROUND</h2>
        <p>Gracias por registrarte. Por favor, confirma tu email haciendo clic en el siguiente enlace:</p>
        <p>
          <a
            href="${url}"
            style="background-color: #e11d48; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;"
          >
            Verificar mi email
          </a>
        </p>
        <p>O copia y pega esta URL en tu navegador:</p>
        <p>${url}</p>
        <p>Este enlace expirará en 24 horas.</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('Email enviado: %s', info.messageId);

  // URL de vista previa para desarrollo (usando Ethereal)
  if (testAccount.user) {
    console.log('URL de vista previa: %s', nodemailer.getTestMessageUrl(info));
    return nodemailer.getTestMessageUrl(info);
  }

  return info.messageId;
}
