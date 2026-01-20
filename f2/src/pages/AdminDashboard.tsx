import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Loader2
} from "lucide-react";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Verification", href: "/admin/verification", icon: ShieldCheck },
  { label: "Disputes", href: "/admin/disputes", icon: AlertTriangle, badge: 0 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Activity Logs", href: "/admin/logs", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/admin/users/${id}/status`, { status });
      toast({
        title: `User ${status}`,
        description: `User status updated successfully.`,
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast({ title: "User Deleted", description: "User removed successfully" });
      fetchUsers();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    }
  };


  const pendingVerifications = users.filter(u => u.accountStatus === 'pending' || (!u.accountStatus && !u.isApproved));
  const activeWorkers = users.filter(u => u.role === 'worker' && u.accountStatus === 'approved').length;
  const totalUsers = users.length;

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <DashboardLayout
      navItems={navItems}
      role="admin"
      userName="Administrator"
      userEmail="admin@ssp.lk"
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
            title="Open Disputes"
            value={0}
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
                  Disputes
                  <Badge variant="destructive" className="ml-2">0</Badge>
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
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingVerifications.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No pending verifications</TableCell>
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
                              <TableCell>
                                <div className="flex gap-2">
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
                            <TableCell>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => deleteUser(user._id)}>
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="disputes">
                <div className="text-center py-12 text-muted-foreground">
                  No active disputes.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
