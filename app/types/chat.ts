export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  artifacts?: Artifact[];
}

export interface Artifact {
  type: "code" | "shell";
  title: string;
  content: string;
  language?: string;
  path?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}
