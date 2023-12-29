import asyncHandler from 'express-async-handler';

export const registerUser = asyncHandler(
    async (req, res) => {
        try {
            res.send('registered')    
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }
);