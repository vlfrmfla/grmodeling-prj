// Shared zod schemas for form validation.
import { z } from "zod";

export const CATEGORIES = [
  "스마트팜",
  "유통/판매",
  "교육/정보",
  "데이터/AI",
  "기타",
] as const;

// tech_stack stays a comma-separated string here; convert to string[]
// at the call site before inserting into the DB.
export const submissionSchema = z.object({
  title: z.string().min(1, "과제명을 입력하세요").max(100),
  service_url: z.url("올바른 URL을 입력하세요 (https://...)"),
  description: z.string().min(10, "10자 이상 설명을 입력하세요").max(2000),
  category: z.enum(CATEGORIES),
  tech_stack: z.string(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export function parseTechStack(s: string | undefined | null): string[] {
  return (s ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export type Submission = {
  id: string;
  user_id: string;
  title: string;
  service_url: string;
  description: string;
  category: string | null;
  tech_stack: string[] | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { name: string; department: string | null } | null;
};
