import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import styles from "./page.module.css";

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
    <main className={styles.container}>
      <article>
        <h1>{post.title}</h1>
        <p>Created: {formatDate(post.createdAt)}</p>
        {post.updatedAt && <p>Updated: {formatDate(post.updatedAt)}</p>}
        <pre className={styles.content}>{post.content}</pre>
      </article>
      <Link href={`/post/${id}`}>Edit</Link>
    </main>
  );
}
