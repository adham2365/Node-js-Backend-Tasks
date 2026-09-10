import z from "zod";
import { pathSchema } from "../schema/params/path.schema.js";
import { searchSchema } from "../schema/params/search.schema.js";

export function validateParams () {
    return (req, res, next) => {
        let result;
                
        if (req.params.id) {            
            const path = req.params.id;
            result = pathSchema.safeParse(path);

        } else if (req.query.search) {
            const search = req.query.search;
            result = searchSchema.safeParse(search);
        } else {
            result = {success: true};
        }
        if (result.success) {
            next();
        } else {
            return res.status(422).json({ errors: z.treeifyError(result.error)});
        }
    }
}