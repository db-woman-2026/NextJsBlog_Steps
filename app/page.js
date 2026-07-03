import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Next.js Blog</h1>
      <p>
        This project will become a small blog through beginner-friendly
        practice steps.
      </p>
      <p>
        In this first step, focus on moving between pages with the navigation
        menu.
      </p>
      <p>
        <Link href="/post">Create a post page shell</Link>
      </p>
    </main>
  );
}
