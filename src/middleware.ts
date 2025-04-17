import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
    const token = await getToken({ req })
    const isAuthenticated = !!token
    const isLoginPage = req.nextUrl.pathname === "/login"
    const isProtectedRoute = req.nextUrl.pathname === "/countdown"

    // Case 1: User is authenticated and tries to access login page
    if (isAuthenticated && isLoginPage) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    // Case 2: User is not authenticated and tries to access protected route
    if (!isAuthenticated && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // Otherwise, continue
    return NextResponse.next()
}

// Only match these specific paths
export const config = { matcher: ["/login", "/countdown"] }