"use client";

import { useState } from "react";

const fieldClassName = "grid gap-1.5";
const labelClassName = "text-sm font-medium text-zinc-700";
const inputClassName =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200";
const textareaClassName = `${inputClassName} min-h-40 resize-y`;
const primaryButtonClassName =
  "rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    alert(
      `메일 전송 mockup입니다.\n\n이름: ${name}\n이메일: ${email}\n내용: ${message}`,
    );
  }

  return (
    <form
      className="grid max-w-2xl gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className={fieldClassName}>
        <label className={labelClassName} htmlFor="name">
          Name
        </label>
        <input
          className={inputClassName}
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>

      <div className={fieldClassName}>
        <label className={labelClassName} htmlFor="email">
          Email
        </label>
        <input
          className={inputClassName}
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className={fieldClassName}>
        <label className={labelClassName} htmlFor="message">
          Message
        </label>
        <textarea
          className={textareaClassName}
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
      </div>

      <button className={primaryButtonClassName} type="submit">
        Submit
      </button>
    </form>
  );
}
