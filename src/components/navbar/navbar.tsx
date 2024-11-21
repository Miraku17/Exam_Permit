import React, { useState } from "react";
import { Menu, X, LogOut, KeyRound } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

interface UserSession {
  user?: {
    fullname: string;
    yearLevel: string;
    course: string;
  };
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession() as { 
    data: UserSession | null;
    status: "loading" | "authenticated" | "unauthenticated";
  };
  const pathname = usePathname();
  
  let navigationLinks: NavLink[] = [
    { href: "/home", label: "Home" },
  ];

  if (session?.user.role !== 'admin') 
    navigationLinks = [
      ...navigationLinks,
      { href: "/payment", label: "Payment" },
      { href: "/history", label: "History" },
    ]

  const isActiveRoute = (href: string): boolean => pathname === href;

  const navLinks = ({preClass, condiClass, condiTwoClass}: String) => {
    return(
      navigationLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`${preClass} ${
            isActiveRoute(link.href)
            ? condiClass
            : condiTwoClass
          }`}
        >
          {link.label}
        </Link>
      ))
    )
  }

  return (
    <nav className="bg-[#1a237e] text-white shadow-lg">
      <div className="max-w-[1600] mx-auto px-4 py-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/home">
              <img
                src="/images/school-logo.png"
                alt="school logo"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-bold ${
                  isActiveRoute(link.href)
                    ? "text-yellow-300 border-b-2 border-yellow-300"
                    : "hover:text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))} */}
            {navLinks({
              preClass: "transition-colors font-bold",
              condiClass: "text-yellow-300 border-b-2 border-yellow-300",
              condiTwoClass: "hover:text-gray-300"
            })}
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
                  {session?.user && (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{session.user.fullname}</span>
                      { session?.user.role !== 'admin' &&
                        <span className="text-xs text-gray-300">
                          {session.user.yearLevel + ' Student - ' + session.user.course}
                        </span>
                      }
                    </div>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm"
                      onClick={() => redirect('/change-password')}
                    >
                      <KeyRound className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm text-red-500 hover:text-red-500 hover:bg-red-50"
                      onClick={() => signOut()}
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
              {/* {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md transition-colors ${
                    isActiveRoute(link.href)
                      ? "bg-blue-900 text-yellow-300"
                      : "hover:bg-blue-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))} */}
              {navLinks({
              preClass: "block px-3 py-2 rounded-md transition-colors",
              condiClass: "bg-blue-900 text-yellow-300",
              condiTwoClass: "hover:bg-blue-900"
            })}

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
                  {session?.user && (
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-medium">
                        {session.user.fullname}
                      </span>
                      <span className="text-xs text-gray-300">
                        {session.user.yearLevel + ' Student - ' + session.user.course}
                      </span>
                    </div>
                  )}
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
                    onClick={() => signOut()}
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