"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("정말 삭제할까요? 되돌릴 수 없습니다.")) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("submissions").delete().eq("id", id);
    setBusy(false);
    if (error) {
      alert(`삭제 실패: ${error.message}`);
      return;
    }
    router.push("/my");
    router.refresh();
  }

  return (
    <button onClick={onDelete} disabled={busy} className="btn-danger">
      {busy ? "삭제 중…" : "삭제"}
    </button>
  );
}
