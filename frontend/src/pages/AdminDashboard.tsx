import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  AlertTriangle,
  Briefcase,
  Check,
  Clock,
  Eye,
  FileText,
  Home,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
  Loader2,
  MapPin,
  IdCard,
  Mail,
  Phone,
  Calendar
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { adminNavItems } from "@/config/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getImageUrl } from "@/lib/imageUtils";



export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [deletionRequests, setDeletionRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletionRequests = async () => {
    try {
      const { data } = await api.get('/admin/deletion-requests');
      setDeletionRequests(data);
    } catch (error) {
      console.error("Error fetching deletion requests", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDeletionRequests();
  }, []);

  const updateUserStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      await api.put(`/admin/users/${id}/status`, { status });
      toast({
        title: `User ${status}`,
        description: `User status updated successfully.`,
      });
      fetchUsers();
      if (selectedUser && selectedUser._id === id) {
        setSelectedUser({ ...selectedUser, accountStatus: status });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const viewUserDetails = (user: any) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast({ title: "User Deleted", description: "User removed successfully" });
      fetchUsers();
      fetchDeletionRequests();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    }
  };

  const approveDeletionRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to approve this deletion request? The user account will be permanently deleted.")) return;
    try {
      await api.put(`/admin/deletion-requests/${requestId}/approve`);
      toast({ 
        title: "Request Approved", 
        description: "Account deletion request approved and user account deleted" 
      });
      fetchDeletionRequests();
      fetchUsers();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Failed to approve request", 
        variant: "destructive" 
      });
    }
  };

  const rejectDeletionRequest = async (requestId: string) => {
    try {
      await api.put(`/admin/deletion-requests/${requestId}/reject`);
      toast({ 
        title: "Request Rejected", 
        description: "Account deletion request has been rejected" 
      });
      fetchDeletionRequests();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Failed to reject request", 
        variant: "destructive" 
      });
    }
  };


  const pendingVerifications = users.filter(u => u.accountStatus === 'pending' || (!u.accountStatus && !u.isApproved));
  const activeWorkers = users.filter(u => u.role === 'worker' && u.accountStatus === 'approved').length;
  const totalUsers = users.length;
  const pendingDeletionRequests = deletionRequests.filter(r => r.status === 'pending');

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <DashboardLayout
      navItems={adminNavItems}
      role="admin"
      userName={user?.fullName || "Administrator"}
      userEmail={user?.email || "admin@ssp.lk"}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Platform management and oversight
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={Users}
            variant="admin"
          />
          <StatCard
            title="Active Workers"
            value={activeWorkers}
            icon={ShieldCheck}
            variant="admin"
          />
          <StatCard
            title="Pending Requests"
            value={pendingVerifications.length}
            icon={Clock}
            variant="admin"
          />
          <StatCard
            title="Deletion Requests"
            value={pendingDeletionRequests.length}
            icon={AlertTriangle}
            variant="admin"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="verification" className="space-y-4">
              <TabsList>
                <TabsTrigger value="verification">
                  Verification
                  <Badge variant="secondary" className="ml-2">{pendingVerifications.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="disputes">
                  Account Deletion Requests
                  <Badge variant="destructive" className="ml-2">{pendingDeletionRequests.length}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="verification" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>NIC</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingVerifications.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No pending verifications</TableCell>
                          </TableRow>
                        ) : (
                          pendingVerifications.map((user) => (
                            <TableRow key={user._id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9">
                                    <AvatarFallback className="bg-admin/10 text-admin">
                                      {user.fullName?.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{user.fullName}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">{user.role}</Badge>
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {user.nic || 'N/A'}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {user.phone || 'N/A'}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                                {user.location?.address || 'N/A'}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => viewUserDetails(user)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => updateUserStatus(user._id, 'approved')}>
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => updateUserStatus(user._id, 'rejected')}>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>All Users</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarFallback>
                                    {user.fullName?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.fullName}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="capitalize">{user.role}</TableCell>
                            <TableCell>
                              <Badge variant={user.accountStatus === 'approved' ? 'default' : 'secondary'}>
                                {user.accountStatus || 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                              {user.location?.address || 'N/A'}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => viewUserDetails(user)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteUser(user._id)}>
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="disputes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Deletion Requests</CardTitle>
                    <CardDescription>
                      Review and manage user account deletion requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Requested</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deletionRequests.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No deletion requests
                            </TableCell>
                          </TableRow>
                        ) : (
                          deletionRequests.map((request) => (
                            <TableRow key={request._id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9">
                                    <AvatarFallback>
                                      {request.user?.fullName?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{request.user?.fullName || 'Unknown User'}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {request.user?.email || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="max-w-xs">
                                <p className="text-sm truncate" title={request.reason}>
                                  {request.reason || 'No reason provided'}
                                </p>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    request.status === 'approved' ? 'default' : 
                                    request.status === 'rejected' ? 'destructive' : 
                                    'secondary'
                                  }
                                >
                                  {request.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {request.status === 'pending' ? (
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      className="bg-success hover:bg-success/90" 
                                      onClick={() => approveDeletionRequest(request._id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive" 
                                      onClick={() => rejectDeletionRequest(request._id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">
                                    {request.reviewedBy ? `Reviewed by ${request.reviewedBy?.fullName}` : 'Processed'}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about the user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    Full Name
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedUser.fullName}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4" />
                    Phone
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <IdCard className="h-4 w-4" />
                    NIC Number
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">{selectedUser.nic || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Briefcase className="h-4 w-4" />
                    Role
                  </div>
                  <Badge variant="outline" className="capitalize">{selectedUser.role}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ShieldCheck className="h-4 w-4" />
                    Status
                  </div>
                  <Badge variant={selectedUser.accountStatus === 'approved' ? 'default' : selectedUser.accountStatus === 'rejected' ? 'destructive' : 'secondary'}>
                    {selectedUser.accountStatus || 'Pending'}
                  </Badge>
                </div>
                {selectedUser.rejectionTimestamp && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      Rejected On
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedUser.rejectionTimestamp).toLocaleString()}
                    </p>
                  </div>
                )}
                {selectedUser.createdAt && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      Registered On
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedUser.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Address */}
              {selectedUser.location?.address && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4" />
                    Address
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedUser.location.address}</p>
                  {selectedUser.location.coordinates && (
                    <p className="text-xs text-muted-foreground font-mono">
                      Coordinates: {selectedUser.location.coordinates[1]?.toFixed(6)}, {selectedUser.location.coordinates[0]?.toFixed(6)}
                    </p>
                  )}
                </div>
              )}

              {/* Skills (for workers) */}
              {selectedUser.skills && selectedUser.skills.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Briefcase className="h-4 w-4" />
                    Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.skills.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* NIC Photo */}
              {selectedUser.nicPhoto && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <IdCard className="h-4 w-4" />
                    NIC Photo
                  </div>
                  <div className="border rounded-md p-2">
                    <img 
                      src={getImageUrl(selectedUser.nicPhoto)} 
                      alt="NIC Photo" 
                      className="max-w-full h-auto max-h-96 rounded-md object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Working Photos (for workers) */}
              {selectedUser.role === 'worker' && selectedUser.workingPhotos && selectedUser.workingPhotos.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4" />
                    Working Photos
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedUser.workingPhotos.map((photo: string, idx: number) => (
                      <div key={idx} className="border rounded-md p-2">
                        <img 
                          src={getImageUrl(photo)} 
                          alt={`Working Photo ${idx + 1}`} 
                          className="w-full h-auto max-h-48 rounded-md object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.png';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GP Letters (for workers) */}
              {selectedUser.role === 'worker' && selectedUser.gpLetters && selectedUser.gpLetters.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4" />
                    GP Letters
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedUser.gpLetters.map((letter: string, idx: number) => {
                      // Check if file is PDF by checking filename
                      const filename = letter.split('/').pop() || '';
                      const isPDF = filename.toLowerCase().endsWith('.pdf');
                      
                      return (
                        <div key={idx} className="border rounded-md p-2">
                          {isPDF ? (
                            <a 
                              href={getImageUrl(letter)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              View PDF {idx + 1}
                            </a>
                          ) : (
                            <img 
                              src={getImageUrl(letter)} 
                              alt={`GP Letter ${idx + 1}`} 
                              className="w-full h-auto max-h-48 rounded-md object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-image.png';
                              }}
                            />
                          )}g
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  onClick={() => updateUserStatus(selectedUser._id, 'approved')}
                  className="bg-success hover:bg-success/90"
                  disabled={selectedUser.accountStatus === 'approved'}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button 
                  onClick={() => updateUserStatus(selectedUser._id, 'rejected')}
                  variant="destructive"
                  disabled={selectedUser.accountStatus === 'rejected'}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  onClick={() => updateUserStatus(selectedUser._id, 'pending')}
                  variant="outline"
                  disabled={selectedUser.accountStatus === 'pending'}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Set Pending
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
