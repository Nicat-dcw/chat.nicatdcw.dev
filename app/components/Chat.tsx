"use client";
import { Message } from "../types/chat";

import Artifact from '@/app/components/Artifact';

interface ChatProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}
type ContentPart = 
  | { type: "text"; content: string }
  | { type: "code"; content: string; lang?: string; title: string }
  | { type: "artifact"; content: string; lang?: string; title: string; artifactType: "code" | "document" | "diagram" }
  
function parseContent(content: string): ContentPart[] {
  // First split by artifact tags
  const artifactRegex = /<greesyArtifacts.*?>([\s\S]*?)<\/greesyArtifacts>/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = artifactRegex.exec(content)) !== null) {
    // Add text before the artifact
    if (match.index > lastIndex) {
      const textContent = content.slice(lastIndex, match.index);
      // Parse regular code blocks in text content
      parts.push(...parseCodeBlocks(textContent));
    }

    // Parse artifact attributes
    const attributesStr = match[0].split('>')[0];
    const lang = attributesStr.match(/lang="([^"]*)"/)?.[ 1];
    const title = attributesStr.match(/title="([^"]*)"/)?.[ 1] || 'Code Snippet';
    const type = attributesStr.match(/type="([^"]*)"/)?.[ 1] || 'code';

    parts.push({
      type: 'artifact' as const,
      content: match[1].trim(),
      lang,
      title,
      artifactType: type as "code" | "document" | "diagram",
    });

    lastIndex = artifactRegex.lastIndex;
  }

  // Add remaining text and parse its code blocks
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex);
    parts.push(...parseCodeBlocks(remainingText));
  }

  return parts;
}

function parseCodeBlocks(text: string): ContentPart[] {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: ContentPart[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      });
    }

    parts.push({
      type: 'code',
      content: match[2].trim(),
      lang: match[1] || 'plaintext',
      title: 'Code Snippet',
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex),
    });
  }

  return parts;
}

export default function Chat({ messages, messagesEndRef }: ChatProps) {
  return (
    <div className="flex flex-col space-y-4">
      {messages
        .filter(message => message.role !== "system")
        .map((message, index) => {
        if (message.role === "assistant") {
          const parts = parseContent(message.content);
          
          return (
            <article 
              key={index}
              className="w-full"
              dir="auto"
            >
              <div className="m-auto py-4 px-4 w-full max-w-3xl">
                <div className="flex gap-4 items-start">
                  {/* Bot Avatar */}
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                     {/** <BotIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" /> */}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1">
                    <div className="markdown prose w-full break-words dark:prose-invert light">
                      {parts.map((part, i) => {
                        if (part.type === 'artifact' || part.type === 'code') {
                          return (
                            <Artifact
                              key={i}
                              content={part.content}
                              lang={part.lang}
                              title={part.title}
                              type={part.type === 'artifact' ? part.artifactType : 'code'}
                            />
                          );
                        }
                        return <p key={i}>{part.content}</p>;
                      })}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-3">
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-md transition-colors">
                       
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:text-gray-200 w-5 h-5 icon-md-heavy"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 4.9099C11 4.47485 10.4828 4.24734 10.1621 4.54132L6.67572 7.7372C6.49129 7.90626 6.25019 8.00005 6 8.00005H4C3.44772 8.00005 3 8.44776 3 9.00005V15C3 15.5523 3.44772 16 4 16H6C6.25019 16 6.49129 16.0938 6.67572 16.2629L10.1621 19.4588C10.4828 19.7527 11 19.5252 11 19.0902V4.9099ZM8.81069 3.06701C10.4142 1.59714 13 2.73463 13 4.9099V19.0902C13 21.2655 10.4142 22.403 8.81069 20.9331L5.61102 18H4C2.34315 18 1 16.6569 1 15V9.00005C1 7.34319 2.34315 6.00005 4 6.00005H5.61102L8.81069 3.06701ZM20.3166 6.35665C20.8019 6.09313 21.409 6.27296 21.6725 6.75833C22.5191 8.3176 22.9996 10.1042 22.9996 12.0001C22.9996 13.8507 22.5418 15.5974 21.7323 17.1302C21.4744 17.6185 20.8695 17.8054 20.3811 17.5475C19.8927 17.2896 19.7059 16.6846 19.9638 16.1962C20.6249 14.9444 20.9996 13.5175 20.9996 12.0001C20.9996 10.4458 20.6064 8.98627 19.9149 7.71262C19.6514 7.22726 19.8312 6.62017 20.3166 6.35665ZM15.7994 7.90049C16.241 7.5688 16.8679 7.65789 17.1995 8.09947C18.0156 9.18593 18.4996 10.5379 18.4996 12.0001C18.4996 13.3127 18.1094 14.5372 17.4385 15.5604C17.1357 16.0222 16.5158 16.1511 16.0539 15.8483C15.5921 15.5455 15.4632 14.9255 15.766 14.4637C16.2298 13.7564 16.4996 12.9113 16.4996 12.0001C16.4996 10.9859 16.1653 10.0526 15.6004 9.30063C15.2687 8.85905 15.3578 8.23218 15.7994 7.90049Z" fill="currentColor"></path></svg>
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-md transition-colors">
                      <svg className="h-5 w-5 dark:text-gray-200 text-gray-500"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><path d="M14 7c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C12.398 4 11.932 4 11 4H8c-1.886 0-2.828 0-3.414.586S4 6.114 4 8v3c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083C5.602 14 6.068 14 7 14"/><rect width="10" height="10" x="10" y="10" rx="2"/></g></svg>
                      </button>
                      
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-md transition-colors">
                      <svg  className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.5 9a10 10 0 0 0-19 0M2 5v4h4m12 6h4v4M2.5 15a10 10 0 0 0 19 0"/></svg>                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        }

        // User message
        return (
          <div key={index} className="m-auto py-4 px-4 w-full max-w-3xl">
            <div className="flex gap-4 items-start justify-end">
              <div className="prose dark:prose-invert max-w-[90%]">
                <p className="text-gray-800 dark:text-gray-200 text-base bg-gray-100 dark:bg-[#323232d9] px-4 py-2 rounded-2xl">{message.content}</p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
