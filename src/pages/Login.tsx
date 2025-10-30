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

import api from "../../src/api/apiClient";
import { useAuth } from "../../src/context/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      if (!token || !user) {
        setErrorMsg("Invalid server response. Please try again.");
        setIsSubmitting(false);
        return;
      }

      login(user, token);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);

      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message?.toLowerCase?.() || "";

      if (status === 401 && serverMsg.includes("invalid credentials")) {
        setErrorMsg(
          "No such user found or wrong password. Please try again or sign up."
        );
      } else if (serverMsg.includes("user not found")) {
        setErrorMsg("No such user found. Please sign up to continue.");
      } else if (serverMsg.includes("password") && password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
      } else if (status === 500) {
        if (password.length < 6) {
          setErrorMsg("Password must be at least 6 characters long.");
        } else {
          setErrorMsg("Something went wrong. Please try again later.");
        }
      } else {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to login. Please try again.";
        setErrorMsg(msg);
      }
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
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your ExpenseHive account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
