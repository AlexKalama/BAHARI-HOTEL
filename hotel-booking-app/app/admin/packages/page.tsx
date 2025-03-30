"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Package {
  id: string;
  name: string;
  description: string;
  price_addon: number;
  created_at: string;
}

export default function PackageManagement() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{
    name: string;
    description: string;
    price_addon: string;
  }>();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from("packages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to load packages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async (data: any) => {
    try {
      setSubmitting(true);
      const packageData = {
        name: data.name,
        description: data.description,
        price_addon: parseFloat(data.price_addon),
      };

      let response;
      if (selectedPackage) {
        // Edit existing package
        response = await supabaseClient
          .from("packages")
          .update(packageData)
          .eq("id", selectedPackage.id)
          .select();
        
        toast.success("Package updated successfully!");
      } else {
        // Add new package
        response = await supabaseClient
          .from("packages")
          .insert(packageData)
          .select();
        
        toast.success("New package added successfully!");
      }

      if (response.error) throw response.error;
      
      reset();
      setOpenDialog(false);
      fetchPackages();
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error("Failed to save package. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPackage) return;
    
    try {
      setSubmitting(true);
      const { error } = await supabaseClient
        .from("packages")
        .delete()
        .eq("id", selectedPackage.id);

      if (error) throw error;
      
      toast.success("Package deleted successfully!");
      setDeleteDialogOpen(false);
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (pkg: Package) => {
    setSelectedPackage(pkg);
    reset({
      name: pkg.name,
      description: pkg.description,
      price_addon: pkg.price_addon.toString(),
    });
    setOpenDialog(true);
  };

  const openAddDialog = () => {
    setSelectedPackage(null);
    reset({
      name: "",
      description: "",
      price_addon: "",
    });
    setOpenDialog(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Package Management</h1>
        <Button onClick={openAddDialog}>Add New Package</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Packages</CardTitle>
          <CardDescription>
            Manage the packages offered to guests during their booking process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-700" />
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No packages found. Add your first package to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price Add-on (KES)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell className="max-w-md truncate">{pkg.description}</TableCell>
                    <TableCell>{pkg.price_addon.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => openEditDialog(pkg)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedPackage ? "Edit Package" : "Add New Package"}</DialogTitle>
            <DialogDescription>
              {selectedPackage 
                ? "Update the package details below." 
                : "Fill in the package details to create a new option for guests."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(handleAddEdit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Package Name</Label>
              <Input 
                id="name"
                placeholder="e.g., Bed & Breakfast"
                {...register("name", { required: "Package name is required" })}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                placeholder="Describe what's included in this package..."
                rows={3}
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price_addon">Price Add-on (KES)</Label>
              <Input 
                id="price_addon"
                type="number"
                step="0.01"
                placeholder="e.g., 1000.00"
                {...register("price_addon", { 
                  required: "Price is required",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Please enter a valid price"
                  }
                })}
              />
              {errors.price_addon && <p className="text-sm text-red-500">{errors.price_addon.message}</p>}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Package'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the &quot;{selectedPackage?.name}&quot; package? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Package'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
