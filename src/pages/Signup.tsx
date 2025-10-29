"use client";

import type React from "react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import api from "../../src/api/apiClient"; // axios instance
import { useAuth } from "../../src/context/useAuth"; // auth context (login function)

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // POST /auth/register expects { name, email, password }
      const res = await api.post("/auth/register", { name, email, password });

      // expected response shape: { message, user: { id, name, email }, token }
      const { user, token } = res.data ?? {};

      if (!user || !token) {
        setErrorMsg("Unexpected server response. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // store auth in context (and localStorage inside context)
      login(user, token);

      // navigate to dashboard or main page
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Signup error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create account. Please try again.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join ExpenseHive today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
