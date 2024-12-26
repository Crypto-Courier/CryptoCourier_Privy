import axios from "axios";
import { renderEmailToString } from "./renderEmailToString";
import { SendEmailParams } from "../../types/types";
import { usePrivy } from "@privy-io/react-auth";

export const sendEmail = async ({
  claimerEmail,
  subject,
  tokenAmount,
  tokenSymbol,
  gifterEmail,
  transactionHash,
}: SendEmailParams): Promise<void> => {
  const { getAccessToken } = usePrivy();
  const token = await getAccessToken(); 
  
  try {
    const htmlContent = renderEmailToString({
      claimerEmail,
      tokenAmount,
      tokenSymbol,
      gifterEmail,
      transactionHash,
    });

    const response = await axios.post<{ message: string }>(
      "/api/send-email",
      {
        claimerEmail,
        subject,
        htmlContent,
        gifterEmail,
        transactionHash,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      }
    );

    if (response.status === 200) {
      console.log("Email sent successfully");
    } else {
      console.error("Error sending email:", response.data.message);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
