'use client';
import { useState } from 'react';

interface NavbarProps {
  onSidebarOpen: () => void;
}

export default function Navbar({ onSidebarOpen }: NavbarProps) {
  return (
    <div className="absolute left-0 right-0">
      <div className="draggable no-draggable-children sticky top-0 p-3 mb-1.5 flex items-center justify-between z-10 h-header-height font-semibold bg-token-main-surface-primary max-md:hidden">
        <div className="absolute start-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2" />
        <div className="flex items-center gap-0 overflow-hidden">
          <div className="flex items-center">
            <span className="flex" data-state="closed">
              <button
                onClick={onSidebarOpen}
                aria-label="Open sidebar"
                className="h-10 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 disabled:text-token-text-quaternary focus-visible:bg-[#f9f9f9] enabled:hover:bg-[#f9f9f9]"
              >
                {/* Sidebar Toggle SVG */}
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-xl-heavy">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782..." fill="currentColor" />
                </svg>
              </button>
            </span>
            <span className="flex" data-state="closed">
              <button
                aria-label="New chat"
                className="h-10 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 disabled:text-token-text-quaternary focus-visible:bg-token-sidebar-surface-secondary enabled:hover:bg-token-sidebar-surface-secondary"
              >
                {/* New Chat SVG */}
                <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="icon-xl-heavy">
                  <path d="M15.6729 3.91287C16.8918 2.69392 18.8682 2.69392..." fill="currentColor" />
                </svg>
              </button>
            </span>
          </div>
          <div className="flex items-center justify-center flex-1">
            <span className="text-lg font-semibold text-gray-800">GreesyChat</span>
          </div>
        </div>
        
        {/* Profile Button */}
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
              <div className="overflow-hidden rounded-full" style={{ width: 32, height: 32 }}>
                <div className="relative flex items-center justify-center bg-blue-300 text-white h-full w-full text-sm">
                  <div className="indent-[0.1em] tracking-widest">OC</div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 