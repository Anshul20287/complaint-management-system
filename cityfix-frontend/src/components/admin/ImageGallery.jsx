import React, { useState } from 'react';

const ImageGallery = ({ images = [], title = "Proof Images" }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) {
    return (
      <div className="rounded-lg bg-[#0b1628]/50 border border-cyan-400/10 p-4">
        <p className="text-sm text-[#7c8aa5]">No images available</p>
      </div>
    );
  }

  return (
    <div>
      {/* Thumbnail Grid */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-[#e6f1ff] mb-3">{title}</p>
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className="relative rounded-lg overflow-hidden border-2 border-cyan-400/20 hover:border-cyan-400/50 transition-colors cursor-pointer"
            >
              <img
                src={image.url || image}
                alt={`Proof ${index + 1}`}
                className="w-full h-24 object-cover"
              />
              {image.type && (
                <div className="absolute top-1 right-1 px-2 py-1 text-xs font-medium rounded bg-cyan-500/70 text-[#030712]">
                  {image.type === 'before' ? '🔴 Before' : '🟢 After'}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Full Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[80vh] rounded-2xl border border-cyan-400/20 bg-[#09111f]/95 overflow-hidden">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 text-[#e6f1ff] hover:text-cyan-300 bg-[#030712]/70 p-2 rounded-full"
            >
              ✕
            </button>

            <div className="flex items-center justify-center bg-[#000000]">
              <img
                src={selectedImage.url || selectedImage}
                alt="Full view"
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>

            {/* Image Info */}
            <div className="bg-[#0b1628]/50 border-t border-cyan-400/10 p-4">
              {selectedImage.type && (
                <p className="text-sm text-[#7c8aa5]">
                  Type: <span className="text-cyan-300 font-medium">
                    {selectedImage.type === 'before' ? '🔴 Before Work' : '🟢 After Work'}
                  </span>
                </p>
              )}
              {selectedImage.uploadedAt && (
                <p className="text-xs text-[#7c8aa5] mt-2">
                  Uploaded: {new Date(selectedImage.uploadedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
