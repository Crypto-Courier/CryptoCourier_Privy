import axios from "axios";
import { renderEmailToString } from "./renderEmailToString";
import { SendEmailParams } from "../../types/types";

export const sendEmail = async ({
  recipientEmail,
  subject,
  tokenAmount,
  tokenSymbol,
  senderEmail,
}: SendEmailParams): Promise<void> => {
  try {
    const htmlContent = renderEmailToString({
      recipientEmail,
      tokenAmount,
      tokenSymbol,
      senderEmail,
    });

    const response = await axios.post<{ message: string }>("/api/send-email", {
      recipientEmail,
      subject,
      htmlContent,
      senderEmail
    });

    if (response.status === 200) {
      console.log("Email sent successfully");
    } else {
      console.error("Error sending email:", response.data.message);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
