"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format, differenceInDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabaseClient } from "@/lib/supabase";

type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  amenities: string[] | string;
  image_url: string;
};

export default function ReservationsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(true);
  const [bookingRoom, setBookingRoom] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState({ adults: 1, children: 0 });

  // Helper function to parse amenities from different formats
  const parseAmenities = (amenities: any): string[] => {
    if (!amenities) return [];
    
    if (typeof amenities === 'string') {
      try {
        // Try to parse as JSON string
        return JSON.parse(amenities);
      } catch (e) {
        // If it's not valid JSON, split by comma
        return amenities.split(',').map((item: string) => item.trim()).filter(Boolean);
      }
    }
    
    if (Array.isArray(amenities)) {
      return amenities;
    }
    
    return [];
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabaseClient.from("rooms").select("*");

        if (error) throw error;
        setRooms(data || []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const bookRoom = (room: Room) => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates");
      return;
    }

    // Show loading state for this specific room
    setBookingRoom(room.id);

    // Store booking data in local storage
    localStorage.setItem("selectedRoom", JSON.stringify(room));
    localStorage.setItem("checkInDate", checkInDate.toISOString());
    localStorage.setItem("checkOutDate", checkOutDate.toISOString());
    localStorage.setItem("guestCount", JSON.stringify(guestCount));

    // Navigate to booking confirmation page with short delay to show loading state
    setTimeout(() => {
      router.push(`/reservations/${room.id}`);
    }, 500);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-yellow-800 mb-6">
        Available Rooms
      </h1>

      {/* Date and guest selection */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Stay Details</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Check-in Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Check-out Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  disabled={(date) => !checkInDate || date <= checkInDate}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Guests</label>
            <div className="flex items-center space-x-4">
              <div>
                <label className="text-xs text-gray-500">Adults</label>
                <div className="flex items-center mt-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setGuestCount(prev => ({...prev, adults: Math.max(1, prev.adults - 1)}))}
                  >-</Button>
                  <span className="mx-2 w-8 text-center">{guestCount.adults}</span>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setGuestCount(prev => ({...prev, adults: prev.adults + 1}))}
                  >+</Button>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Children</label>
                <div className="flex items-center mt-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setGuestCount(prev => ({...prev, children: Math.max(0, prev.children - 1)}))}
                  >-</Button>
                  <span className="mx-2 w-8 text-center">{guestCount.children}</span>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setGuestCount(prev => ({...prev, children: prev.children + 1}))}
                  >+</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {checkInDate && checkOutDate && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-8">
          <div className="flex items-center text-green-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Your stay: {format(checkInDate, "PP")} to {format(checkOutDate, "PP")} • {differenceInDays(checkOutDate, checkInDate)} nights • {guestCount.adults} adults, {guestCount.children} children</span>
          </div>
        </div>
      )}

      {/* Room listings */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-yellow-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2">Loading available rooms...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden h-full flex flex-col">
              <div className="h-56 relative">
                <Image
                  src={room.image_url || "/images/room-placeholder.jpg"}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-yellow-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                  KES {room.price.toLocaleString()}/night
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle>{room.name}</CardTitle>
                <CardDescription className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Best location
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Room includes:</h3>
                  <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {parseAmenities(room.amenities).map((amenity, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 mr-2 text-green-500"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                {checkInDate && checkOutDate && (
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">
                        {differenceInDays(checkOutDate, checkInDate)} nights:
                      </span>
                      <span className="font-semibold text-lg">
                        KES {(room.price * differenceInDays(checkOutDate, checkInDate)).toLocaleString()}
                      </span>
                    </div>
                    <Button
                      className="w-full bg-yellow-700 hover:bg-yellow-800 relative"
                      onClick={() => bookRoom(room)}
                      disabled={!checkInDate || !checkOutDate || bookingRoom === room.id}
                    >
                      {bookingRoom === room.id ? (
                        <>
                          <span className="opacity-0">Book Now</span>
                          <svg className="animate-spin h-5 w-5 absolute" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </>
                      ) : "Book Now"}
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
