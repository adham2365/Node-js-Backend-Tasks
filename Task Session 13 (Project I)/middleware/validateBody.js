import z from "zod";

export function validateBody(schema) {
    return (req, res, next) => {
        // validate data
        const result = schema.safeParse(req.body);

        // success ---> next()
        if(result.success) {
            next();
        } else {
            // failed ---> error
            return res.status(422).json({ errors: z.treeifyError(result.error).properties })
        }

    }
}