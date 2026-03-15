import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default withAuth(
    async function proxy(req: NextRequest) {
        //console.log("look at me", req.kindeAuth);
    },
    {
        isReturnToCurrentPage: true,
        publicPaths: ["/"],
    }
);

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    ],
};
