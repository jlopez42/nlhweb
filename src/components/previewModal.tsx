import React from 'react';
import { X } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  title?: string;
  imageSrc?: string;
  textDescription?: string;
  onClose: () => void;
}

   function replaceWithBr(text: string): string {
    return text.replace(/\n/g, "<br />");
  }


const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, title, imageSrc, textDescription, onClose }) => {
 
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-[600px] relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <div className="w-1/4 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"></div>
        </div>

        <div className="space-y-6">
          <div>
            <img
              src={imageSrc}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
          </div>
          <div className="text-justify overscroll-container max-h-48 overflow-y-auto">
            <p dangerouslySetInnerHTML={{ __html: replaceWithBr(textDescription || "") }}></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PreviewModal;