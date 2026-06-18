import { useEffect, useState } from "react";
import { resolveBrandId } from "../lib/brand-id";

export function useBrandId(): string {
  const [brandId, setBrandId] = useState(resolveBrandId);

  useEffect(() => {
    const sync = () => setBrandId(resolveBrandId());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  return brandId;
}
