"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Image } from "primereact/image";
import { SERVER_URL } from "../globals";
import { useRouter } from "next/navigation";
import { findUserByEmail } from "../shared/service";

export default function LoginPage(): JSX.Element {
  const toast = useRef<Toast>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();



  const validateEmail = (val: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(val);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.current?.show({ severity: "warn", summary: "Invalid email", detail: "Please enter a valid email address." });
      return;
    }
    if (password.length < 1) {
      toast.current?.show({ severity: "warn", summary: "Weak password", detail: "Password must be at least 6 characters." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(SERVER_URL+"/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials:"include",
        body:JSON.stringify({email,password})
      });
      if(res.ok){
        const json = await res.json();
        localStorage.setItem("user",json.jwtToken);
        localStorage.setItem("email",json.email);
        findUserByEmail(json.email);
        localStorage.setItem("roles",JSON.stringify(json.roles));
        router.push("/");
      }
    } catch (err) {
      toast.current?.show({ severity: "error", summary: "Sign in failed", detail: "Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-root">
      <Toast ref={toast} position="top-center" />

      <div className="brand">
        <Image src="green.png" style={{width:"8rem"}}/>
      </div>

      <Card className="login-card">
        <div className="welcome">
          <h1><b>Login</b></h1>
          <p>Bienvenue merci d'entrer vos coordonées</p>
        </div>

        <form onSubmit={onSubmit} className="form">
          <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full"
              aria-describedby="email-help"
              required
            />
          <small id="email-help" className="hint">Utiliser votre mail de session</small>

          <label htmlFor="password" className="mt-3">Password</label>
          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
            feedback={false}
            className="w-full"
            placeholder="••••••••"
            required
          />

          <div className="row">
            <div className="remember">
              <Checkbox inputId="remember" checked={remember} onChange={(e) => setRemember(!!e.checked)} />
              <label htmlFor="remember">Remember me</label>
            </div>
            <button type="button" className="link">Mot de passe oublié?</button>
          </div>

          <Button
            type="submit"
            label={submitting ? "Signing in..." : "Sign in"}
            icon={submitting ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
            className="w-full btn-primary"
            disabled={submitting}
          />
        </form>
      </Card>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Gantour</span>
      </footer>

      {/* Inline styles for demo – move to a css/scss file as needed */}
      <style>{`
        :root{
          --green-900: #065f46;
          --green-700: #047857;
          --green-600: #059669;
          --green-500: #10b981;
          --green-100: #d1fae5;
          --green-50:  #ecfdf5;
          --text-900:  #0b1521;
          --muted:     #6b7280;
          --white:     #ffffff;
        }

        .login-root{
          min-height:100vh;
          display:grid;
          place-items:center;
          padding:2rem;
          background:
            radial-gradient(1000px 600px at -10% -20%, var(--green-50), transparent 60%),
            radial-gradient(1000px 600px at 110% 120%, var(--green-50), transparent 60%),
            linear-gradient(180deg, #ffffff, #ffffff);
          color:var(--text-900);
        }

        .brand{
          position:fixed; top:2rem; left:2rem;
          display:flex; align-items:center; gap:.6rem;
          font-weight:700; font-size:1.05rem; color:var(--green-600);
        }
        .brand .pi{ font-size:1.1rem; }

        .login-card{
          width:100%; max-width:440px;
          border-radius:1.25rem !important;
          box-shadow:0 10px 30px rgba(4,120,87,.15);
          border:1px solid var(--green-100);
          background:var(--white);
        }
        .p-card .p-card-body{ padding:2rem; }

        .welcome h1{ margin:0 0 .25rem; font-size:1.6rem; }
        .welcome p{ margin:0; color:var(--muted); }

        .form{ display:grid; gap:.75rem; margin-top:1.25rem; }
        .form label{ font-weight:600; }
        .form .mt-3{ margin-top:.75rem; }
        .hint{ color:var(--muted); }

        .row{
          display:flex; justify-content:space-between; align-items:center; margin:.25rem 0 .75rem;
        }
        .remember{ display:flex; align-items:center; gap:.5rem; }
        .link{ background:none; border:none; color:var(--green-700); cursor:pointer; font-weight:600; }
        .link:hover{ text-decoration:underline; }

        .btn-primary{
          background:var(--green-600) !important;
          border-color:var(--green-600) !important;
          color:var(--white) !important;
          font-weight:700;
        }
        .btn-primary:hover{
          background:var(--green-700) !important;
          border-color:var(--green-700) !important;
        }

        .divider { margin:1.25rem 0 !important; }

        .secondary-actions .p-button{ border-radius:.75rem; }

        .footer{ position:fixed; bottom:1.25rem; opacity:.8; font-size:.9rem; }

        /* PrimeReact inputs full width */
        .w-full{ width:100%; }

        /* Subtle focus outline in green */
        .p-inputtext:focus,
        .p-password input:focus{
          box-shadow:0 0 0 2px color-mix(in srgb, var(--green-500) 25%, transparent);
          border-color:var(--green-500);
        }
      `}</style>
    </div>
  );
}
