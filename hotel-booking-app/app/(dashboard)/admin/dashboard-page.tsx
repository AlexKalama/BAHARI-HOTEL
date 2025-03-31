// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabaseClient } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Activity, 
  BedDouble, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Package, 
  Users,
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";

// Types for dashboard data
interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  pendingBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  roomCount: number;
  packageCount: number;
  recentBookings: any[];
  bookingTrend: number; // percentage change
  revenueTrend: number; // percentage change
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    pendingBookings: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    roomCount: 0,
    packageCount: 0,
    recentBookings: [],
    bookingTrend: 0,
    revenueTrend: 0
  });
  const [timeframe, setTimeframe] = useState("week");
  const [isLoading, setIsLoading] = useState(true);

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Get today's date in ISO format
        const today = new Date().toISOString().split('T')[0];

        // Fetch total bookings count
        const { count: totalBookings, error: bookingsError } = await supabaseClient
          .from('bookings')
          .select('*', { count: 'exact', head: true });

        if (bookingsError) throw bookingsError;

        // Fetch pending bookings
        const { count: pendingBookings, error: pendingError } = await supabaseClient
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (pendingError) throw pendingError;

        // Fetch room count
        const { count: roomCount, error: roomsError } = await supabaseClient
          .from('rooms')
          .select('*', { count: 'exact', head: true });

        if (roomsError) throw roomsError;

        // Fetch package count
        const { count: packageCount, error: packagesError } = await supabaseClient
          .from('packages')
          .select('*', { count: 'exact', head: true });

        if (packagesError) throw packagesError;

        // Fetch today's check-ins
        const { count: todayCheckIns, error: checkInsError } = await supabaseClient
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('check_in_date', today);

        if (checkInsError) throw checkInsError;

        // Fetch today's check-outs
        const { count: todayCheckOuts, error: checkOutsError } = await supabaseClient
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('check_out_date', today);

        if (checkOutsError) throw checkOutsError;

        // Fetch total revenue
        const { data: revenueData, error: revenueError } = await supabaseClient
          .from('bookings')
          .select('total_price')
          .eq('status', 'confirmed');

        if (revenueError) throw revenueError;

        const totalRevenue = revenueData.reduce((sum, booking) => sum + booking.total_price, 0);

        // Calculate occupancy rate (simplified)
        // In a real app, you'd need to calculate this based on actual room availability per day
        const occupancyRate = roomCount ? Math.min(95, (totalBookings / (roomCount * 30)) * 100) : 0;

        // Fetch recent bookings
        const { data: recentBookings, error: recentError } = await supabaseClient
          .from('bookings')
          .select(`
            id,
            guest_name,
            check_in_date,
            check_out_date,
            total_price,
            status,
            payment_status,
            created_at,
            rooms:room_id (name),
            packages:package_id (name)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentError) throw recentError;

        // Calculate booking and revenue trends (mock data for demonstration)
        // In a real app, you would compare current period to previous period
        const bookingTrend = 8.2; // 8.2% increase
        const revenueTrend = 12.5; // 12.5% increase

        setStats({
          totalBookings: totalBookings || 0,
          totalRevenue,
          occupancyRate,
          pendingBookings: pendingBookings || 0,
          todayCheckIns: todayCheckIns || 0,
          todayCheckOuts: todayCheckOuts || 0,
          roomCount: roomCount || 0,
          packageCount: packageCount || 0,
          recentBookings: recentBookings || [],
          bookingTrend,
          revenueTrend
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeframe]);

  // Mock data for chart display
  const generateChartData = () => {
    return [50, 75, 100, 125, 150, 175, 200];
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Hotel management system overview and statistics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs 
            defaultValue="week" 
            className="w-auto" 
            value={timeframe}
            onValueChange={setTimeframe}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main stats section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stats.revenueTrend > 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">{stats.revenueTrend}% increase</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500">{Math.abs(stats.revenueTrend)}% decrease</span>
                </>
              )}
              &nbsp;from previous {timeframe}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stats.bookingTrend > 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">{stats.bookingTrend}% increase</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500">{Math.abs(stats.bookingTrend)}% decrease</span>
                </>
              )}
              &nbsp;from previous {timeframe}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate.toFixed(1)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${stats.occupancyRate}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            <div className="text-xs text-amber-500 mt-1">
              Needs attention
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary stats section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCheckIns}</div>
            <p className="text-xs text-muted-foreground mt-1">Guests arriving today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Check-outs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCheckOuts}</div>
            <p className="text-xs text-muted-foreground mt-1">Guests departing today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.roomCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Total rooms in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.packageCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Active special offers</p>
          </CardContent>
        </Card>
      </div>

      {/* Two-column layout for charts and recent bookings */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
        {/* Revenue chart */}
        <Card className="col-span-1 md:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Revenue trends for {timeframe}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full relative">
              {/* Placeholder for chart - would use a real chart library in production */}
              <div className="absolute inset-0 flex items-end justify-between p-6">
                {generateChartData().map((value, i) => (
                  <div 
                    key={i} 
                    className="w-8 bg-blue-600 rounded-t" 
                    style={{ 
                      height: `${(value / 200) * 100}%`,
                      opacity: 0.7 + (i * 0.05) 
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent bookings */}
        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center">
                  <div className="mr-4 rounded-full p-2 bg-blue-100">
                    <Calendar className="h-4 w-4 text-blue-700" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <p className="text-sm font-medium">{booking.guest_name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="font-medium">{booking.rooms.name}</span>
                      <span className="mx-1">•</span>
                      <span>{new Date(booking.check_in_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(booking.total_price)}</p>
                    <p className={`text-xs ${
                      booking.status === 'confirmed' ? 'text-green-500' : 
                      booking.status === 'pending' ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
              
              {stats.recentBookings.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No recent bookings
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Link href="/admin/bookings" passHref>
              <Button variant="outline" className="w-full">
                <span>View all bookings</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Quick access buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/rooms" passHref>
          <Button variant="outline" className="w-full h-[80px] justify-start px-6 hover:bg-gray-50 dark:hover:bg-gray-900">
            <div className="flex flex-col items-start">
              <div className="flex items-center mb-1">
                <BedDouble className="h-5 w-5 mr-2 text-blue-600" />
                <span className="font-medium">Manage Rooms</span>
              </div>
              <span className="text-xs text-muted-foreground">View and edit room inventory</span>
            </div>
          </Button>
        </Link>
        
        <Link href="/admin/packages" passHref>
          <Button variant="outline" className="w-full h-[80px] justify-start px-6 hover:bg-gray-50 dark:hover:bg-gray-900">
            <div className="flex flex-col items-start">
              <div className="flex items-center mb-1">
                <Package className="h-5 w-5 mr-2 text-green-600" />
                <span className="font-medium">Manage Packages</span>
              </div>
              <span className="text-xs text-muted-foreground">Configure special offerings</span>
            </div>
          </Button>
        </Link>
        
        <Link href="/admin/bookings" passHref>
          <Button variant="outline" className="w-full h-[80px] justify-start px-6 hover:bg-gray-50 dark:hover:bg-gray-900">
            <div className="flex flex-col items-start">
              <div className="flex items-center mb-1">
                <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                <span className="font-medium">Manage Bookings</span>
              </div>
              <span className="text-xs text-muted-foreground">Process reservations and payments</span>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
}
