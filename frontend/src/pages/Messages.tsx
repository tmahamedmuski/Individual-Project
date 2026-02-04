import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { requesterNavItems, workerNavItems, brokerNavItems } from "@/config/navigation";
import api from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

interface Message {
    _id: string;
    sender: { _id: string; fullName: string; avatar?: string };
    receiver: { _id: string; fullName: string; avatar?: string };
    content: string;
    createdAt: string;
}

interface Conversation {
    user: { _id: string; fullName: string; avatar?: string };
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
}

export default function Messages() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [searchParams] = useSearchParams();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUser, setSelectedUser] = useState<{ _id: string; fullName: string; avatar?: string } | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    const getNavItems = () => {
        switch (user?.role) {
            case 'broker': return brokerNavItems;
            case 'worker': return workerNavItems;
            default: return requesterNavItems;
        }
    };

    // Initial load: Fetch conversations
    useEffect(() => {
        fetchConversations();

        // precise user selection from URL/JobCard
        const userId = searchParams.get('userId');
        const userName = searchParams.get('userName');
        if (userId && userName) {
            setSelectedUser({ _id: userId, fullName: userName });
        }
    }, []);

    // Fetch messages when selected user changes
    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser._id);
            // Mark as read locally (simple UX)
            setConversations(prev => prev.map(c =>
                c.user._id === selectedUser._id ? { ...c, unreadCount: 0 } : c
            ));
        }
    }, [selectedUser]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/messages/conversations/list');
            setConversations(data);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId: string) => {
        try {
            const { data } = await api.get(`/messages/${userId}`);
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast({
                title: "Error",
                description: "Failed to load messages",
                variant: "destructive",
            });
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const { data } = await api.post('/messages', {
                receiverId: selectedUser._id,
                content: newMessage,
            });
            setMessages([...messages, data]);
            setNewMessage("");

            // Update conversation list
            fetchConversations();

        } catch (error) {
            console.error("Error sending message:", error);
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive",
            });
        }
    };

    return (
        <DashboardLayout
            navItems={getNavItems()}
            role={(user?.role as "broker" | "admin" | "requester" | "worker") || "requester"}
            userName={user?.fullName || "User"}
            userEmail={user?.email || "user@example.com"}
        >
            <div className="h-[calc(100vh-200px)] flex border rounded-lg bg-background overflow-hidden shadow-sm">
                {/* Conversations Sidebar */}
                <div className="w-1/3 border-r flex flex-col min-w-[250px]">
                    <div className="p-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search messages..." className="pl-8" />
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        {loading ? (
                            <div className="p-4 text-center text-muted-foreground">Loading...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">No conversations yet.</div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.user._id}
                                    onClick={() => setSelectedUser(conv.user)}
                                    className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${selectedUser?._id === conv.user._id ? 'bg-muted' : ''}`}
                                >
                                    <Avatar>
                                        <AvatarImage src={conv.user.avatar} />
                                        <AvatarFallback>{conv.user.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="font-semibold truncate">{conv.user.fullName}</span>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                {new Date(conv.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-muted-foreground truncate pr-2">
                                                {conv.lastMessage}
                                            </p>
                                            {conv.unreadCount > 0 && (
                                                <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </ScrollArea>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b flex items-center gap-3 bg-muted/20">
                                <Avatar>
                                    <AvatarImage src={selectedUser.avatar} />
                                    <AvatarFallback>{selectedUser.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{selectedUser.fullName}</h3>
                                </div>
                            </div>

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                                {messages.map((msg) => {
                                    const isMe = msg.sender._id === user?._id; // Use _id to match backend
                                    return (
                                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-[70%] rounded-lg p-3 ${isMe
                                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                    : 'bg-muted rounded-tl-none'
                                                    }`}
                                            >
                                                <p className="text-sm">{msg.content}</p>
                                                <span className={`text-[10px] block mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1"
                                    />
                                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-4">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <p>Select a conversation or start a new message</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
