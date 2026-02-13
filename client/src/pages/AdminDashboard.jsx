import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelsAPI } from "../lib/api";
import { useToast } from "../components/ui/Toast";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { data } from "react-router";


export default function AdminDashboard() {
 console.log("inside the admin dashboard")
  const qc = useQueryClient();
  const { error: showError } = useToast();
  const initialFormState={
    name: "",
    description: "",
    pricePerNight: "",
    city: "",
    state: "",
    country: "",
    address: "",
    amenities: [""],
    images: "",
  }
  const [form, setForm] = useState(initialFormState);

  const { data: hotels = [] } = useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      const res=await hotelsAPI.getMine()
      console.log("inside query fucntion",res);
      return res.data.result
    },
    throwOnError: true,
    // (await hotelsAPI.getMine()).data,
    
  });

  console.log("hotels data is:",hotels);
  console.log("data is ",data);

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        description: form.description,
        pricePerNight: Number(form.pricePerNight),
        location: {
          city: form.city,
          state: form.state,
          country: form.country,
          address: form.address,
        },
        amenities: form.amenities.map((a) => a.trim()).filter(Boolean),
        images: form.images
          .split(",")
          .map((u) => u.trim())
          .filter(Boolean),
      };

      return await hotelsAPI.create(payload); // 🔥 YOU FORGOT THIS
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hotels"] }); // also fix this
      setForm(initialFormState);
    },
    onError: (e) =>
      showError(e?.response?.data?.message || "Failed to create hotel")
  });



  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const addAmenity = () =>
    setForm((prev) => ({ ...prev, amenities: [...prev.amenities, ""] }));

  const onAmenityChange = (index, value) =>
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.map((a, i) => (i === index ? value : a)),
    }));
  const removeAmenity = (index) =>
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Create Hotel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={onChange}
          />
          <Input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={onChange}
          />
          <Input
            name="pricePerNight"
            placeholder="Price per Night"
            value={form.pricePerNight}
            onChange={onChange}
          />
          <div className="grid grid-cols-3 gap-2">
            <Input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={onChange}
            />
            <Input
              name="state"
              placeholder="State"
              value={form.state}
              onChange={onChange}
            />
            <Input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={onChange}
            />
          </div>
          <Input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={onChange}
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Amenities</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addAmenity}
              >
                +
              </Button>
            </div>
            <div className="space-y-2">
              {form.amenities.map((a, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder={`Amenity ${idx + 1}`}
                    value={a}
                    onChange={(e) => onAmenityChange(idx, e.target.value)}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeAmenity(idx)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <Input
            name="images"
            placeholder="Image URLs (comma separated)"
            value={form.images}
            onChange={onChange}
          />
          <Button
            variant="gradient"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Hotels</h2>
        <div className="space-y-3">
          {hotels.map((h) => (
            <div
              key={h._id}
              className="glass-effect rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{h.name}</div>
                <div className="text-sm text-muted-foreground">
                  {h.location?.city}, {h.location?.country}
                </div>
              </div>
              <div className="text-primary font-semibold">
                ${h.pricePerNight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

