"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!message.trim()) {
      alert("Message cannot be empty.");
      return;
    }

    const subject = encodeURIComponent(`Contact from ${name || "Anonymous"}`);

    const body = encodeURIComponent(
      `Name: ${name || "N/A"}\n` +
        `Email: ${email || "N/A"}\n\n` +
        `Message:\n${message}`,
    );

    const mailtoLink = `mailto:duncan.miard@outlook.fr?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-3 text-center w-full">
            <div className="text-xs text-accent font-mono tracking-widest">
              [ CONTACT ]
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-accent uppercase tracking-[0.2em]">
              Get in Touch
            </h1>
            <p className="text-foreground/50 font-mono text-sm">
              Send a message directly via your email client.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-surface border border-border p-6 rounded-sm"
        >
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-foreground/50 uppercase tracking-widest">
              Name / Pseudonym
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 bg-background border border-border text-sm font-mono focus:outline-none focus:border-accent"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-foreground/50 uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 bg-background border border-border text-sm font-mono focus:outline-none focus:border-accent"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-foreground/50 uppercase tracking-widest">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              rows={6}
              className="w-full px-3 py-2 bg-background border border-border text-sm font-mono focus:outline-none focus:border-accent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            {/* Return */}
            <Link
              href="/"
              className="px-4 py-3 border border-border hover:border-accent text-foreground/50 hover:text-accent rounded-sm uppercase tracking-widest text-xs transition font-mono text-center"
              style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0% 100%)" }}
            >
              Return
            </Link>

            {/* Submit */}
            <button
              type="submit"
              className="flex-1 px-4 py-3 border border-border hover:border-accent text-foreground/50 hover:text-accent rounded-sm uppercase tracking-widest text-xs transition font-mono"
              style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0% 100%)" }}
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
