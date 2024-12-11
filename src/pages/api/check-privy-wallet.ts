import type { NextApiRequest, NextApiResponse } from "next";
import { PrivyClient } from "@privy-io/server-auth";
import { WalletAccount } from "../../types/check-privy-wallet-api-types"
import { handleError } from "../../utils/api-error-handler"; 
import { isValidEmail } from "../../utils/parameter-validation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return handleError(res, 405, "Method Not Allowed");
  }

  // Validate email in the request body
  const { email } = req.body;
  if ((!email || typeof email !== "string") && !(isValidEmail(email))) {
    return handleError(res, 400, "Invalid email provided")
  }

  try {
    // Initialize Privy client
    const privyClient = new PrivyClient(
      process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
      process.env.NEXT_PUBLIC_PRIVY_APP_SECRET!
    );

    // Search for users by email
    const users = await privyClient.getUserByEmail(email);

    const walletAccount = users?.linkedAccounts?.find(
      (account: any) => account.type === "wallet"
    ) as WalletAccount | undefined;

    // Return the result
    return res.status(200).json(walletAccount?.address);
  } catch (error) {
    console.error("Error checking Privy wallet:", error);
    return handleError(res, 500, "Internal Server Error");
  }
}
