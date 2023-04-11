import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    
  },
  {
    callbacks: {
      authorized: ({ token }) => {if(token) {
        return true
    }},
    },
    pages: {
        signIn: '/'
    }
  }
)
export const config = { matcher: ["/dashboard/:path*", "/books/:path*",
 "/sales/:path*", "/documentation/:path*", "/reset-password/:path*", "/vendors/:path*", "/purchases/:path*", 
 "/buybacks/:path*", "/genres/:path*"],  }