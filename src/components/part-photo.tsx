import { Package } from "lucide-react";
import { useState } from "react";

export function PartPhoto({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className={`grid place-items-center bg-paper text-muted ${className}`}>
        <Package className="size-6" aria-hidden />
        <span className="sr-only">{alt}</span>
      </span>
    );
  }
  return <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className={`bg-paper object-cover ${className}`} />;
}
