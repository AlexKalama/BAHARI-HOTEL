"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabaseClient } from "@/lib/supabase";

type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  amenities: string[];
  image_url: string;
};

export default function ReservationsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("rooms")
          .select("*");

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

    // Store booking data in local storage
    localStorage.setItem("selectedRoom", JSON.stringify(room));
    localStorage.setItem("checkInDate", checkInDate.toISOString());
    localStorage.setItem("checkOutDate", checkOutDate.toISOString());

    // Navigate to booking confirmation page
    router.push(`/reservations/${room.id}`);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-yellow-800 mb-6">Available Rooms</h1>
      
      {/* Date selection */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Your Dates</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Check-in Date</label>
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
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Check-out Date</label>
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
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

     {/* Room listings */}
     {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading available rooms...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden">
              <div className="h-56 relative">
                <Image
                  src={room.image_url || "/images/room-placeholder.jpg"}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{room.name}</CardTitle>
                <CardDescription className="text-lg font-semibold text-yellow-800">
                  KES {room.price.toLocaleString()}/night
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{room.description}</p>
                <div className="space-y-2">
                  <h3 className="font-medium">Amenities:</h3>
                  <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {(room.amenities || []).map((amenity, index) => (
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
              <CardFooter>
                <Button 
                  className="w-full bg-yellow-700 hover:bg-yellow-800"
                  onClick={() => bookRoom(room)}
                  disabled={!checkInDate || !checkOutDate}
                >
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}