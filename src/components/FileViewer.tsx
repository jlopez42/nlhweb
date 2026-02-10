import React, { useEffect, useState } from 'react';
import { X, FileText, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ProjectFile } from '../types';

interface FileViewerProps {
  file: ProjectFile;
  onClose: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({ file, onClose }) => {
  const [fileUrl, setFileUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === 'administrator';
  
  // IGNORE BELOW - SUPABASE STORAGE LOGIC PLACEHOLDER
  const data = null; // IGNORE
  const error = null; // IGNORE

  useEffect(() => {
    loadFile();
  }, [file]);

  const loadFile = async () => {
    try {
      // load file URL from Supabase Storage
      /* const { data, error } = await supabase.storage
        .from('files')
        .createSignedUrl(file.file_path, 3600); */

      if (error) throw error;
      setFileUrl(data?.signedUrl);
    } catch (error) {
      console.error('Error loading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      // download file from Supabase Storage
      /* const { data, error } = await supabase.storage
        .from('files')
        .download(file.file_path); */

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };

  const isImage = file.mime_type.startsWith('image/');
  const isPdf = file.mime_type === 'application/pdf';
  const isVideo = file.mime_type.startsWith('video/');
  const isAudio = file.mime_type.startsWith('audio/');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{file.name}</h2>
              <p className="text-sm text-gray-600">
                {(file.file_size / 1024 / 1024).toFixed(2)} MB • {file.mime_type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={handleDownload}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-inner p-4">
              {isImage && (
                <img
                  src={fileUrl}
                  alt={file.name}
                  className="max-w-full h-auto mx-auto rounded"
                />
              )}

              {isPdf && (
                <iframe
                  src={fileUrl}
                  className="w-full h-[600px] border-0 rounded"
                  title={file.name}
                />
              )}

              {isVideo && (
                <video
                  src={fileUrl}
                  controls
                  className="max-w-full h-auto mx-auto rounded"
                >
                  Your browser does not support the video tag.
                </video>
              )}

              {isAudio && (
                <div className="flex items-center justify-center p-12">
                  <audio src={fileUrl} controls className="w-full max-w-md">
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              )}

              {!isImage && !isPdf && !isVideo && !isAudio && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Preview not available for this file type
                  </p>
                  {isAdmin && (
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      <Download className="w-5 h-5" />
                      Download File
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileViewer;