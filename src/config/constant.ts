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

export const MONGODB_URI =
  process.env.NODE_ENV == "development"
    ? process.env.DEVELOPMENT_MONGODB_URI
    : process.env.PRODUCTION_MONGODB_URI;

export const SENDGRID_API_KEY =
  process.env.NODE_ENV == "development"
    ? process.env.SENDGRID_API_KEY
    : process.env.SENDGRID_API_KEY;

export const SENDGRID_VERIFIED_SENDER =
  process.env.NODE_ENV == "development"
    ? process.env.SENDGRID_VERIFIED_SENDER
    : process.env.SENDGRID_VERIFIED_SENDER;

export const ALCHEMY_API_KEY =
  process.env.NODE_ENV == "development"
    ? process.env.ALCHEMY_API_KEY
    : process.env.ALCHEMY_API_KEY;
