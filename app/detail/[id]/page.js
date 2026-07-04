import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import DeletePostButton from "./DeletePostButton";

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleString("ko-KR");
}

export default async function BlogDetail({ params }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="space-y-6">
      <article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase text-zinc-600">
            {post.category || "general"}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm text-zinc-500">
            <span>Created: {formatDate(post.createdAt)}</span>
            {post.updatedAt && <span>Updated: {formatDate(post.updatedAt)}</span>}
          </div>
        </div>
        <pre className="mt-6 whitespace-pre-wrap rounded-md bg-zinc-50 p-4 text-sm leading-7 text-zinc-700">
          {post.content}
        </pre>
      </article>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          href={`/post/${id}`}
        >
          Edit
        </Link>
        <DeletePostButton id={id} />
      </div>
    </main>
  );
}
