import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import clientPromise from '../../lib/mongodb';
import { validateInput } from '../../utils/auth/auth-params-validation'
import { UserAuthData } from '../../types/authentication-data-types'

enum OperationType {
    STORE = 'store',
    UPDATE_STATUS = 'update_status'
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    let client: MongoClient;
    try {
        // Ensure database connection
        client = await clientPromise;
    } catch (connectionError) {
        console.error('Database connection error:', connectionError);
        return res.status(500).json({
            message: 'Database Connection Error',
            error: 'Unable to connect to the database'
        });
    }

    const db = client.db('authenticationDB');
    const collection = db.collection('authentication');

    try {
        const { 
            walletAddress, 
            email, 
            authStatus, 
            operation = OperationType.STORE 
        } = req.body;

        // Validate input
        validateInput({ walletAddress, email, authStatus });

        switch (operation) {
            case OperationType.STORE:
                // Check for existing record
                const existingRecord = await collection.findOne({
                    $or: [
                        { walletAddress },
                        { email }
                    ]
                });

                if (existingRecord) {
                    return res.status(409).json({
                        message: 'User already exists',
                        error: 'Duplicate wallet address or email'
                    });
                }

                // Prepare and insert document
                const userAuthData: UserAuthData = {
                    walletAddress,
                    email,
                    authStatus,
                    createdAt: new Date()
                };

                const result = await collection.insertOne(userAuthData);

                return res.status(201).json({
                    message: 'User authentication data stored successfully',
                    insertedId: result.insertedId.toString()
                });

            case OperationType.UPDATE_STATUS:
                // Update authentication status
                const updateResult = await collection.updateOne(
                    { walletAddress },
                    { $set: { authStatus, authenticatedAt: new Date() } },
                );

                if (updateResult.matchedCount === 0) {
                    return res.status(404).json({
                        message: 'User not found',
                        error: 'No user with the given wallet address exists'
                    });
                }

                return res.status(200).json({
                    message: 'User authentication status updated successfully',
                    updatedCount: updateResult.modifiedCount
                });

            default:
                return res.status(400).json({
                    message: 'Invalid operation type',
                    error: 'Supported operations are: store, update_status'
                });
        }
    } catch (error) {
        // Comprehensive error handling
        console.error('Authentication process error:', error);

        if (error instanceof Error) {
            return res.status(400).json({
                message: 'Validation Error',
                error: error.message
            });
        }

        return res.status(500).json({
            message: 'Internal Server Error',
            error: 'An unexpected error occurred'
        });
    }
}