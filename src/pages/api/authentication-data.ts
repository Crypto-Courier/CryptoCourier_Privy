import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthCollection } from '../../lib/getCollections'
import { validateInput } from '../../utils/parameter-validation'
import { handleError } from '../../utils/api-error-handler';
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

        // Validate inputs
        if (email !== null) {
            validateInput({ walletAddress, email }, ['walletAddress', 'email'])
        } else {
            validateInput({ walletAddress }, ['walletAddress']);
        }

        // Prepare the update operation
        const filter = {
            $or: [
                { walletAddress },
                ...(email ? [{ email }] : [])
            ]
        };

        const update = {
            $set: {
                walletAddress,
                email: email || null,
                lastConnectedAt: new Date()
            },
            $setOnInsert: {
                createdAt: new Date()
            }
        };

        // Use findOneAndUpdate with upsert to either update existing record or insert new
        const result = await collection.findOneAndUpdate(
            filter, 
            update, 
            { 
                upsert: true,  // Create new document if no match found
                returnDocument: 'after' // Return the updated/inserted document
            }
        );

        return res.status(200).json({
            message: 'User authentication data updated successfully',
            userId: result?._id?.toString()
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