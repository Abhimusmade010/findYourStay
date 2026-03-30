import { useState } from "react";
import { Input } from "./Input";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({ value, onChange, onFocus, required = false }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        required={required}
        className="pr-10"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}