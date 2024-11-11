"use client";
import React, { useState } from "react";
import { Menu, X, LogOut, KeyRound } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#1a237e] text-white shadow-lg">
      <div className="max-w-[1600] mx-auto px-4 py-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <img
              src="/images/school-logo.png"
              alt="school logo"
              className="h-10 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="hover:text-gray-300 transition-colors font-bold">
              Home
            </a>
            <a href="/payment" className="hover:text-gray-300 transition-colors font-bold">
              Payment
            </a>
            <a href="/history" className="hover:text-gray-300 transition-colors font-bold">
              History
            </a>
          </div>

          {/* User Profile with Popover */}
          <div className="hidden md:flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <img
                      src="/images/user-profile.png"
                      alt="Profile"
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Cyrus Noel Carano-o</span>
                    <span className="text-xs text-gray-300">
                      1st Year Student - BS CPE
                    </span>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-4">
                  {/* <div className="font-medium">Cyrus Noel Carano-o</div> */}
                  {/* <Separator /> */}
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm"
                      onClick={() => {/* Add change password logic */}}
                    >
                      <KeyRound className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm text-red-500 hover:text-red-500 hover:bg-red-50"
                      onClick={() => {/* Add sign out logic */}}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-900 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#"
                className="block px-3 py-2 rounded-md hover:bg-blue-900 transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md hover:bg-blue-900 transition-colors"
              >
                Payment
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md hover:bg-blue-900 transition-colors"
              >
                History
              </a>

              {/* Mobile User Profile */}
              <div className="px-3 py-2">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <img
                      src="/images/user-profile.png"
                      alt="Profile"
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium">
                      Cyrus Noel Carano-o
                    </span>
                    <span className="text-xs text-gray-300">
                      1st Year Student - BS CPE
                    </span>
                  </div>
                </div>
                {/* Mobile Profile Actions */}
                <div className="mt-3 space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-white hover:text-white hover:bg-blue-900"
                    onClick={() => {/* Add change password logic */}}
                  >
                    <KeyRound className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-400 hover:text-red-400 hover:bg-blue-900"
                    onClick={() => {/* Add sign out logic */}}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;