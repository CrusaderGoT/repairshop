import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const actionClient = createSafeActionClient({
    defineMetadataSchema() {
        return z.object({
            actionName: z.string(),
        })
    },
    handleServerError(e) {
        if (e.constructor.name === "NeonDbError") {
            const msg = e.message.split('"')[1];
            return `Database Error: Your data did not save. ${msg}`
        }
        return e.message;
    }
})