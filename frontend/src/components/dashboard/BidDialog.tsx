
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

interface BidDialogProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    jobTitle: string;
}

export function BidDialog({ isOpen, onClose, jobId, jobTitle }: BidDialogProps) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;

        setLoading(true);
        try {
            await api.post("/bids", {
                serviceRequestId: jobId,
                amount: Number(amount),
            });

            toast({
                title: "Bid Placed",
                description: `You have successfully placed a bid of Rs. ${amount} for ${jobTitle}`,
            });
            onClose();
            setAmount("");
        } catch (error: any) {
            console.error("Error placing bid:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to place bid.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Place a Bid</DialogTitle>
                    <DialogDescription>
                        Enter your proposed amount for "{jobTitle}".
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount (Rs.)
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g. 1500"
                                min="1"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Placing Bid..." : "Submit Bid"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
