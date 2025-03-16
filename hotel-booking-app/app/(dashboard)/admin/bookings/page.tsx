import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabaseAdmin } from "@/lib/supabase";

async function getBookings() {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select(`
      *,
      rooms:room_id (name),
      packages:package_id (name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }

  return data || [];
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "unpaid":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case "refunded":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <Button>Export Data</Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {booking.id.substring(0, 8).toUpperCase()}
                </TableCell>
                <TableCell>
                  <div>{booking.guest_name}</div>
                  <div className="text-sm text-gray-500">{booking.guest_email}</div>
                </TableCell>
                <TableCell>
                  <div>{booking.rooms.name}</div>
                  {booking.packages && (
                    <div className="text-sm text-gray-500">{booking.packages.name}</div>
                  )}
                </TableCell>
                <TableCell>{format(new Date(booking.check_in_date), "PPP")}</TableCell>
                <TableCell>{format(new Date(booking.check_out_date), "PPP")}</TableCell>
                <TableCell>KES {booking.total_price.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getPaymentStatusColor(booking.payment_status)}>
                    {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}