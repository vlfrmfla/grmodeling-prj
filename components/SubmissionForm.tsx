"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import {
  submissionSchema,
  CATEGORIES,
  parseTechStack,
  type SubmissionInput,
} from "@/lib/schemas";

type Props = {
  /** Existing values when editing. If omitted, the form creates a new row. */
  initial?: Partial<SubmissionInput> & {
    id?: string;
    thumbnail_url?: string | null;
  };
};

export default function SubmissionForm({ initial }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = Boolean(initial?.id);

  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(
    initial?.thumbnail_url ?? null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmissionInput>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      title: initial?.title ?? "",
      service_url: initial?.service_url ?? "",
      description: initial?.description ?? "",
      category: (initial?.category as SubmissionInput["category"]) ?? "스마트팜",
      tech_stack:
        typeof initial?.tech_stack === "string"
          ? initial.tech_stack
          : Array.isArray(initial?.tech_stack)
            ? (initial.tech_stack as string[]).join(", ")
            : "",
    },
  });

  function onPickThumb(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setThumbFile(f);
    setThumbPreview(f ? URL.createObjectURL(f) : initial?.thumbnail_url ?? null);
  }

  async function uploadThumb(userId: string): Promise<string | null> {
    if (!thumbFile) return initial?.thumbnail_url ?? null;
    const ext = thumbFile.name.split(".").pop() ?? "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("thumbnails")
      .upload(path, thumbFile, { contentType: thumbFile.type, upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from("thumbnails").getPublicUrl(path);
    return data.publicUrl;
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      const thumbnail_url = await uploadThumb(user.id);

      const payload = {
        user_id: user.id,
        title: values.title,
        service_url: values.service_url,
        description: values.description,
        category: values.category,
        tech_stack: parseTechStack(values.tech_stack),
        thumbnail_url,
      };

      if (isEdit && initial?.id) {
        const { error } = await supabase
          .from("submissions")
          .update(payload)
          .eq("id", initial.id);
        if (error) throw error;
        router.push(`/submissions/${initial.id}`);
      } else {
        const { data, error } = await supabase
          .from("submissions")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        router.push(`/submissions/${data.id}`);
      }
      router.refresh();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Field label="과제명" error={errors.title?.message}>
        <input
          {...register("title")}
          className="field-input"
          placeholder="예: 토마토 생육 예측 대시보드"
        />
      </Field>

      <Field
        label="서비스 URL"
        hint="카드를 누르면 이 주소로 새 탭이 열립니다."
        error={errors.service_url?.message}
      >
        <input
          {...register("service_url")}
          type="url"
          className="field-input"
          placeholder="https://my-service.vercel.app"
        />
      </Field>

      <Field label="서비스 설명" error={errors.description?.message}>
        <textarea
          {...register("description")}
          rows={6}
          className="field-input resize-y"
          placeholder="어떤 문제를 해결하나요? 누가 사용하나요? 사용 시나리오를 적어주세요."
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="카테고리" error={errors.category?.message}>
          <select {...register("category")} className="field-input">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="사용 기술" hint="쉼표로 구분하여 입력" error={errors.tech_stack?.message}>
          <input
            {...register("tech_stack")}
            className="field-input"
            placeholder="Next.js, Supabase, TensorFlow.js"
          />
        </Field>
      </div>

      <Field label="썸네일 이미지" hint="선택 사항 · 16:9 비율을 권장">
        <input
          type="file"
          accept="image/*"
          onChange={onPickThumb}
          className="block w-full text-sm text-stone-600 dark:text-stone-300
            file:mr-3 file:rounded-md file:border-0
            file:bg-stone-200 dark:file:bg-stone-700
            file:px-3 file:py-1.5 file:text-sm file:font-medium
            file:text-stone-800 dark:file:text-stone-100
            hover:file:bg-stone-300 dark:hover:file:bg-stone-600 file:transition"
        />
        {thumbPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbPreview}
            alt="썸네일 미리보기"
            className="mt-3 rounded-md max-h-48 object-cover border border-stone-200 dark:border-stone-800"
          />
        )}
      </Field>

      {serverError && (
        <p className="text-sm text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/40 rounded-md p-2.5">
          {serverError}
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "저장 중…" : isEdit ? "수정 저장" : "카드 등록"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-ghost"
        >
          취소
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-stone-800 dark:text-stone-200">
          {label}
        </span>
        {hint && (
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && <span className="block text-xs text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}
