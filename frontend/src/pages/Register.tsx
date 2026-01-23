import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPicker } from "@/components/ui/MapPicker";
import { X } from "lucide-react";
import { FileText } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [showOtherSkill, setShowOtherSkill] = useState(false);
  const [otherSkill, setOtherSkill] = useState("");
  const [nicPhoto, setNicPhoto] = useState<File | null>(null);
  const [nicPhotoPreview, setNicPhotoPreview] = useState<string | null>(null);
  const [workingPhotos, setWorkingPhotos] = useState<File[]>([]);
  const [workingPhotosPreview, setWorkingPhotosPreview] = useState<string[]>([]);
  const [gpLetters, setGpLetters] = useState<File[]>([]);
  const [gpLettersPreview, setGpLettersPreview] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "requester",
    nic: "",
    phone: "",
    skills: [] as string[],
    address: "",
    location: null as Location | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
  };

  const handleSkillChange = (value: string) => {
    if (value === "Other") {
      setShowOtherSkill(true);
      setFormData({ ...formData, skills: [] });
    } else {
      setShowOtherSkill(false);
      setFormData({ ...formData, skills: [value] });
    }
  };

  const handleLocationSelect = (loc: Location) => {
    setFormData((prev) => ({
      ...prev,
      location: loc,
      address: loc.address || `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`,
    }));
  };

  const handleNicPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setNicPhoto(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setNicPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWorkingPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      // Validate all files
      for (const file of fileArray) {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: "Please upload only image files for working photos.",
            variant: "destructive",
          });
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload images smaller than 10MB.",
            variant: "destructive",
          });
          return;
        }
      }
      setWorkingPhotos([...workingPhotos, ...fileArray]);
      // Create previews
      const previews: string[] = [];
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === fileArray.length) {
            setWorkingPhotosPreview([...workingPhotosPreview, ...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleGPLettersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      // Validate all files
      for (const file of fileArray) {
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
          toast({
            title: "Invalid file type",
            description: "Please upload image or PDF files for GP letters.",
            variant: "destructive",
          });
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload files smaller than 10MB.",
            variant: "destructive",
          });
          return;
        }
      }
      setGpLetters([...gpLetters, ...fileArray]);
      // Create previews for images only
      const previews: string[] = [];
      fileArray.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            previews.push(reader.result as string);
            if (previews.length === fileArray.filter(f => f.type.startsWith('image/')).length) {
              setGpLettersPreview([...gpLettersPreview, ...previews]);
            }
          };
          reader.readAsDataURL(file);
        } else {
          previews.push('pdf');
        }
      });
    }
  };

  const removeWorkingPhoto = (index: number) => {
    setWorkingPhotos(workingPhotos.filter((_, i) => i !== index));
    setWorkingPhotosPreview(workingPhotosPreview.filter((_, i) => i !== index));
  };

  const removeGPLetter = (index: number) => {
    setGpLetters(gpLetters.filter((_, i) => i !== index));
    setGpLettersPreview(gpLettersPreview.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.location) {
      toast({
        title: "Location Required",
        description: "Please select your location on the map.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!nicPhoto) {
      toast({
        title: "NIC Photo Required",
        description: "Please upload a photo of your NIC.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.role === "worker" && showOtherSkill && !otherSkill) {
      toast({
        title: "Skill required",
        description: "Please specify your skill.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const finalSkills = showOtherSkill ? [otherSkill] : formData.skills;

    try {
      await register({
        ...formData,
        skills: finalSkills,
        nicPhoto: nicPhoto,
        workingPhotos: formData.role === "worker" ? workingPhotos : [],
        gpLetters: formData.role === "worker" ? gpLetters : [],
      });
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please wait for admin approval.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-8">
      <Card className="w-full max-w-2xl shadow-lg border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold font-display text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  autoComplete="name"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+1234567890"
                  autoComplete="tel"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nic">NIC</Label>
                <Input
                  id="nic"
                  name="nic"
                  placeholder="National Identity Card Number"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* NIC Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="nicPhoto">NIC Photo</Label>
              <Input
                id="nicPhoto"
                name="nicPhoto"
                type="file"
                accept="image/*"
                onChange={handleNicPhotoChange}
                required
                className="cursor-pointer"
              />
              {nicPhotoPreview && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <img
                    src={nicPhotoPreview}
                    alt="NIC Preview"
                    className="max-w-xs max-h-48 rounded-md border object-contain"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Please upload a clear photo of your National Identity Card (Max 5MB)
              </p>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">I want to be a...</Label>
              <Select onValueChange={handleRoleChange} defaultValue="requester">
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requester">Requester (Customer)</SelectItem>
                  <SelectItem value="worker">Worker (Service Provider)</SelectItem>
                  <SelectItem value="broker">Broker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Worker Skills */}
            {formData.role === "worker" && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="skills">Select your Skill/Job Type</Label>
                <Select onValueChange={handleSkillChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your main skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plumber">Plumber</SelectItem>
                    <SelectItem value="Electrician">Electrician</SelectItem>
                    <SelectItem value="Cleaner">Cleaner</SelectItem>
                    <SelectItem value="Chef">Chef</SelectItem>
                    <SelectItem value="Carpenter">Carpenter</SelectItem>
                    <SelectItem value="Mason">Mason</SelectItem>
                    <SelectItem value="Gardener">Gardener</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {showOtherSkill && (
                  <Input
                    className="mt-2"
                    placeholder="Please specify your skill"
                    value={otherSkill}
                    onChange={(e) => setOtherSkill(e.target.value)}
                    required
                  />
                )}
              </div>
            )}

            {/* Worker Documents */}
            {formData.role === "worker" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="workingPhotos">Working Photos</Label>
                  <Input
                    id="workingPhotos"
                    name="workingPhotos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleWorkingPhotosChange}
                    required
                    className="cursor-pointer"
                  />
                  {workingPhotosPreview.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {workingPhotosPreview.map((preview, idx) => (
                        <div key={idx} className="relative border rounded-md p-2">
                          <img
                            src={preview}
                            alt={`Working Photo ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeWorkingPhoto(idx)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload photos of your completed work (Max 10MB each, at least 1 required)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gpLetters">GP Letters / Medical Certificates</Label>
                  <Input
                    id="gpLetters"
                    name="gpLetters"
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={handleGPLettersChange}
                    required
                    className="cursor-pointer"
                  />
                  {gpLettersPreview.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {gpLettersPreview.map((preview, idx) => (
                        <div key={idx} className="relative border rounded-md p-2">
                          {preview === 'pdf' ? (
                            <div className="w-full h-24 flex items-center justify-center bg-muted rounded-md">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                          ) : (
                            <img
                              src={preview}
                              alt={`GP Letter ${idx + 1}`}
                              className="w-full h-24 object-cover rounded-md"
                            />
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeGPLetter(idx)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload GP letters or medical certificates (Images or PDFs, Max 10MB each, at least 1 required)
                  </p>
                </div>
              </>
            )}

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="Pin your location on the map below"
                value={formData.address}
                onChange={handleChange}
                readOnly
              />
              <div className="mt-3">
                <MapPicker
                  onLocationSelect={handleLocationSelect}
                  defaultLocation={formData.location || undefined}
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
