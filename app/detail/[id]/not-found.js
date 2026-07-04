import Link from "next/link";

export default function PostNotFound() {
  return (
    <main>
      <h1>Post Not Found</h1>
      <p>This post does not exist or may have been deleted.</p>
      <Link href="/">Back to post list</Link>
    </main>
  );
}
