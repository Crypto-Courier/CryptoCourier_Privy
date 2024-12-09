import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthCollection } from '../../lib/getCollections'
import { validateInput, handleError } from '../../utils/auth/auth-params-validation'
import { UserAuthData, AuthRequestBody } from '../../types/authentication-data-types'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const allowedMethods = ['POST', 'PUT'];
    if (!allowedMethods.includes(req.method!)) {
        return handleError(res, 405, 'Method Not Allowed');
    }

    const collection = await getAuthCollection();

    try {
        const body: AuthRequestBody = req.body;
        const { walletAddress, email, authStatus } = body;

        // Route to appropriate operation handler
        switch (req.method) {
            case 'POST':
                // Store user Data
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

                const result = await collection.insertOne(userAuthData);

                return res.status(201).json({
                    message: 'User authentication data stored successfully',
                    insertedId: result.insertedId.toString()
                });

            case 'PUT':
                // Update user record
                validateInput({ walletAddress, authStatus }, ['walletAddress', 'authStatus'])

                const updateResult = await collection.updateOne(
                    { walletAddress },
                    {
                        $set: {
                            authStatus,
                            authenticatedAt: new Date()
                        }
                    }
                );

                if (updateResult.matchedCount === 0) {
                    return handleError(res, 404, 'User not found');
                }

                return res.status(200).json({
                    message: 'User authentication status updated successfully',
                    updatedCount: updateResult.modifiedCount
                });

            default:
                return handleError(res, 405, 'Unsupported HTTP method');
        }
    } catch (error) {
        // Comprehensive error handling
        console.error('Authentication process error:', error);

        if (error instanceof Error) {
            return handleError(res, 400, 'Validation Error', error.message);
        }

        return handleError(res, 500, 'Internal Server Error');
    }
}