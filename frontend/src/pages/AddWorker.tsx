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
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MapPicker } from "@/components/ui/MapPicker";
import { X, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { brokerNavItems } from "@/config/navigation";
import api from "@/lib/axios"; // Use direct API for now since register logs in automatically

interface Location {
    lat: number;
    lng: number;
    address?: string;
}

const AddWorker = () => {
    const { user } = useAuth(); // Get current Broker user
    const navigate = useNavigate();
    const { toast } = useToast();

    // ... existing code ...



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
        role: "worker", // Locked to worker
        nic: "",
        phone: "",
        skills: [] as string[],
        address: "",
        location: null as Location | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            if (!file.type.startsWith('image/')) {
                toast({ title: "Invalid file type", description: "Please upload an image file.", variant: "destructive" });
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast({ title: "File too large", description: "Please upload an image smaller than 5MB.", variant: "destructive" });
                return;
            }
            setNicPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => { setNicPhotoPreview(reader.result as string); };
            reader.readAsDataURL(file);
        }
    };

    const handleWorkingPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            setWorkingPhotos([...workingPhotos, ...fileArray]);
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
            setGpLetters([...gpLetters, ...fileArray]);
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
            toast({ title: "Passwords do not match", description: "Please ensure both passwords match.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        if (!formData.location) {
            toast({ title: "Location Required", description: "Please select your location on the map.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        if (!nicPhoto) {
            toast({ title: "NIC Photo Required", description: "Please upload a photo of your NIC.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        const finalSkills = showOtherSkill ? [otherSkill] : formData.skills;

        try {
            // Construct FormData matching AuthContext structure
            const data = new FormData();
            data.append('fullName', formData.fullName);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('role', 'worker');
            data.append('nic', formData.nic);
            data.append('phone', formData.phone);
            data.append('address', formData.address);
            data.append('addedBy', user?._id || ''); // Add this line

            if (formData.location) {
                data.append('location', JSON.stringify({
                    type: 'Point',
                    coordinates: [formData.location.lng, formData.location.lat],
                    address: formData.location.address || formData.address
                }));
            }

            data.append('skills', JSON.stringify(finalSkills));

            if (nicPhoto) data.append('nicPhoto', nicPhoto);
            workingPhotos.forEach((photo) => data.append('workingPhotos', photo));
            gpLetters.forEach((letter) => data.append('gpLetters', letter));

            await api.post('/auth/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast({
                title: "Worker Added",
                description: "The worker account has been created successfully.",
            });
            navigate("/broker"); // Redirect to Dashboard
        } catch (error: any) {
            console.error("Registration error:", error);
            toast({
                title: "Registration Failed",
                description: error.response?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout
            navItems={brokerNavItems}
            role="broker"
            userName={user?.fullName || "Broker"}
            userEmail={user?.email || "broker@example.com"}
        >
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Add New Worker</h1>
                    <p className="text-muted-foreground">
                        Register a new worker under your management.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Worker Details</CardTitle>
                        <CardDescription>Enter the worker's information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Personal Info */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName" name="fullName" placeholder="Worker Name" onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="worker@example.com" onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" name="phone" placeholder="+94..." onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nic">NIC</Label>
                                    <Input id="nic" name="nic" placeholder="NIC Number" onChange={handleChange} required />
                                </div>
                            </div>

                            {/* NIC Photo Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="nicPhoto">NIC Photo</Label>
                                <Input id="nicPhoto" name="nicPhoto" type="file" accept="image/*" onChange={handleNicPhotoChange} required />
                                {nicPhotoPreview && (
                                    <div className="mt-2">
                                        <img src={nicPhotoPreview} alt="NIC Preview" className="max-w-xs max-h-48 rounded-md border object-contain" />
                                    </div>
                                )}
                            </div>

                            {/* Worker Skills */}
                            <div className="space-y-2">
                                <Label htmlFor="skills">Select Skill/Job Type</Label>
                                <Select onValueChange={handleSkillChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select main skill" />
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
                                    <Input className="mt-2" placeholder="Specify skill" value={otherSkill} onChange={(e) => setOtherSkill(e.target.value)} required />
                                )}
                            </div>

                            {/* Worker Documents */}
                            <div className="space-y-2">
                                <Label htmlFor="workingPhotos">Working Photos</Label>
                                <Input id="workingPhotos" name="workingPhotos" type="file" accept="image/*" multiple onChange={handleWorkingPhotosChange} required />
                                {workingPhotosPreview.length > 0 && (
                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                        {workingPhotosPreview.map((preview, idx) => (
                                            <div key={idx} className="relative border rounded-md p-2">
                                                <img src={preview} alt="Preview" className="w-full h-24 object-cover" />
                                                <Button type="button" size="sm" variant="destructive" className="absolute top-1 right-1 h-6 w-6 p-0" onClick={() => removeWorkingPhoto(idx)}>
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gpLetters">GP Letters / Certs</Label>
                                <Input id="gpLetters" name="gpLetters" type="file" accept="image/*,application/pdf" multiple onChange={handleGPLettersChange} required />
                                {gpLettersPreview.length > 0 && (
                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                        {gpLettersPreview.map((preview, idx) => (
                                            <div key={idx} className="relative border rounded-md p-2">
                                                {preview === 'pdf' ? <FileText className="h-8 w-8" /> : <img src={preview} alt="Preview" className="w-full h-24 object-cover" />}
                                                <Button type="button" size="sm" variant="destructive" className="absolute top-1 right-1 h-6 w-6 p-0" onClick={() => removeGPLetter(idx)}>
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" name="address" placeholder="Pin location on map" value={formData.address} readOnly />
                                <div className="mt-3">
                                    <MapPicker onLocationSelect={handleLocationSelect} />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input id="confirmPassword" name="confirmPassword" type="password" onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => navigate("/broker")}>Cancel</Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Adding Worker..." : "Add Worker"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AddWorker;
