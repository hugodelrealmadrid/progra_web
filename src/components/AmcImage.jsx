import { useState } from 'react';

/** Muestra imagen local. Si no existe el archivo, usa respaldo temporal. */
export default function AmcImage({ src, alt, fallback, className = '' }) {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <img
      src={useFallback ? fallback : src}
      alt={alt}
      className={className}
      onError={() => setUseFallback(true)}
    />
  );
}
