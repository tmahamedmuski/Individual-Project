import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { VerificationCard } from '@/components/admin/VerificationCard';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from '@/components/ui/button';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  nic: string;
  phone: string;
  accountStatus: string;
  isApproved: boolean;
  createdAt: string;
}

import { UserDetailsDialog } from '@/components/admin/UserDetailsDialog';
import { EditUserDialog } from '@/components/admin/EditUserDialog';

// ... (existing imports)

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("verification");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
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
        variant: status === 'approved' ? 'default' : 'destructive'
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast({ title: "User Deleted", description: "User has been removed successfully." });
      fetchUsers();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  }

  const pendingUsers = users.filter(u => u.accountStatus === 'pending' || (!u.accountStatus && !u.isApproved));

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }

    switch (activeTab) {
      case "verification":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold font-display">Verification Requests</h2>
                <p className="text-muted-foreground">Review and approve new user registrations</p>
              </div>
              <div className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
                {pendingUsers.length} Pending
              </div>
            </div>

            <div className="space-y-4">
              {pendingUsers.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                  <p className="text-muted-foreground">No pending verifications</p>
                </div>
              ) : (
                pendingUsers.map(user => (
                  <VerificationCard
                    key={user._id}
                    user={user}
                    onApprove={(id) => updateUserStatus(id, 'approved')}
                    onReject={(id) => updateUserStatus(id, 'rejected')}
                    onViewDetails={handleViewDetails}
                  />
                ))
              )}
            </div>
          </div>
        );
      case "users":
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold font-display">All Users</h2>
              <p className="text-muted-foreground">Manage all registered users</p>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground font-medium">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{user.fullName}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 capitalize">{user.role}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.accountStatus === 'approved' ? 'bg-green-100 text-green-700' :
                          user.accountStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                          {user.accountStatus || (user.isApproved ? 'approved' : 'pending')}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => deleteUser(user._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "reviews":
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold font-display">User Reviews</h2>
              <p className="text-muted-foreground">Feedback from completed services</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-muted-foreground">No reviews available yet. (Reviews will appear here when users rate completed services)</p>
            </div>
          </div>
        );
      case "overview":
        return <div className="p-10 text-center text-muted-foreground">Overview Dashboard (Working in progress)</div>;
      case "disputes":
        return <div className="p-10 text-center text-muted-foreground">Disputes Management (No active disputes)</div>;
      default:
        return <div className="p-10 text-center text-muted-foreground">Select a menu item</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {users.find(u => u._id === "current_user_id")?.fullName || "Admin"} <span className="capitalize">(Admin)</span>!
              </p>
            </div>
          </div>

          {renderContent()}
        </div>

        <UserDetailsDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          user={selectedUser}
          onApprove={(id) => updateUserStatus(id, 'approved')}
          onReject={(id) => updateUserStatus(id, 'rejected')}
        />

        <EditUserDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          user={selectedUser}
          onUserUpdated={fetchUsers}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
