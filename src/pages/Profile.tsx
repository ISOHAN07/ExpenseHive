"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../src/api/apiClient";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  createdAt?: string;
};

export default function Profile() {
  const queryClient = useQueryClient();

  // Fetch profile
  const { data: profile, isLoading, isError, error } = useQuery<ProfileData>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (updates: Partial<ProfileData>) => {
      const res = await api.patch("/auth/me", updates);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const handleChange = (field: keyof ProfileData, value: string) => {
    mutation.reset();
    if (profile) {
      queryClient.setQueryData(["me"], { ...profile, [field]: value });
    }
  };

  const initials = (name = "") => {
    const parts = name.split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase();
  };

  if (isLoading) return <p>Loading profile...</p>;
  if (isError) return <p className="text-red-500">{(error as any)?.message}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={undefined} alt={profile?.name} />
              <AvatarFallback>{initials(profile?.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm text-muted-foreground">Signed in as</div>
              <div className="font-semibold">{profile?.email}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile?.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile?.email || ""} disabled />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile?.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile?.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>
          </div>

          <Button
            className="mt-4"
            onClick={() =>
              mutation.mutate({
                name: profile?.name,
                phone: profile?.phone,
                location: profile?.location,
              })
            }
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>

          {mutation.isSuccess && (
            <p className="text-green-600 text-sm mt-2">Profile updated successfully</p>
          )}
          {mutation.isError && (
            <p className="text-red-500 text-sm mt-2">
              {(mutation.error as any)?.response?.data?.message ??
                "Update failed"}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account creation date</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">
            {profile?.createdAt
              ? new Date(profile.createdAt).toLocaleDateString()
              : "—"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
