import { NeonDbError } from "@neondatabase/serverless";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const actionClient = createSafeActionClient({
    defineMetadataSchema() {
        return z.object({
            actionName: z.string(),
        });
    },
    handleServerError(e) {
        if (e.constructor.name === "NeonDbError") {
            const { code, detail } = e as NeonDbError;

            if (code === "23505") {
                return `Unique entry required. ${detail}`;
            }

            return `Database Error: Your data did not save. Support will be notified`;
        }
        return e.message;
    },
});
