"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = search.get("redirect") ?? "/";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    const supabase = createClient();
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.replace(redirectTo);
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name || email.split("@")[0] },
            emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          },
        });
        if (error) throw error;
        setNotice("확인 메일을 보냈습니다. 메일함을 확인해주세요.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="space-y-5">
      <div className="flex border-b border-stone-200 dark:border-stone-800 text-sm">
        {(["signin", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
              setNotice(null);
            }}
            className={`flex-1 py-2.5 transition ${
              mode === m
                ? "border-b-2 border-stone-900 dark:border-stone-100 font-medium"
                : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            }`}
          >
            {m === "signin" ? "로그인" : "회원가입"}
          </button>
        ))}
      </div>

      <form onSubmit={onEmailSubmit} className="space-y-3">
        {mode === "signup" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            required
            className="field-input"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="학교 이메일"
          required
          className="field-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 (8자 이상)"
          required
          minLength={8}
          className="field-input"
        />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "처리 중…" : mode === "signin" ? "로그인" : "회원가입"}
        </button>
      </form>

      <div className="relative text-center text-xs text-stone-500">
        <span className="bg-stone-50 dark:bg-stone-900 px-3 relative z-10">
          또는
        </span>
        <span className="absolute inset-x-0 top-1/2 h-px bg-stone-200 dark:bg-stone-800" />
      </div>

      <button type="button" onClick={onGoogle} className="btn-ghost w-full">
        Google 계정으로 계속하기
      </button>

      {error && (
        <p className="text-sm text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/40 rounded-md p-2.5">
          {error}
        </p>
      )}
      {notice && (
        <p className="text-sm text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 bg-stone-100/60 dark:bg-stone-800/60 rounded-md p-2.5">
          {notice}
        </p>
      )}
    </div>
  );
}
