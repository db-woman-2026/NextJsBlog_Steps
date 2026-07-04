"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    alert(
      `메일 전송 mockup입니다.\n\n이름: ${name}\n이메일: ${email}\n내용: ${message}`,
    );

    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label htmlFor="message">Message:</label>
      <textarea
        id="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
}
