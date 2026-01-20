import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LocationPicker from "@/components/LocationPicker";

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showOtherSkill, setShowOtherSkill] = useState(false);
    const [otherSkill, setOtherSkill] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "requester",
        nic: "",
        phone: "",
        skills: [] as string[],
        location: null as any
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
            setFormData({ ...formData, skills: [] }); // Clear skills for now, will add 'other' value on submit or blur
        } else {
            setShowOtherSkill(false);
            setFormData({ ...formData, skills: [value] });
        }
    };

    const handleLocationSelect = (location: any) => {
        setFormData(prev => ({
            ...prev,
            location: {
                type: 'Point',
                coordinates: [location.lng, location.lat], // GeoJSON uses [lng, lat]
                address: location.address
            }
        }));
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

        if (formData.role === 'worker' && showOtherSkill && !otherSkill) {
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
                skills: finalSkills
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
                    <CardTitle className="text-2xl font-bold font-display text-center">Create an Account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your information to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" name="fullName" placeholder="John Doe" onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="name@example.com" onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" placeholder="+1234567890" onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nic">NIC</Label>
                                <Input id="nic" name="nic" placeholder="National Identity Card Number" onChange={handleChange} required />
                            </div>
                        </div>

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

                        {formData.role === 'worker' && (
                            <div className="space-y-2 animate-fade-in">
                                <Label htmlFor="skills">Select your Skill/Job Type</Label>
                                <Select onValueChange={handleSkillChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your main skill" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Plumber">Plumber (Pullampaer)</SelectItem>
                                        <SelectItem value="Electrician">Electrician (Elaterion)</SelectItem>
                                        <SelectItem value="Cleaner">Cleaner (Clenare)</SelectItem>
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

                        <div className="space-y-2">
                            <Label>Location</Label>
                            <div className="border rounded-lg p-2 bg-background/50">
                                <p className="text-sm text-muted-foreground mb-2 px-1">Pin your location on the map</p>
                                <LocationPicker onLocationSelect={handleLocationSelect} />
                            </div>
                        </div>

                        <div className="space-y-2 animate-fade-in">
                            <Label htmlFor="address">Address</Label>
                            <Input 
                                id="address" 
                                name="address" 
                                placeholder="Address will appear here..." 
                                value={formData.location?.address || ""}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    location: { ...formData.location, address: e.target.value }
                                })}
                                required 
                            />
                        </div>

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
