import { useState, useRef, useEffect } from "react";
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


export default function AdminDashboard() {
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
    images: [],
  }
  const [form, setForm] = useState(initialFormState);
  const fileInputRef = useRef(null);
  // For preview URLs
  const [imagePreviews, setImagePreviews] = useState([]);

  // Clean up object URLs on unmount or when images change
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const { data: hotels = [] } = useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      const res=await hotelsAPI.getMine()
      return res.data.result
    },
    throwOnError: true,
  });


  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("pricePerNight", Number(form.pricePerNight));

      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("country", form.country);
      formData.append("address", form.address);

      // amenities (filter out empty)
      form.amenities.filter((a) => a && a.trim()).forEach((a) => {
        formData.append("amenities[]", a);
      });

      // images
      if (form.images && form.images.length > 0) {
        form.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      return await hotelsAPI.create(formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hotels"] });
      setForm(initialFormState);
      if (fileInputRef.current) fileInputRef.current.value = "";
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

          <div>
            <div className="mb-2 text-sm text-muted-foreground">You can add up to 5 images</div>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                try {
                  const newFiles = Array.from(e.target.files);
                  setForm((prev) => {
                    const existing = prev.images || [];
                    const allFiles = [...existing, ...newFiles];
                    const uniqueFiles = [];
                    const seen = new Set();
                    for (const file of allFiles) {
                      const key = file.name + file.size;
                      if (!seen.has(key)) {
                        seen.add(key);
                        uniqueFiles.push(file);
                      }
                    }
                    if (uniqueFiles.length > 5) {
                      alert("Maximum 5 images allowed");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                      return { ...prev };
                    }
                    setImagePreviews(uniqueFiles.map((file) => URL.createObjectURL(file)));
                    return { ...prev, images: uniqueFiles };
                  });
                } catch (err) {
                  console.error("File input error:", err);
                }
              }}
            />
            {form.images && form.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.images.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden flex items-center justify-center bg-gray-100">
                    {file.type.startsWith("image/") && imagePreviews[idx] ? (
                      <img
                        src={imagePreviews[idx]}
                        alt={`preview-${idx}`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xs">{file.name}</span>
                    )}
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-bl px-1 text-xs text-red-600 hover:bg-opacity-100"
                      onClick={() => {
                        setForm((prev) => {
                          const newImages = prev.images.filter((_, i) => i !== idx);
                          setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== idx));
                          if (newImages.length === 0 && fileInputRef.current) fileInputRef.current.value = "";
                          return { ...prev, images: newImages };
                        });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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
