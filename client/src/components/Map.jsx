export default function Map({ query }) {

  const q = encodeURIComponent(query || "luxury hotel");
  const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const src = `https://www.google.com/maps/embed/v1/search?key=${key}&q=${q}`;
  
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border/50">
      <iframe
        title="map"
        src={src}
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
