export const DOMAIN_URL =
  process.env.NODE_ENV == "development"
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;

export const PRIVY_APP_ID =
  process.env.NODE_ENV == "development"
    ? process.env.NEXT_PUBLIC_PRIVY_APP_ID
    : process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export const PRIVY_APP_SECRET =
  process.env.NODE_ENV == "development"
    ? process.env.PRIVY_APP_SECRET
    : process.env.PRIVY_APP_SECRET;

export const CONTRACT_ADDRESS =
  process.env.NODE_ENV == "development"
    ? process.env.NEXT_PUBLIC_TRANSACTIONS_CONTRACT_ADDRESS
    : process.env.NEXT_PUBLIC_TRANSACTIONS_CONTRACT_ADDRESS;
