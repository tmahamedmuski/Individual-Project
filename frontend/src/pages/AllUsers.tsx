import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import { getImageUrl } from "@/lib/imageUtils";
import { adminNavItems, workerNavItems, requesterNavItems, brokerNavItems } from "@/config/navigation";

const AllUsers = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/auth/users');
        setUsers(data);
      } catch (error) {
        console.error("Error fetching all users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getNavItems = () => {
    switch (currentUser?.role) {
      case 'admin': return adminNavItems;
      case 'worker': return workerNavItems;
      case 'broker': return brokerNavItems;
      case 'requester': return requesterNavItems;
      default: return requesterNavItems;
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColors = (role: string) => {
    switch (role) {
      case 'requester': return "bg-requester text-white";
      case 'worker': return "bg-worker text-white";
      case 'broker': return "bg-broker text-white";
      case 'admin': return "bg-admin text-white";
      default: return "bg-primary text-white";
    }
  };

  return (
    <DashboardLayout
      navItems={getNavItems()}
      role={currentUser?.role as any || 'requester'}
      userName={currentUser?.fullName || "User"}
      userEmail={currentUser?.email || "user@example.com"}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Community</h1>
          <p className="text-muted-foreground">Browse all users on the platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Search and click on any user to view their public profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No users found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredUsers.map((u) => (
                  <Button 
                    key={u._id} 
                    variant="outline" 
                    className="h-auto p-4 flex items-center justify-start gap-4 hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/worker-profile/${u._id}`)}
                  >
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={u.profilePicture ? getImageUrl(u.profilePicture) : undefined} />
                      <AvatarFallback className={getRoleColors(u.role)}>
                        {u.fullName?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left overflow-hidden flex-1">
                      <p className="text-sm font-semibold truncate">{u.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      <p className="text-[10px] font-medium uppercase mt-1 text-primary tracking-wider">{u.role}</p>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AllUsers;
