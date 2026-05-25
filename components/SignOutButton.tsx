"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.refresh();
        router.push("/");
      }}
      className="px-3 py-2 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition"
    >
      로그아웃
    </button>
  );
}
