export { default } from "next-auth/middleware"

export const config = { matcher: ["/dashboard/:path*", "/records/:path*",
 "/sales/:path*", "/documentation/:path*", "/reset-password/:path*"] }