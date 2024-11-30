import type { NextApiRequest, NextApiResponse } from "next";
import { PrivyClient } from "@privy-io/server-auth";
import { WalletAccount } from "../../types/check-privy-wallet-api-types" 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Validate email in the request body
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Invalid email provided" });
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
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
