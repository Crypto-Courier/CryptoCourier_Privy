import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { recipientEmail, subject, htmlContent } = req.body;

  if (!recipientEmail || !subject || !htmlContent) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const msg = {
      to: recipientEmail,
      from: `CryptoCourier <${process.env.SENDGRID_VERIFIED_SENDER}>`,
      subject: subject,
      html: htmlContent,
    };

    await sgMail.send(msg);

    // console.log('Email sent successfully');
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
}