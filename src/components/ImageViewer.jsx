import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const ImageViewer = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = parseInt(event.key);
      if (!isNaN(key) && key >= 1 && key <= 9 && key <= selectedImages.length) {
        setActiveImage(selectedImages[key - 1]);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [selectedImages]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prev => [...prev, ...imageUrls]);
  };

  const handleImageClick = (imageUrl) => {
    setActiveImage(imageUrl);
  };

  const handleSelectFiles = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    if (selectedImages[indexToRemove] === activeImage) {
      setActiveImage(null);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    const dragImage = new Image();
    dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...selectedImages];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setSelectedImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar - fixed width */}
      <div className="w-1/5 flex-shrink-0 bg-gray-100 p-4 flex flex-col h-full">
        <div className="flex-grow overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {selectedImages.map((imageUrl, index) => (
            <div 
              key={index}
              className="relative group flex justify-center"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <img
                src={imageUrl}
                alt={`Selected ${index + 1}`}
                className="w-[90%] cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                onClick={() => handleImageClick(imageUrl)}
                onMouseEnter={() => handleImageClick(imageUrl)}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                className="absolute top-1 right-[5%] bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
              {index < 9 && (
                <div className="absolute bottom-2 left-[8%] w-6 h-6 bg-gray-50 border border-gray-300 rounded flex items-center justify-center text-xs font-mono text-gray-600 shadow-[inset_0_-2px_0_0_#cbd5e1,0_1px_2px_0_rgb(0,0,0,0.05)] active:shadow-[inset_0_1px_1px_0_rgb(0,0,0,0.1)] active:translate-y-px">
                  {index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex-shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            onClick={handleSelectFiles}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Select Images
          </button>
        </div>
      </div>

      {/* Main Content - fixed ratio */}
      <div className="flex-grow bg-white p-8 flex items-start justify-center overflow-hidden">
        {activeImage ? (
          <div className="w-full h-full flex items-start justify-center">
            <img
              src={activeImage}
              alt="Selected preview"
              className="w-full h-full object-contain object-top"
            />
          </div>
        ) : (
          <p className="text-gray-400 text-xl">Select an image to display</p>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;