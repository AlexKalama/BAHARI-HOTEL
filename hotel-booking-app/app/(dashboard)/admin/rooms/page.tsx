import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabaseAdmin } from "@/lib/supabase";

async function getRooms() {
  const { data, error } = await supabaseAdmin
    .from("rooms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }

  return data || [];
}

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <Link href="/admin/rooms/new">
          <Button>Add New Room</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={room.image_url || "/images/room-placeholder.jpg"}
                alt={room.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{room.name}</h3>
                  <p className="text-yellow-800 font-semibold">
                    KES {room.price.toLocaleString()}/night
                  </p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-1">Capacity:</span>
                  <span className="font-medium">{room.capacity}</span>
                </div>
              </div>
              <p className="text-gray-600 mt-2 line-clamp-3">{room.description}</p>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
              <Link href={`/admin/rooms/${room.id}/edit`}>
                <Button variant="outline" size="sm">Edit</Button>
              </Link>
              <form action={async () => {
                "use server";
                await supabaseAdmin
                  .from("rooms")
                  .delete()
                  .eq("id", room.id);
              }}>
                <Button variant="destructive" size="sm">Delete</Button>
              </form>
            </CardFooter>
          </Card>
        ))}
        {rooms.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="mb-4">No rooms found</p>
            <Link href="/admin/rooms/new">
              <Button>Add Your First Room</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}