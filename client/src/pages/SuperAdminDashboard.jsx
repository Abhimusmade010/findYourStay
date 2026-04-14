import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { superAdminAPI } from "../lib/api";
import { useToast } from "../components/ui/Toast";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";


// ─── Tab button component ───────────────────────────────────
function Tab({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2
        ${active
          ? "bg-primary text-white shadow-md shadow-primary/30"
          : "bg-secondary/50 text-muted-foreground hover:bg-secondary/80"
        }`}
    >
      {label}
      {count !== undefined && (
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold
          ${active ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
          {count}
        </span>
      )}
    </button>
  );
}


// ─── Main Dashboard ─────────────────────────────────────────
export default function SuperAdminDashboard() {
  const qc = useQueryClient();
  const { success: showSuccess, error: showError } = useToast();

  const [activeTab, setActiveTab] = useState("admins"); // "admins" | "hotels"
  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "" });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, name, type }


  // ─── Queries ──────────────────────────────────────────────
  const { data: admins = [], isLoading: loadingAdmins } = useQuery({
    queryKey: ["superadmin-admins"],
    queryFn: async () => {
      const res = await superAdminAPI.getAllAdmins();
      return res.data.result;
    },
  });

  const { data: hotels = [], isLoading: loadingHotels } = useQuery({
    queryKey: ["superadmin-hotels"],
    queryFn: async () => {
      const res = await superAdminAPI.getAllHotels();
      return res.data.result;
    },
  });


  // ─── Mutations ────────────────────────────────────────────
  const createAdminMutation = useMutation({
    mutationFn: () => superAdminAPI.createAdmin(adminForm),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["superadmin-admins"] });
      setAdminForm({ name: "", email: "", password: "" });
      setShowCreateForm(false);
      showSuccess(`Admin "${res.data.result.name}" created successfully!`);
    },
    onError: (e) => showError(e?.response?.data?.message || "Failed to create admin"),
  });

  const deleteAdminMutation = useMutation({
    mutationFn: (id) => superAdminAPI.deleteAdmin(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["superadmin-admins"] });
      showSuccess("Admin deleted successfully");
      setConfirmDelete(null);
    },
    onError: (e) => {
      showError(e?.response?.data?.message || "Failed to delete admin");
      setConfirmDelete(null);
    },
  });

  const deleteHotelMutation = useMutation({
    mutationFn: (id) => superAdminAPI.deleteHotel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["superadmin-hotels"] });
      showSuccess("Hotel deleted successfully");
      setConfirmDelete(null);
    },
    onError: (e) => {
      showError(e?.response?.data?.message || "Failed to delete hotel");
      setConfirmDelete(null);
    },
  });


  // ─── Confirm delete handler ───────────────────────────────
  const handleConfirmDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === "admin") deleteAdminMutation.mutate(confirmDelete.id);
    else deleteHotelMutation.mutate(confirmDelete.id);
  };


  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Super Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Full system oversight — manage admins and all hotel listings
          </p>
        </div>
        {/* Stats */}
        <div className="hidden md:flex gap-4">
          <div className="glass-effect rounded-lg px-5 py-3 text-center">
            <div className="text-2xl font-bold text-primary">{admins.length}</div>
            <div className="text-xs text-muted-foreground">Admins</div>
          </div>
          <div className="glass-effect rounded-lg px-5 py-3 text-center">
            <div className="text-2xl font-bold text-primary">{hotels.length}</div>
            <div className="text-xs text-muted-foreground">Hotels</div>
          </div>
        </div>
      </div>


      {/* ─── Tabs ─── */}
      <div className="flex gap-3">
        <Tab
          label="Admins"
          active={activeTab === "admins"}
          count={admins.length}
          onClick={() => setActiveTab("admins")}
        />
        <Tab
          label="Hotels"
          active={activeTab === "hotels"}
          count={hotels.length}
          onClick={() => setActiveTab("hotels")}
        />
      </div>


      {/* ─── ADMINS TAB ─── */}
      {activeTab === "admins" && (
        <div className="space-y-4">

          {/* Create admin toggle */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">All Admins</h2>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? "Cancel" : "+ Add New Admin"}
            </Button>
          </div>

          {/* Create admin form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create Admin Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Admin Name"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm((p) => ({ ...p, name: e.target.value }))}
                />
                <Input
                  type="email"
                  placeholder="Admin Email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm((p) => ({ ...p, email: e.target.value }))}
                />
                <Input
                  type="password"
                  placeholder="Password (6+ chars, uppercase, number, symbol)"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm((p) => ({ ...p, password: e.target.value }))}
                />
                <Button
                  variant="gradient"
                  className="w-full"
                  onClick={() => createAdminMutation.mutate()}
                  disabled={
                    createAdminMutation.isPending ||
                    !adminForm.name || !adminForm.email || !adminForm.password
                  }
                >
                  {createAdminMutation.isPending ? "Creating..." : "Create Admin"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Admin list */}
          {loadingAdmins ? (
            <div className="text-center text-muted-foreground py-10">Loading admins...</div>
          ) : admins.length === 0 ? (
            <div className="glass-effect rounded-lg p-8 text-center text-muted-foreground">
              No admins yet. Create the first one above.
            </div>
          ) : (
            <div className="space-y-3">
              {admins.map((admin) => (
                <div
                  key={admin._id}
                  className="glass-effect rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {admin.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{admin.name}</div>
                      <div className="text-xs text-muted-foreground">{admin.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      Admin
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : ""}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => setConfirmDelete({ id: admin._id, name: admin.name, type: "admin" })}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* ─── HOTELS TAB ─── */}
      {activeTab === "hotels" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Hotels</h2>

          {loadingHotels ? (
            <div className="text-center text-muted-foreground py-10">Loading hotels...</div>
          ) : hotels.length === 0 ? (
            <div className="glass-effect rounded-lg p-8 text-center text-muted-foreground">
              No hotels have been created yet.
            </div>
          ) : (
            <div className="space-y-3">
              {hotels.map((hotel) => (
                <div
                  key={hotel._id}
                  className="glass-effect rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {/* Hotel thumbnail */}
                    {hotel.images?.[0]?.url ? (
                      <img
                        src={hotel.images[0].url}
                        alt={hotel.name}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-secondary/50 flex items-center justify-center text-2xl flex-shrink-0">
                        🏨
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{hotel.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {hotel.location?.city}, {hotel.location?.country}
                      </div>
                      {hotel.createdBy && (
                        <div className="text-xs text-primary mt-0.5">
                          by {hotel.createdBy.name} ({hotel.createdBy.email})
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-semibold">${hotel.pricePerNight}/night</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => setConfirmDelete({ id: hotel._id, name: hotel.name, type: "hotel" })}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* ─── Confirm Delete Modal ─── */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="glass-effect rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-semibold">Confirm Delete</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">"{confirmDelete.name}"</span>?
              {confirmDelete.type === "admin"
                ? " This admin will lose all access immediately."
                : " This hotel and all associated data will be removed."}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="gradient"
                className="flex-1 bg-destructive hover:bg-destructive/90"
                onClick={handleConfirmDelete}
                disabled={deleteAdminMutation.isPending || deleteHotelMutation.isPending}
              >
                {(deleteAdminMutation.isPending || deleteHotelMutation.isPending)
                  ? "Deleting..."
                  : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
