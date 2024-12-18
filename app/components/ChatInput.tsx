"use client";
import { useState } from "react";


interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
}

export default function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
  selectedModel,
  onModelSelect
}: ChatInputProps) {
  const [isModelDrawerOpen, setIsModelDrawerOpen] = useState(false);

  const models = [
    { id: 'meta-llama/llama-3.2-1b-instruct:free', name: 'Greesychat' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
  ];

  return (
    <div className="relative">
      {/* Model Selection Drawer - Changed position to top-full and adjusted margins */}
      <div 
        className={`absolute left-12 w-64 darl:bg-black bg-white rounded-lg shadow-lg border border-gray-200 transform transition-all duration-200 ease-in-out z-50 ${
          isModelDrawerOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
        }`}
      >
        {/* Arrow - Moved to top and adjusted rotation */}
       
        <div className={`${isModelDrawerOpen ? 'block' : 'hidden'}`}>
          <div className="text-sm font-medium text-gray-700 mb-2 px-2">Select Model</div>
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelSelect(model.id);
                setIsModelDrawerOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors ${
                selectedModel === model.id ? 'bg-gray-100 dark:bg-transparent dark:text-white' : ''
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      <form className="w-full" onSubmit={onSubmit}>
        <div className="relative flex h-full max-w-full flex-1 flex-col">
          <div className="group relative flex w-full items-center">
            <div className="flex w-full cursor-text flex-col rounded-3xl px-2.5 py-1 transition-colors contain-inline-size dark:bg-[#2f2f2f] bg-[#f4f4f4] dark:bg-[#f9f9f9]">
              <div className="flex min-h-[44px] items-start pl-2">
                <div className="min-w-0 max-w-full flex-1">
                  <div className="whitespace-pre-wrap text-token-text-primary max-h-[25dvh] max-h-52 overflow-auto default-browser">
                    <textarea
                      value={input}
                      onChange={(e) => onInputChange(e.target.value)}
                      className="block mt-2 h-10 text-gray-900 dark:text-gray-200 border-none focus:outline-none w-full resize-none border-0 bg-transparent px-0 py-2 placeholder:text-[#5d5d5d]"
                      autoFocus={false}
                      placeholder="Message GreesyChat"
                      data-virtualkeyboard="true"
                    />
                  </div>
                </div>
              
              </div>
              <div className="flex h-[44px] items-center justify-between">
                <div className="flex gap-x-2">
                  {/* Model Selection Button */}
                  <button
                    type="button"
                    onClick={() => setIsModelDrawerOpen(!isModelDrawerOpen)}
                    className="flex items-center gap-x-1 px-3 py-1 text-sm rounded-lg dark:bg-transparent bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <span>{selectedModel}</span>
                   
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isModelDrawerOpen ? 'rotate-180' : ''
                      }`}
  width={32}
  height={32}
  viewBox="0 0 32 32"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
    fill="currentColor"
  />
</svg>

                  </button>

                  {/* Attachment Button */}
                  <div className="relative">
                    <div className="relative">
                      <div className="flex flex-col">
                        <input
                          multiple={false}
                          tabIndex={-1}
                          className="hidden"
                          type="file"
                          style={{ display: "none" }}
                        />
                        <button
                          disabled={true}
                          aria-label="Attach files is unavailable"
                          className="flex items-center justify-center h-8 w-8 rounded-lg text-token-text-primary dark:text-white focus-visible:outline-black dark:focus-visible:outline-white opacity-30"
                        >
{/*                          <Paperclip className="w-5 h-5" />
*/}                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Send Button */}
                <span className="" data-state="closed">
                  <button
                    disabled={isLoading || !input.trim()}
                    aria-label="Send prompt"
                    data-testid="send-button"
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:outline-black disabled:text-[#f4f4f4] disabled:hover:opacity-100 dark:focus-visible:outline-white disabled:dark:bg-token-text-quaternary dark:disabled:text-token-main-surface-secondary bg-black text-white dark:bg-white dark:text-black disabled:bg-[#D7D7D7]"
                  >
                    <svg
                      width={32}
                      height={32}
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon-2xl"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 