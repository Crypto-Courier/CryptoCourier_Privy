import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthCollection } from '../../lib/getCollections'
import { validateInput, handleError } from '../../utils/auth/auth-params-validation'
import { UserAuthData, AuthRequestBody } from '../../types/authentication-data-types'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST method
    if (req.method !== 'POST') {
        return handleError(res, 405, 'Method Not Allowed');
    }

    const collection = await getAuthCollection();

    try {
        const { walletAddress, email }: AuthRequestBody = req.body;

        // Validate wallet address input
        if(email !== null){
            validateInput({walletAddress, email},['walletAddress', 'email'])
        }
        
        validateInput({ walletAddress }, ['walletAddress']);

        // Check for existing record
        const existingRecord = await collection.findOne({
            $or: [
                { walletAddress },
                ...(email ? [{ email }] : []) 
            ]
        });

        if (existingRecord) {
            return handleError(res, 409, 'User already exists');
        }

        // Prepare user data
        const userAuthData: Partial<UserAuthData> = {
            walletAddress,
            email: email || null
        };

        // Insert new user record
        const result = await collection.insertOne(userAuthData);

        return res.status(201).json({
            message: 'User authentication data stored successfully',
            insertedId: result.insertedId.toString()
        });

    } catch (error) {
        // Comprehensive error handling
        console.error('Authentication process error:', error);

        if (error instanceof Error) {
            return handleError(res, 400, 'Validation Error', error.message);
        }

        return handleError(res, 500, 'Internal Server Error');
    }
}