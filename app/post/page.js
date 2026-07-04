"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "notice", label: "Notice" },
  { value: "daily", label: "Daily" },
  { value: "tech", label: "Tech" },
];
const fieldClassName = "grid gap-1.5";
const labelClassName = "text-sm font-medium text-zinc-700";
const inputClassName =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-100";
const textareaClassName = `${inputClassName} min-h-48 resize-y`;
const primaryButtonClassName =
  "rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50";
const errorClassName =
  "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          category,
          image: "https://picsum.photos/100",
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create post");
      }

      router.push(`/detail/${result.data.postId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase text-zinc-500">Write</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
          Create New Post
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
          제목, 본문, 카테고리를 입력해 새 게시글을 작성합니다.
        </p>
      </section>
      {error && (
        <p className={errorClassName} role="alert">
          {error}
        </p>
      )}
      <form
        className="grid max-w-2xl gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className={fieldClassName}>
          <label className={labelClassName} htmlFor="title">
            Title
          </label>
          <input
            className={inputClassName}
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className={fieldClassName}>
          <label className={labelClassName} htmlFor="content">
            Content
          </label>
          <textarea
            className={textareaClassName}
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className={fieldClassName}>
          <label className={labelClassName} htmlFor="category">
            Category
          </label>
          <select
            className={inputClassName}
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={isSubmitting}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className={primaryButtonClassName}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Post"}
        </button>
      </form>
    </main>
  );
}
