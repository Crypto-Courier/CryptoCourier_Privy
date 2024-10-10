/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      SENDGRID_VERIFIED_SENDER: process.env.SENDGRID_VERIFIED_SENDER,
    },
    // You can add other Next.js configuration options here as needed
  };
  
  export default nextConfig;