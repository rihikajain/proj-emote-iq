"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  // Always check before accessing session.user
  useEffect(() => {
    if (session && session.user) {
      setUserInfo({
        name: session.user.name ?? "",
        email: session.user.email ?? "",
      });
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  // If session is null or user missing
  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-muted-foreground">
        <h1 className="text-2xl font-semibold mb-2">Not Signed In</h1>
        <p className="text-sm">Please sign in to view your profile.</p>
      </div>
    );
  }

  const handleSave = () => {
    console.log("Saving user info:", userInfo);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="space-y-4 p-6">
          <h1 className="text-2xl font-bold text-primary mb-4 text-center">
            Profile
          </h1>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={userInfo.name}
                disabled={!isEditing}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={userInfo.email} disabled />
            </div>

            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="w-1/2">
                  Save
                </Button>
                <Button
                  variant="secondary"
                  className="w-1/2"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="w-full">
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground mt-6">
        Logged in as: {session.user.email}
      </p>
    </div>
  );
}
