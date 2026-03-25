import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronLeft
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { adminNavItems, workerNavItems, requesterNavItems, brokerNavItems } from "@/config/navigation";
import { Loader2 } from "lucide-react";
import { getImageUrl } from "@/lib/imageUtils";

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await api.get(`/auth/user/${id}`);
        setProfileUser(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive"
        });
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUserDetails();
  }, [id, navigate, toast]);

  const getNavItems = () => {
    switch (currentUser?.role) {
      case 'admin': return adminNavItems;
      case 'worker': return workerNavItems;
      case 'broker': return brokerNavItems;
      case 'requester': return requesterNavItems;
      default: return requesterNavItems;
    }
  };

  if (loading || !profileUser) {
    return (
      <DashboardLayout
        navItems={getNavItems()}
        role={currentUser?.role as any || 'requester'}
        userName={currentUser?.fullName || "User"}
        userEmail={currentUser?.email || "user@example.com"}
      >
        <div className="h-screen w-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={getNavItems()}
      role={currentUser?.role as any || 'requester'}
      userName={currentUser?.fullName || "User"}
      userEmail={currentUser?.email || "user@example.com"}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{profileUser.fullName}'s Profile</h1>
            <p className="text-muted-foreground capitalize">
              {profileUser.role} • {profileUser.accountStatus === 'approved' ? 'Verified' : 'Unverified'}
            </p>
          </div>
        </div>

        {/* Profile Picture Section */}
        <Card>
          <CardContent className="flex flex-col md:flex-row items-center gap-6 pt-6 text-center md:text-left">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={profileUser.profilePicture ? getImageUrl(profileUser.profilePicture) : undefined} alt={profileUser.fullName} />
              <AvatarFallback className="text-5xl bg-primary/10 text-primary">
                {profileUser.fullName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1">
              <h2 className="text-2xl font-bold">{profileUser.fullName}</h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{profileUser.location?.address || "Address not specified"}</span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <Badge variant={profileUser.accountStatus === 'approved' ? 'default' : 'secondary'}>
                  {profileUser.accountStatus === 'approved' ? 'Verified Account' : 'Unverified Account'}
                </Badge>
                {profileUser.role === 'worker' && profileUser.skills && profileUser.skills.length > 0 && (
                  <Badge variant="outline">{profileUser.skills.length} Skills</Badge>
                )}
                {profileUser.averageRating > 0 && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    ★ {profileUser.averageRating.toFixed(1)} Rating
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="text-sm text-muted-foreground">
                  <a href={`mailto:${profileUser.email}`} className="hover:underline text-primary">{profileUser.email}</a>
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  Phone
                </div>
                <p className="text-sm text-muted-foreground">
                  {profileUser.phone ? (
                    <a href={`tel:${profileUser.phone}`} className="hover:underline text-primary">{profileUser.phone}</a>
                  ) : 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(profileUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills (for workers) */}
          {profileUser.skills && profileUser.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Verified professional skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileUser.skills.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Working Photos (for workers) */}
          {profileUser.role === 'worker' && profileUser.workingPhotos && profileUser.workingPhotos.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Working Photos</CardTitle>
                <CardDescription>Photos from completed jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profileUser.workingPhotos.map((photo: string, idx: number) => (
                    <div key={idx} className="border rounded-md overflow-hidden aspect-video bg-muted flex items-center justify-center group relative cursor-pointer">
                      <img
                        src={getImageUrl(photo)}
                        alt={`Working Photo ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PublicProfile;
