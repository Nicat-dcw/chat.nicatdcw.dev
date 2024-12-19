"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import ChatInput from "./components/ChatInput";
import Sidebar from './components/Sidebar';

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleNewChat = () => {
    const newChatId = uuidv4();
    router.push(`/chat/${newChatId}`);
  };
  const [selectedModel, setSelectedModel] = useState("Greesychat");

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const saveToHistory = (chatId: string, message: string) => {
    const newChat = {
      id: chatId,
      title: message.slice(0, 30) + (message.length > 30 ? '...' : ''),
      timestamp: Date.now()
    };
    
    const existingHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const updatedHistory = [newChat, ...existingHistory];
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newChatId = uuidv4();
      saveToHistory(newChatId, input);
      const encodedMessage = encodeURIComponent(input);
      router.push(`/chat/${newChatId}?message=${encodedMessage}`);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>

    <main className="flex-1 relative z-0 overflow-hidden h-screen bg-background">
    {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}

        <div className="draggable sticky top-0 z-10 flex min-h-[60px] dark:bg-[#212121] items-center justify-center border-transparent bg-token-main-surface-primary pl-0 md:hidden">

  <div className="no-draggable absolute bottom-0 left-0 top-0 ml-3 inline-flex items-center justify-center">
    <button
      type="button"
      className="inline-flex rounded-md hover:text-token-text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white active:opacity-50"
      data-testid="open-sidebar-button"
      onClick={toggleSidebar}
    >
      <span className="sr-only">Open sidebar</span>
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="icon-lg mx-2 text-token-text-secondary"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3 8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H4C3.44772 9 3 8.55228 3 8ZM3 16C3 15.4477 3.44772 15 4 15H14C14.5523 15 15 15.4477 15 16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16Z"
          fill="currentColor"
        />
      </svg>
    </button>
  </div>
  <div className="no-draggable">
    <button
      aria-label=""
      type="button"
      id="radix-:rc:"
      aria-haspopup="menu"
      aria-expanded="false"
      data-state="closed"
      onClick={toggleModal}
      data-testid="model-switcher-dropdown-button"
      className="group flex cursor-pointer items-center gap-1 rounded-lg py-1.5 px-3 text-lg hover:bg-token-main-surface-secondary radix-state-open:bg-token-main-surface-secondary font-semibold text-token-text-secondary overflow-hidden whitespace-nowrap"
    >
      <div className="">
        Greesychat <span className="" />
      </div>
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="icon-md text-token-text-tertiary"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z"
          fill="currentColor"
        />
      </svg>
    </button>
  </div>
  <div className="no-draggable absolute bottom-0 right-0 top-0 mr-3 inline-flex items-center justify-center">
    <span className="flex" data-state="closed">
      <button
        onClick={handleNewChat}
        aria-label="New chat"
        className="h-10 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 disabled:text-token-text-quaternary focus-visible:bg-token-sidebar-surface-secondary enabled:hover:bg-token-sidebar-surface-secondary"
      >
        <svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="icon-xl-heavy"
        >
          <path
            d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708ZM11 3.99929C11.0004 4.55157 10.5531 4.99963 10.0008 5.00007C9.00227 5.00084 8.29769 5.00827 7.74651 5.06064C7.20685 5.11191 6.88488 5.20117 6.63803 5.32695C6.07354 5.61457 5.6146 6.07351 5.32698 6.63799C5.19279 6.90135 5.10062 7.24904 5.05118 7.8542C5.00078 8.47105 5 9.26336 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1457C5.10062 16.7509 5.19279 17.0986 5.32698 17.3619C5.6146 17.9264 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8993 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8993 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9264 18.673 17.3619C18.7988 17.1151 18.8881 16.7931 18.9393 16.2535C18.9917 15.7023 18.9991 14.9977 18.9999 13.9992C19.0003 13.4469 19.4484 12.9995 20.0007 13C20.553 13.0004 21.0003 13.4485 20.9999 14.0007C20.9991 14.9789 20.9932 15.7808 20.9304 16.4426C20.8664 17.116 20.7385 17.7136 20.455 18.2699C19.9757 19.2107 19.2108 19.9756 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9421C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9421C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3.24318 17.6776 3.11737 17.0374 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27337 2.99998 8.39922 3.05782 7.69134C3.11737 6.96249 3.24318 6.3223 3.54497 5.73001C4.02433 4.7892 4.78924 4.0243 5.73005 3.54493C6.28633 3.26149 6.88399 3.13358 7.55735 3.06961C8.21919 3.00673 9.02103 3.00083 9.99922 3.00007C10.5515 2.99964 10.9996 3.447 11 3.99929Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </span>
  </div>
</div>

      {""}
      <div className="absolute left-0 right-0">
        <div className="draggable no-draggable-children sticky top-0 p-3 mb-1.5 flex items-center justify-between z-10 h-header-height font-semibold bg-token-main-surface-primary max-md:hidden">
          <div className="absolute start-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2" />
          <div className="flex items-center gap-0 overflow-hidden">
            <div className="flex items-center">
              <span className="flex" data-state="closed">
                <button
                  onClick={toggleSidebar}
                  aria-label="Open sidebar"
                  className="h-10 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 disabled:text-token-text-quaternary focus-visible:bg-[#f9f9f9] enabled:hover:bg-[#f9f9f9]"
                >
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon-xl-heavy"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782C18.5375 3.11737 19.1777 3.24318 19.77 3.54497C20.7108 4.02433 21.4757 4.78924 21.955 5.73005C22.2568 6.32234 22.3826 6.96253 22.4422 7.69138C22.5 8.39925 22.5 9.27339 22.5 10.3572V13.6428C22.5 14.7266 22.5 15.6008 22.4422 16.3086C22.3826 17.0375 22.2568 17.6777 21.955 18.27C21.4757 19.2108 20.7108 19.9757 19.77 20.455C19.1777 20.7568 18.5375 20.8826 17.8086 20.9422C17.1008 21 16.2266 21 15.1428 21H8.85717C7.77339 21 6.89925 21 6.19138 20.9422C5.46253 20.8826 4.82234 20.7568 4.23005 20.455C3.28924 19.9757 2.52433 19.2108 2.04497 18.27C1.74318 17.6777 1.61737 17.0375 1.55782 16.3086C1.49998 15.6007 1.49999 14.7266 1.5 13.6428V10.3572C1.49999 9.27341 1.49998 8.39926 1.55782 7.69138C1.61737 6.96253 1.74318 6.32234 2.04497 5.73005C2.52433 4.78924 3.28924 4.02433 4.23005 3.54497C4.82234 3.24318 5.46253 3.11737 6.19138 3.05782C6.89926 2.99998 7.77341 2.99999 8.85719 3ZM6.35424 5.05118C5.74907 5.10062 5.40138 5.19279 5.13803 5.32698C4.57354 5.6146 4.1146 6.07354 3.82698 6.63803C3.69279 6.90138 3.60062 7.24907 3.55118 7.85424C3.50078 8.47108 3.5 9.26339 3.5 10.4V13.6C3.5 14.7366 3.50078 15.5289 3.55118 16.1458C3.60062 16.7509 3.69279 17.0986 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.40138 18.8072 5.74907 18.8994 6.35424 18.9488C6.97108 18.9992 7.76339 19 8.9 19H9.5V5H8.9C7.76339 5 6.97108 5.00078 6.35424 5.05118ZM11.5 5V19H15.1C16.2366 19 17.0289 18.9992 17.6458 18.9488C18.2509 18.8994 18.5986 18.8072 18.862 18.673C19.4265 18.3854 19.8854 17.9265 20.173 17.362C20.3072 17.0986 20.3994 16.7509 20.4488 16.1458C20.4992 15.5289 20.5 14.7366 20.5 13.6V10.4C20.5 9.26339 20.4992 8.47108 20.4488 7.85424C20.3994 7.24907 20.3072 6.90138 20.173 6.63803C19.8854 6.07354 19.4265 5.6146 18.862 5.32698C18.5986 5.19279 18.2509 5.10062 17.6458 5.05118C17.0289 5.00078 16.2366 5 15.1 5H11.5ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H7C7.55229 7.5 8 7.94772 8 8.5C8 9.05229 7.55229 9.5 7 9.5H6C5.44772 9.5 5 9.05229 5 8.5ZM5 12C5 11.4477 5.44772 11 6 11H7C7.55229 11 8 11.4477 8 12C8 12.5523 7.55229 13 7 13H6C5.44772 13 5 12.5523 5 12Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </span>
              <span className="flex" data-state="closed">
                <button
                  aria-label="New chat"
                  className="h-10 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 disabled:text-token-text-quaternary focus-visible:bg-token-sidebar-surface-secondary enabled:hover:bg-token-sidebar-surface-secondary"
                >
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon-xl-heavy"
                  >
                    <path
                      d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392 20.0871 3.91287C21.3061 5.13182 21.3061 7.10813 20.0871 8.32708L14.1499 14.2643C13.3849 15.0293 12.3925 15.5255 11.3215 15.6785L9.14142 15.9899C8.82983 16.0344 8.51546 15.9297 8.29289 15.7071C8.07033 15.4845 7.96554 15.1701 8.01005 14.8586L8.32149 12.6785C8.47449 11.6075 8.97072 10.615 9.7357 9.85006L15.6729 3.91287ZM18.6729 5.32708C18.235 4.88918 17.525 4.88918 17.0871 5.32708L11.1499 11.2643C10.6909 11.7233 10.3932 12.3187 10.3014 12.9613L10.1785 13.8215L11.0386 13.6986C11.6812 13.6068 12.2767 13.3091 12.7357 12.8501L18.6729 6.91287C19.1108 6.47497 19.1108 5.76499 18.6729 5.32708ZM11 3.99929C11.0004 4.55157 10.5531 4.99963 10.0008 5.00007C9.00227 5.00084 8.29769 5.00827 7.74651 5.06064C7.20685 5.11191 6.88488 5.20117 6.63803 5.32695C6.07354 5.61457 5.6146 6.07351 5.32698 6.63799C5.19279 6.90135 5.10062 7.24904 5.05118 7.8542C5.00078 8.47105 5 9.26336 5 10.4V13.6C5 14.7366 5.00078 15.5289 5.05118 16.1457C5.10062 16.7509 5.19279 17.0986 5.32698 17.3619C5.6146 17.9264 6.07354 18.3854 6.63803 18.673C6.90138 18.8072 7.24907 18.8993 7.85424 18.9488C8.47108 18.9992 9.26339 19 10.4 19H13.6C14.7366 19 15.5289 18.9992 16.1458 18.9488C16.7509 18.8993 17.0986 18.8072 17.362 18.673C17.9265 18.3854 18.3854 17.9264 18.673 17.3619C18.7988 17.1151 18.8881 16.7931 18.9393 16.2535C18.9917 15.7023 18.9991 14.9977 18.9999 13.9992C19.0003 13.4469 19.4484 12.9995 20.0007 13C20.553 13.0004 21.0003 13.4485 20.9999 14.0007C20.9991 14.9789 20.9932 15.7808 20.9304 16.4426C20.8664 17.116 20.7385 17.7136 20.455 18.2699C19.9757 19.2107 19.2108 19.9756 18.27 20.455C17.6777 20.7568 17.0375 20.8826 16.3086 20.9421C15.6008 21 14.7266 21 13.6428 21H10.3572C9.27339 21 8.39925 21 7.69138 20.9421C6.96253 20.8826 6.32234 20.7568 5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3.24318 17.6776 3.11737 17.0374 3.05782 16.3086C2.99998 15.6007 2.99999 14.7266 3 13.6428V10.3572C2.99999 9.27337 2.99998 8.39922 3.05782 7.69134C3.11737 6.96249 3.24318 6.3223 3.54497 5.73001C4.02433 4.7892 4.78924 4.0243 5.73005 3.54493C6.28633 3.26149 6.88399 3.13358 7.55735 3.06961C8.21919 3.00673 9.02103 3.00083 9.99922 3.00007C10.5515 2.99964 10.9996 3.447 11 3.99929Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </span>
            </div>
            <div className="flex items-center justify-center flex-1">
              <span className="text-lg font-semibold text-gray-800">GreesyChat</span>
            </div>
          </div>
          <div className="gap-2 flex items-center pr-1 leading-[0]">
            <button
              aria-label="Open Profile Menu"
              data-testid="profile-button"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f9f9f9] focus-visible:bg-[#f9f9f9] focus-visible:outline-0"
              type="button"
              id="radix-:r4:"
              aria-haspopup="menu"
              aria-expanded="false"
              data-state="closed"
            >
              <div className="flex items-center justify-center overflow-hidden rounded-full">
                <div
                  className="overflow-hidden rounded-full"
                  style={{ width: 32, height: 32 }}
                >
                  <div className="relative flex items-center justify-center bg-blue-300 text-white h-full w-full text-sm">
                    <div className="indent-[0.1em] tracking-widest">OC</div>
                  </div>
                </div>
              </div>
            </button>
          </div>
          
        </div>
        

        {/* Add Modal */}
        {isModalOpen && (
          <div
            ref={modalRef}
            data-radix-popper-content-wrapper
            dir="ltr"
            style={{
              position: "fixed",
              left: "0px",
              top: "0px",
              transform: "translate(92px, 56px)",
              minWidth: "max-content",
              zIndex: 50,
            }}
          >
            <div
              data-side="bottom"
              data-align="start"
              role="menu"
              aria-orientation="vertical"
              data-state="open"
              className="z-50 border border-[#e3e3e3] max-w-xs rounded-2xl popover bg-white dark:bg-[#212121] shadow-lg will-change-[opacity,transform] border border-token-border-light py-2 min-w-[340px] overflow-hidden"
            >
              {/* ChatGPT Plus Option */}
              <div
                role="menuitem"
                className="flex hidden items-center m-1.5 p-2.5 text-sm cursor-pointer group relative hover:bg-[#f5f5f5] rounded-md my-0 px-3 mx-2 gap-2.5 py-3 !pr-3"
              >
                {/* ... content for ChatGPT Plus option ... */}
              </div>

              {/* ChatGPT Option */}
              <div
                role="menuitem"
                className="flex items-center m-1.5 p-2.5 text-sm cursor-pointer focus-visible:outline-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 group relative hover:bg-[#f5f5f5] focus-visible:bg-[#f5f5f5] radix-state-open:bg-[#f5f5f5] dark:hover:bg-[#f9f9f9] dark:focus-visible:bg-[#f9f9f9] rounded-md my-0 px-3 mx-2 dark:radix-state-open:bg-[#f9f9f9] gap-2.5 py-3 !pr-3 !opacity-100"
                tabIndex={-1}
                data-orientation="vertical"
                data-radix-collection-item
              >
                <div className="flex grow items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#f9f9f9]">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-token-text-primary"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 7.42a22.323 22.323 0 0 0-2.453 2.127A22.323 22.323 0 0 0 7.42 12a22.32 22.32 0 0 0 2.127 2.453c.807.808 1.636 1.52 2.453 2.128a22.335 22.335 0 0 0 2.453-2.128A22.322 22.322 0 0 0 16.58 12a22.326 22.326 0 0 0-2.127-2.453A22.32 22.32 0 0 0 12 7.42Zm1.751-1.154a24.715 24.715 0 0 1 2.104 1.88 24.722 24.722 0 0 1 1.88 2.103c.316-.55.576-1.085.779-1.59.35-.878.507-1.625.503-2.206-.003-.574-.16-.913-.358-1.111-.199-.199-.537-.356-1.112-.36-.58-.003-1.328.153-2.205.504-.506.203-1.04.464-1.59.78Zm3.983 7.485a24.706 24.706 0 0 1-1.88 2.104 24.727 24.727 0 0 1-2.103 1.88 12.7 12.7 0 0 0 1.59.779c.878.35 1.625.507 2.206.503.574-.003.913-.16 1.111-.358.199-.199.356-.538.36-1.112.003-.58-.154-1.328-.504-2.205a12.688 12.688 0 0 0-.78-1.59ZM12 18.99c.89.57 1.768 1.03 2.605 1.364 1.026.41 2.036.652 2.955.646.925-.006 1.828-.267 2.5-.94.673-.672.934-1.575.94-2.5.006-.919-.236-1.929-.646-2.954A15.688 15.688 0 0 0 18.99 12a15.6 15.6 0 0 0 1.364-2.606c.41-1.025.652-2.035.646-2.954-.006-.925-.267-1.828-.94-2.5-.672-.673-1.575-.934-2.5-.94-.919-.006-1.929.235-2.954.646-.838.335-1.716.795-2.606 1.364a15.69 15.69 0 0 0-2.606-1.364C8.37 3.236 7.36 2.994 6.44 3c-.925.006-1.828.267-2.5.94-.673.672-.934 1.575-.94 2.5-.006.919.235 1.929.646 2.955A15.69 15.69 0 0 0 5.01 12c-.57.89-1.03 1.768-1.364 2.605-.41 1.026-.652 2.036-.646 2.955.006.925.267 1.828.94 2.5.672.673 1.575.934 2.5.94.92.006 1.93-.235 2.955-.646A15.697 15.697 0 0 0 12 18.99Zm-1.751-1.255a24.714 24.714 0 0 1-2.104-1.88 24.713 24.713 0 0 1-1.88-2.104c-.315.55-.576 1.085-.779 1.59-.35.878-.507 1.625-.503 2.206.003.574.16.913.359 1.111.198.199.537.356 1.111.36.58.003 1.328-.153 2.205-.504.506-.203 1.04-.463 1.59-.78Zm-3.983-7.486a24.727 24.727 0 0 1 1.88-2.104 24.724 24.724 0 0 1 2.103-1.88 12.696 12.696 0 0 0-1.59-.779c-.878-.35-1.625-.507-2.206-.503-.574.003-.913.16-1.111.359-.199.198-.356.537-.36 1.111-.003.58.153 1.328.504 2.205.203.506.464 1.04.78 1.59Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <div>
                        Greesychat Turbo
                        <div className="text-xs">
                          Great for everyday tasks
                        </div>
                      </div>
                    </div>
                  </div>
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon-md"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM16.0755 7.93219C16.5272 8.25003 16.6356 8.87383 16.3178 9.32549L11.5678 16.0755C11.3931 16.3237 11.1152 16.4792 10.8123 16.4981C10.5093 16.517 10.2142 16.3973 10.0101 16.1727L7.51006 13.4227C7.13855 13.014 7.16867 12.3816 7.57733 12.0101C7.98598 11.6386 8.61843 11.6687 8.98994 12.0773L10.6504 13.9039L14.6822 8.17451C15 7.72284 15.6238 7.61436 16.0755 7.93219Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>

              {/* Separator */}
              <div
                role="separator"
                aria-orientation="horizontal"
                className="hidden mx-5 my-1 h-px bg-token-border-light"
              />
            </div>
          </div>
        )}
        
      </div>

        <div className={`flex-1 flex items-center justify-center mt-40 ${isSidebarOpen ? 'ml-72 ' : ''}`}>
      <div className="w-full max-w-3xl px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">What can i help you with?</h1>
        <ChatInput
          input={input}
          isLoading={false}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          selectedModel={selectedModel}
          onModelSelect={() => {setSelectedModel("Greesychat")}}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 max-w-2xl mx-auto px-4">
          <button 
            className="group p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200 bg-white dark:bg-transparent"
            onClick={() => handleInputChange("Code a simple landing page")}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-transparent text-blue-600 dark:text-blue-300">
                <svg 
                  className="w-6 h-6"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="text-left">
                <h2 className="text-md font-semibold text-gray-800 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white">
                  Code a simple landing page
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                  Create a responsive landing page with modern design
                </p>
              </div>
            </div>
          </button>

          <button 
            className="group p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200 bg-white dark:bg-transparent"
            onClick={() => handleInputChange("Build a React component")}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-transparent text-green-600 dark:text-green-300">
                <svg 
                  className="w-6 h-6"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <div className="text-left">
                <h2 className="text-md font-semibold text-gray-800 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white">
                  Build a React component
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                  Design and implement a reusable React component
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
    </main>
    </>
  );
}
