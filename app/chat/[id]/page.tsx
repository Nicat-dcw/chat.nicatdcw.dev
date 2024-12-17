"use client";
import { useState, useRef, useEffect } from "react";
import { Message } from "../../types/chat";
import { openai, SYSTEM_PROMPT } from "../../utils/openai";
import ChatInput from "../../components/ChatInput";
import Chat from "../../components/Chat";
import { useSearchParams } from 'next/navigation';

export default function ChatPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("meta-llama/llama-3.2-1b-instruct:free");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageProcessed = useRef(false);

  // Handle initial message from URL
  useEffect(() => {
    const initialMessage = searchParams.get('message');
    if (initialMessage && !initialMessageProcessed.current) {
      initialMessageProcessed.current = true;
      const decodedMessage = decodeURIComponent(initialMessage);
      handleInitialMessage(decodedMessage);
    }
  }, [searchParams]);

  const handleInitialMessage = async (message: string) => {
    const userMessage: Message = { role: "user", content: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: selectedModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          userMessage
        ],
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.choices[0]?.message?.content || "Sorry, I couldn't process that.",
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: selectedModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
          userMessage
        ],
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.choices[0]?.message?.content || "Sorry, I couldn't process that.",
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
  };

  return (
    <>
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="flex h-[60px] items-center justify-between px-4">
          <span className="text-lg font-semibold">GreesyChat</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto h-full max-w-2xl px-4 py-4">
          <Chat messages={messages} messagesEndRef={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
   
    </div>
    <footer className="bg-white px-4 py-2 z-50">
        <div className="mx-auto max-w-2xl sticky mt-2 bottom-0">
          <ChatInput
            input={input}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            selectedModel={selectedModel}
            onModelSelect={handleModelSelect}
          />
        </div>
        <p className="text-gray-500 text-sm text-center mt-2">AI can make mistakes. Please be careful.</p>
      </footer>
  </>
  );
} 