// Server-side Supabase client. Use inside Server Components, Route Handlers,
// and Server Actions. Reads/writes auth cookies via next/headers.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll is called from a Server Component — Next.js disallows
            // cookie mutation there. The middleware below refreshes the
            // session cookie on every request, so this is safe to ignore.
          }
        },
      },
    },
  );
}
