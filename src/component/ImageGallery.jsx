'use client';

export default function ImageGallery({ images = [] }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm text-gray-500 mb-2">Operations Images (Month)</div>
      {images.length === 0 ? (
        <div className="text-sm text-gray-500">No images uploaded for this month.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <figure key={img.id} className="rounded-lg overflow-hidden border">
              {img.signedUrl ? (
                <img
                  src={img.signedUrl}
                  alt={img.caption || 'Operations photo'}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                  No preview
                </div>
              )}
              <figcaption className="p-2 text-xs text-gray-600 line-clamp-2">
                {img.caption || '—'}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
