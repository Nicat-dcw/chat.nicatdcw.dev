"use client";
import { Message } from "../types/chat";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import ChatInput from "./ChatInput";
import { useState } from "react";
import { 
  Volume2,
  Volume2 as VolumeIcon, 
  Copy as CopyIcon, 
  ThumbsUp as ThumbsUpIcon, 
  ThumbsDown as ThumbsDownIcon, 
  RotateCcw as RotateCcwIcon, 
  Bot as BotIcon 
} from 'lucide-react';
import Artifact from '@/app/components/Artifact';

interface ChatProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

type ContentPart = 
  | { type: 'text'; content: string; }
  | { type: 'code'; content: string; lang?: string; title: string; }
  | { type: 'artifact'; content: string; lang?: string; title: string; artifactType: 'code' | 'document' | 'diagram' };

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
      type: 'artifact',
      content: match[1].trim(),
      lang,
      title,
      artifactType: type,
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
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                       
                        <svg  className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><path d="M3.158 13.93a3.75 3.75 0 0 1 0-3.86a1.5 1.5 0 0 1 .993-.7l1.693-.339a.45.45 0 0 0 .258-.153L8.17 6.395c1.182-1.42 1.774-2.129 2.301-1.938S11 5.572 11 7.42v9.162c0 1.847 0 2.77-.528 2.962c-.527.19-1.119-.519-2.301-1.938L6.1 15.122a.45.45 0 0 0-.257-.153L4.15 14.63a1.5 1.5 0 0 1-.993-.7Z"/><path stroke-linecap="round" d="M15.536 8.464a5 5 0 0 1 .027 7.044m4.094-9.165a8 8 0 0 1 .044 11.27"/></g></svg>
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                      <svg className="h-4 w-4 text-gray-500"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><path d="M14 7c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C12.398 4 11.932 4 11 4H8c-1.886 0-2.828 0-3.414.586S4 6.114 4 8v3c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083C5.602 14 6.068 14 7 14"/><rect width="10" height="10" x="10" y="10" rx="2"/></g></svg>
                      </button>
                      
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
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
                <p className="text-gray-800 dark:text-gray-200 text-base bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl">{message.content}</p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
