"use client";

import { Auth, AuthType } from "@/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

const AuthTab = ({
  auth,
  setAuth,
}: {
  auth: Auth;
  setAuth: (auth: Auth) => void;
}) => {
  return (
    <div className="space-y-4">
      <Select
        value={auth.type}
        onValueChange={(value: AuthType) => setAuth({ type: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select authentication type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Auth</SelectItem>
          <SelectItem value="basic">Basic Auth</SelectItem>
          <SelectItem value="bearer">Bearer Token</SelectItem>
        </SelectContent>
      </Select>

      {auth.type === "basic" && (
        <div className="space-y-2">
          <Input
            placeholder="Username"
            value={auth.username || ""}
            onChange={(e) => setAuth({ ...auth, username: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Password"
            value={auth.password || ""}
            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
          />
        </div>
      )}

      {auth.type === "bearer" && (
        <Input
          placeholder="Bearer Token"
          value={auth.token || ""}
          onChange={(e) => setAuth({ ...auth, token: e.target.value })}
        />
      )}
    </div>
  );
};

export default AuthTab;
