import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    // Exchange code for session (handled by Supabase client automatically)
    return NextResponse.redirect(new URL('/', requestUrl.origin))
  }

  // If no code, redirect to home
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
