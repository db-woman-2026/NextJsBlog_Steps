"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../page.module.css";

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(`/api/post/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch post data");
        }

        const post = await response.json();
        setTitle(post.title);
        setContent(post.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch post");
      }
    }

    if (id) {
      loadPost();
    }
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`/api/post/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
    }
  }

  return (
    <main className={styles.container}>
      <h1>Edit Post</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />

        <button type="submit">Update Post</button>
      </form>
    </main>
  );
}
