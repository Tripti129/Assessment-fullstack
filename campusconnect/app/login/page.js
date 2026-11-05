"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Login page (dummy login – any email/password works)
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={handleSubmit}>
        <Link href="/" className="logo">🎓 Campus<span>Connect</span></Link>
        <h2>Welcome back</h2>
        <p className="muted">Login to continue to your portal</p>

        <label>Email</label>
        <input type="email" placeholder="you@campusconnect.edu" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn btn-full">Login</button>
        <p className="muted small center">Demo: enter any email and password</p>
      </form>
    </div>
  );
}
