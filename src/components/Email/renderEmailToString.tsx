import ReactDOMServer from 'react-dom/server';
import Email from './Email';

export function renderEmailToString(props: {
  recipientEmail: string;
  tokenAmount: string;
  tokenSymbol: string;
}): string {
  const emailContent = ReactDOMServer.renderToStaticMarkup(<Email {...props} />);
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CryptoCourier Email</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
      ${emailContent}
    </body>
    </html>
  `;
}