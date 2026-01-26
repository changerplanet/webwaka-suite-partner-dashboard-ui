import { withAuthGuard } from '@webwaka/core-auth-ui'

export default withAuthGuard()

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - login page (explicitly allowed)
     */
    '/((?!_next/static|_next/image|favicon.ico|login).*)',
  ],
}
