"use client";

import { useState } from "react";
import Link from "next/link";

const MAX_MESSAGE_LENGTH = 1000;

function sanitize(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/[{}[\]]/g, "");
}

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!message.trim()) return;

    const cleanName = sanitize(name);
    const cleanEmail = sanitize(email);
    const cleanMessage = sanitize(message).slice(0, MAX_MESSAGE_LENGTH);

    const subject = encodeURIComponent(
      `[Strife] Contact from ${cleanName || "Anonymous"}`,
    );

    const body = encodeURIComponent(
      `Name: ${cleanName || "N/A"}\n` +
        `Email: ${cleanEmail || "N/A"}\n\n` +
        `Message:\n${cleanMessage}`,
    );

    window.location.href = `mailto:duncan.miard@outlook.fr?subject=${subject}&body=${body}`;
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="text-xs text-accent font-mono tracking-widest">
            [ CONTACT ]
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-accent uppercase tracking-[0.2em]">
            Get in Touch
          </h1>
          <div className="w-16 h-0.5 bg-accent mx-auto" />
          <p className="text-foreground/50 font-mono text-sm">
            Send a message directly via your email client.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-surface border border-border p-8 rounded-sm"
        >
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-foreground/50 uppercase tracking-widest block">
              Name / Pseudonym
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 bg-background border border-border text-sm font-mono focus:outline-none focus:border-accent transition rounded-sm"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-foreground/50 uppercase tracking-widest block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 bg-background border border-border text-sm font-mono focus:outline-none focus:border-accent transition rounded-sm"
            />
          </div>

          {/* Message */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-foreground/50 uppercase tracking-widest">
                Message
              </label>
              <span
                className={`text-xs font-mono ${message.length > MAX_MESSAGE_LENGTH * 0.9 ? "text-red-500" : "text-foreground/30"}`}
              >
                {message.length} / {MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))
              }
              placeholder="Write your message..."
              rows={6}
              required
              className="w-full px-3 py-2 bg-background border border-border text-sm font-mono focus:outline-none focus:border-accent transition rounded-sm resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/"
              className="px-6 py-2 border border-border hover:border-accent text-foreground/50 hover:text-accent rounded-sm uppercase tracking-widest text-xs transition font-mono"
              style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0% 100%)" }}
            >
              ← Return
            </Link>
            <button
              type="submit"
              disabled={!message.trim()}
              className="flex-1 px-6 py-2 border border-border hover:border-accent text-foreground/50 hover:text-accent rounded-sm uppercase tracking-widest text-xs transition font-mono disabled:opacity-30"
              style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0% 100%)" }}
            >
              Send Message →
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
