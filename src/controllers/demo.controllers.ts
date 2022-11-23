import { Request, Response } from 'express';

const demo = async (request: Request, response: Response): Promise<void> => {

    response.status(200).json(
        {
            message: 'Hello from Node.ts'
        }
    );
};

export default { demo };