import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SubmissionForm from "@/components/SubmissionForm";

export const metadata = { title: "과제 수정" };

export default async function EditSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/submissions/${id}/edit`);

  const { data, error } = await supabase
    .from("submissions")
    .select(
      "id, user_id, title, service_url, description, category, tech_stack, thumbnail_url",
    )
    .eq("id", id)
    .single();

  if (error || !data) notFound();
  if (data.user_id !== user.id) redirect(`/submissions/${id}`);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">과제 수정</h1>
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-8">
        등록한 카드의 내용을 수정합니다.
      </p>
      <SubmissionForm
        initial={{
          id: data.id,
          title: data.title,
          service_url: data.service_url,
          description: data.description,
          category: data.category as never,
          tech_stack: (data.tech_stack ?? []).join(", ") as never,
          thumbnail_url: data.thumbnail_url,
        }}
      />
    </div>
  );
}
