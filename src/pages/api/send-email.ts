import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY, SENDGRID_VERIFIED_SENDER } from '../../config/constant'
import { privyAuthMiddleware } from '../../middleware/privyAuth';

// Initialize SendGrid with your API key
sgMail.setApiKey(SENDGRID_API_KEY as string);

type Data = {
  message: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { claimerEmail, subject, htmlContent } = req.body;

  if (!claimerEmail || !subject || !htmlContent) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const msg = {
      to: claimerEmail,
      from: `CryptoCourier <${SENDGRID_VERIFIED_SENDER}>`,
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

export default privyAuthMiddleware(handler);