import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabaseAdmin } from "@/lib/supabase";

async function getStats() {
  const [
    { count: totalBookings },
    { count: pendingBookings },
    { count: confirmedBookings },
    { data: totalRevenue }
  ] = await Promise.all([
    supabaseAdmin.from("bookings").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabaseAdmin.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabaseAdmin.from("bookings").select("sum(total_price)").eq("payment_status", "paid").single()
  ]);

  return {
    totalBookings: totalBookings || 0,
    pendingBookings: pendingBookings || 0,
    confirmedBookings: confirmedBookings || 0,
    totalRevenue: totalRevenue?.sum || 0
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalBookings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingBookings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Confirmed Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.confirmedBookings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">KES {stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6">Recent Activity</h2>
      {/* You can add recent bookings or activity feed here */}
    </div>
  );
}