import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Mail, 
  Phone, 
  IdCard, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Calendar,
  FileText,
  Image as ImageIcon,
  Camera,
  X,
  Upload
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { adminNavItems, workerNavItems, requesterNavItems, brokerNavItems } from "@/config/navigation";
import { Loader2 } from "lucide-react";
import { getImageUrl } from "@/lib/imageUtils";

const Profile = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploadingProfile(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const { data } = await api.post('/auth/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUser({ ...user, profilePicture: data.profilePicture });
      toast({
        title: "Success",
        description: "Profile picture uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to upload profile picture",
        variant: "destructive"
      });
    } finally {
      setUploadingProfile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!confirm('Are you sure you want to delete your profile picture?')) return;

    try {
      await api.delete('/auth/profile-picture');
      setUser({ ...user, profilePicture: null });
      toast({
        title: "Success",
        description: "Profile picture deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete profile picture",
        variant: "destructive"
      });
    }
  };

  const getNavItems = () => {
    switch (currentUser?.role) {
      case 'admin': return adminNavItems;
      case 'worker': return workerNavItems;
      case 'broker': return brokerNavItems;
      case 'requester': return requesterNavItems;
      default: return requesterNavItems;
    }
  };


  if (loading) {
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

  if (!user) {
    return (
      <DashboardLayout
        navItems={getNavItems()}
        role={currentUser?.role as any || 'requester'}
        userName={currentUser?.fullName || "User"}
        userEmail={currentUser?.email || "user@example.com"}
      >
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load profile</p>
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
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            View your complete profile information
          </p>
        </div>

        {/* Profile Picture Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Your profile picture displayed across the platform</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.profilePicture ? getImageUrl(user.profilePicture) : undefined} alt={user.fullName} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {user.fullName?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {uploadingProfile && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                disabled={uploadingProfile}
                className="hidden"
                id="profile-picture-input"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingProfile}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                {user.profilePicture ? 'Change Picture' : 'Upload Picture'}
              </Button>
              {user.profilePicture && (
                <Button
                  onClick={handleDeleteProfilePicture}
                  disabled={uploadingProfile}
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Picture
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4" />
                  Full Name
                </div>
                <p className="text-sm text-muted-foreground">{user.fullName}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  Phone
                </div>
                <p className="text-sm text-muted-foreground">{user.phone || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <IdCard className="h-4 w-4" />
                  NIC Number
                </div>
                <p className="text-sm text-muted-foreground font-mono">{user.nic || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="h-4 w-4" />
                  Role
                </div>
                <Badge variant="outline" className="capitalize">{user.role}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4" />
                  Account Status
                </div>
                <Badge variant={user.accountStatus === 'approved' ? 'default' : user.accountStatus === 'rejected' ? 'destructive' : 'secondary'}>
                  {user.accountStatus || 'Pending'}
                </Badge>
              </div>
              {user.createdAt && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    Registered On
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
              {user.rejectionTimestamp && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    Rejected On
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.rejectionTimestamp).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          {user.location?.address && (
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Your registered address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  Address
                </div>
                <p className="text-sm text-muted-foreground">{user.location.address}</p>
                {user.location.coordinates && (
                  <p className="text-xs text-muted-foreground font-mono">
                    Coordinates: {user.location.coordinates[1]?.toFixed(6)}, {user.location.coordinates[0]?.toFixed(6)}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Skills (for workers) */}
          {user.skills && user.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Your professional skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* NIC Photo */}
          {user.nicPhoto && (
            <Card>
              <CardHeader>
                <CardTitle>NIC Photo</CardTitle>
                <CardDescription>Your National Identity Card</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-2">
                  <img 
                    src={getImageUrl(user.nicPhoto)} 
                    alt="NIC Photo" 
                    className="max-w-full h-auto max-h-96 rounded-md object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.png';
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Working Photos (for workers) */}
          {user.role === 'worker' && user.workingPhotos && user.workingPhotos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Working Photos</CardTitle>
                <CardDescription>Photos of your completed work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {user.workingPhotos.map((photo: string, idx: number) => (
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
              </CardContent>
            </Card>
          )}

          {/* GP Letters (for workers) */}
          {user.role === 'worker' && user.gpLetters && user.gpLetters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>GP Letters</CardTitle>
                <CardDescription>Medical certificates and GP letters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {user.gpLetters.map((letter: string, idx: number) => (
                    <div key={idx} className="border rounded-md p-2">
                      {letter.endsWith('.pdf') || letter.includes('.pdf') ? (
                        <div className="w-full h-32 flex flex-col items-center justify-center bg-muted rounded-md">
                          <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                          <a
                            href={getImageUrl(letter)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            View PDF {idx + 1}
                          </a>
                        </div>
                      ) : (
                        <img
                          src={getImageUrl(letter)}
                          alt={`GP Letter ${idx + 1}`}
                          className="w-full h-auto max-h-48 rounded-md object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.png';
                          }}
                        />
                      )}
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

export default Profile;
