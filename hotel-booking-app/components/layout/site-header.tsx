import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">La Safari Hotel</span>
          </Link>
          <nav className="hidden md:flex ml-10 space-x-6">
            <Link href="/" className="text-sm hover:text-yellow-800 transition-colors">
              Home
            </Link>
            <Link href="/reservations" className="text-sm hover:text-yellow-800 transition-colors">
              Reservations
            </Link>
            <Link href="/amenities" className="text-sm hover:text-yellow-800 transition-colors">
              Amenities
            </Link>
            <Link href="/about" className="text-sm hover:text-yellow-800 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm hover:text-yellow-800 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link href="/admin">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="outline" size="sm">Log In</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="default" size="sm" className="bg-yellow-700 hover:bg-yellow-800">Sign Up</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}