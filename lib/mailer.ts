import nodemailer from 'nodemailer'

const EMAIL = process.env.SMTP_EMAIL!
const PASSWORD = process.env.SMTP_PASSWORD!

const transporter = nodemailer.createTransport({
  service: 'gmail', // ou outro como: 'Outlook', 'Yahoo', ou SMTP customizado
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  const mailOptions = {
    from: `MozHost <${EMAIL}>`,
    to,
    subject,
    html
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('📧 Email enviado para:', to)
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error)
    throw new Error('Erro ao enviar o email')
  }
}
