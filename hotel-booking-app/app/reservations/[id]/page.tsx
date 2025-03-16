"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format, differenceInDays } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { supabaseClient } from "@/lib/supabase";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  adults: z.coerce.number().min(1, { message: "At least 1 adult is required." }),
  children: z.coerce.number().min(0),
  packageId: z.string(),
  specialRequests: z.string().optional(),
});

type PackageOption = {
  id: string;
  name: string;
  description: string;
  price_addon: number;
};

export default function BookingConfirmationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const roomId = params.id;
  const [room, setRoom] = useState<any>(null);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      adults: 1,
      children: 0,
      packageId: "",
      specialRequests: "",
    },
  });

  useEffect(() => {
    // Get room data and dates from local storage
    const storedRoom = localStorage.getItem("selectedRoom");
    const storedCheckInDate = localStorage.getItem("checkInDate");
    const storedCheckOutDate = localStorage.getItem("checkOutDate");

    if (storedRoom && storedCheckInDate && storedCheckOutDate) {
      const parsedRoom = JSON.parse(storedRoom);
      const checkIn = new Date(storedCheckInDate);
      const checkOut = new Date(storedCheckOutDate);
      
      setRoom(parsedRoom);
      setCheckInDate(checkIn);
      setCheckOutDate(checkOut);
      
      const nightCount = differenceInDays(checkOut, checkIn);
      setNights(nightCount);
      setTotalPrice(parsedRoom.price * nightCount);
    } else {
      // If no data in localStorage, fetch from API
      fetchRoomData();
    }

    // Fetch package options
    fetchPackages();
  }, [roomId]);

  const fetchRoomData = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();

      if (error) throw error;
      setRoom(data);
    } catch (error) {
      console.error("Error fetching room:", error);
      router.push("/reservations");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("packages")
        .select("*");

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  const handlePackageSelect = (packageId: string) => {
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    setSelectedPackage(selectedPackage || null);
    
    if (room && nights > 0 && selectedPackage) {
      const packagePrice = selectedPackage.price_addon * nights;
      setTotalPrice(room.price * nights + packagePrice);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!room || !checkInDate || !checkOutDate) {
      alert("Missing booking information. Please try again.");
      return;
    }

    try {
      // Create booking record in Supabase
      const { data: booking, error } = await supabaseClient
        .from("bookings")
        .insert({
          room_id: roomId,
          package_id: data.packageId || null,
          guest_name: data.name,
          guest_email: data.email,
          check_in_date: checkInDate.toISOString(),
          check_out_date: checkOutDate.toISOString(),
          adults: data.adults,
          children: data.children,
          total_price: totalPrice,
          special_requests: data.specialRequests,
          status: "pending",
          payment_status: "unpaid"
        })
        .select()
        .single();

      if (error) throw error;

      // Store booking ID for payment page
      localStorage.setItem("bookingId", booking.id);
      
      // Navigate to payment page
      router.push(`/reservations/${roomId}/payment`);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Room not found</h1>
        <Button 
          className="mt-4 bg-yellow-700 hover:bg-yellow-800"
          onClick={() => router.push("/reservations")}
        >
          Back to Reservations
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-yellow-800 mb-6">Confirm Your Booking</h1>
      
      {/* Room Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{room.name}</CardTitle>
          <CardDescription className="text-lg">
            {checkInDate && checkOutDate ? (
              <>
                {format(checkInDate, "PPP")} to {format(checkOutDate, "PPP")} ({nights} nights)
              </>
            ) : "Select dates to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 relative h-48">
            <Image 
              src={room.image_url || "/images/room-placeholder.jpg"} 
              alt={room.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-600 mb-4">{room.description}</p>
            <div className="space-y-1">
              <p className="font-medium">Base Price: KES {room.price.toLocaleString()}/night</p>
              {selectedPackage && (
                <p className="font-medium">Package: {selectedPackage.name} (+ KES {selectedPackage.price_addon.toLocaleString()}/night)</p>
              )}
              <p className="font-medium">Duration: {nights} nights</p>
              <p className="text-xl font-semibold text-yellow-800 mt-2">
                Total: KES {totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package Selection */}
      <h2 className="text-2xl font-semibold mb-4">Select Package</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {packages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`cursor-pointer transition-all ${
              form.getValues("packageId") === pkg.id ? "border-2 border-yellow-500" : ""
            }`}
            onClick={() => {
              form.setValue("packageId", pkg.id);
              handlePackageSelect(pkg.id);
            }}
          >
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <CardDescription className="text-lg font-medium">
                + KES {pkg.price_addon.toLocaleString()}/night
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{pkg.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Guest Information Form */}
      <h2 className="text-2xl font-semibold mb-4">Guest Information</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+254 123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="adults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adults</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="children"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Children</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requests</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any special requests or requirements..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full md:w-auto bg-yellow-700 hover:bg-yellow-800"
            disabled={!checkInDate || !checkOutDate}
          >
            Proceed to Payment
          </Button>
        </form>
      </Form>
    </div>
  );
}