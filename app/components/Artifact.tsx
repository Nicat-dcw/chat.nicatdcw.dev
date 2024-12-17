import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ArtifactProps {
  content: string;
  lang?: string;
  title: string;
  type?: 'code' | 'document' | 'diagram';
}

export default function Artifact({ content, lang, title }: ArtifactProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(title);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="my-4 w-full max-w-sm rounded-lg border border-gray-700  shadow-md cursor-pointer hover:border-gray-600 transition-colors"
         onClick={handleClick}>
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* File Icon */}
        
          <svg  className="h-8 w-10 text-gray-400"
 xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.25 21v-4.765a1.59 1.59 0 0 0-1.594-1.588H9.344a1.59 1.59 0 0 0-1.594 1.588V21m8.5-17.715v2.362a1.59 1.59 0 0 1-1.594 1.588H9.344A1.59 1.59 0 0 1 7.75 5.647V3m8.5.285A3.2 3.2 0 0 0 14.93 3H7.75m8.5.285c.344.156.661.374.934.645l2.382 2.375A3.17 3.17 0 0 1 20.5 8.55v9.272A3.18 3.18 0 0 1 17.313 21H6.688A3.18 3.18 0 0 1 3.5 17.823V6.176A3.18 3.18 0 0 1 6.688 3H7.75"/></svg>

          {/* Title and Language */}
          <div>
            <div className="text-gray-700 font-medium">{title}</div>
            {lang && (
              <span className="text-gray-500 text-sm">
                {lang}
              </span>
            )}
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="rounded-lg p-1.5 hover:bg-gray-800 text-gray-400 hover:text-gray-300 transition-colors"
          title="Copy to clipboard"
        >
          {isCopied ? (
            <span className="text-green-500 text-xs">Copied!</span>
          ) : (
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SyntaxHighlighter
              language={lang || 'text'}
              style={materialDark}
              className="rounded-lg"
            >
              {content}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
}