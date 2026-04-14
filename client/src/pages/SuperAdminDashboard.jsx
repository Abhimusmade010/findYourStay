import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../lib/api";
import { useToast } from "../components/ui/Toast";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";


export default function SuperAdminDashboard() {
  const { error: showError } = useToast();

  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "" });
  const [adminSuccess, setAdminSuccess] = useState("");

  const createAdminMutation = useMutation({
    mutationFn: async () => {
      return await authAPI.createAdmin(adminForm);
    },
    onSuccess: (res) => {
      setAdminForm({ name: "", email: "", password: "" });
      setAdminSuccess(`Admin "${res.data.result.name}" (${res.data.result.email}) created successfully!`);
      setTimeout(() => setAdminSuccess(""), 6000);
    },
    onError: (e) => {
      showError(e?.response?.data?.message || "Failed to create admin");
    },
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient">Super Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage admin accounts for PlanYourStay. Only you (SuperAdmin) can create new Admin accounts.
        </p>
      </div>

      {/* Create Admin Card */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Admin Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {adminSuccess && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
              ✅ {adminSuccess}
            </div>
          )}

          <Input
            name="name"
            placeholder="Admin Name"
            value={adminForm.name}
            onChange={(e) =>
              setAdminForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Input
            name="email"
            type="email"
            placeholder="Admin Email"
            value={adminForm.email}
            onChange={(e) =>
              setAdminForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <Input
            name="password"
            type="password"
            placeholder="Admin Password"
            value={adminForm.password}
            onChange={(e) =>
              setAdminForm((prev) => ({ ...prev, password: e.target.value }))
            }
          />

          <p className="text-xs text-muted-foreground">
            Password must be 6+ characters with at least one uppercase, one lowercase, one number, and one symbol.
          </p>

          <Button
            variant="gradient"
            onClick={() => createAdminMutation.mutate()}
            disabled={
              createAdminMutation.isPending ||
              !adminForm.name ||
              !adminForm.email ||
              !adminForm.password
            }
            className="w-full"
          >
            {createAdminMutation.isPending ? "Creating Admin..." : "Create Admin Account"}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-2">
            The new admin will be able to log in and manage hotels, bookings, and reviews.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
