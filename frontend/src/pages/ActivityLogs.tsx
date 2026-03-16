import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Activity } from "lucide-react";
import api from "@/lib/axios";
import { adminNavItems } from "@/config/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";

export default function ActivityLogs() {
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/activity-logs');
      setActivityLogs(data);
    } catch (error) {
      console.error("Error fetching activity logs", error);
      toast({
        title: "Error",
        description: "Failed to fetch activity logs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const chartData = useMemo(() => {
    const dataMap = new Map<string, { date: string, Logins: number, Registrations: number, Deletions: number, Other: number }>();
    
    // Process logs (they come in reverse chronological order)
    activityLogs.forEach(log => {
      // Use toLocaleDateString for a simple date grouping
      const date = new Date(log.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      
      if (!dataMap.has(date)) {
        dataMap.set(date, { date, Logins: 0, Registrations: 0, Deletions: 0, Other: 0 });
      }
      
      const current = dataMap.get(date)!;
      if (log.action === 'LOGIN') {
        current.Logins += 1;
      } else if (log.action === 'REGISTER') {
        current.Registrations += 1;
      } else if (log.action === 'ACCOUNT_DELETION') {
        current.Deletions += 1;
      } else {
        current.Other += 1;
      }
    });
    
    // Reverse to display chronologically left-to-right
    return Array.from(dataMap.values()).reverse();
  }, [activityLogs]);

  if (loading) {
    return (
      <DashboardLayout
        navItems={adminNavItems}
        role="admin"
        userName={user?.fullName || "Administrator"}
        userEmail={user?.email || "admin@ssp.lk"}
      >
        <div className="h-[80vh] w-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={adminNavItems}
      role="admin"
      userName={user?.fullName || "Administrator"}
      userEmail={user?.email || "admin@ssp.lk"}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Activity Logs
          </h1>
          <p className="text-muted-foreground">
            Track user logins, registrations, and administrative actions system-wide.
          </p>
        </div>

        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Overview</CardTitle>
              <CardDescription>Daily breakdown of system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" tickLine={false} axisLine={false} />
                    <YAxis className="text-xs" tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                    />
                    <Legend />
                    <Bar dataKey="Logins" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="Registrations" stackId="a" fill="#10b981" />
                    <Bar dataKey="Deletions" stackId="a" fill="#ef4444" />
                    <Bar dataKey="Other" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No activity logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  activityLogs.map((log: any) => (
                    <TableRow key={log._id}>
                      <TableCell className="text-sm whitespace-nowrap text-muted-foreground font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {log.user ? (
                          <div className="flex flex-col">
                            <span className="font-medium">{log.user.fullName}</span>
                            <span className="text-xs text-muted-foreground">{log.user.email}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">System / Deleted User</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          log.action === 'LOGIN' ? 'outline' :
                          log.action === 'REGISTER' ? 'default' :
                          log.action === 'STATUS_CHANGE' ? 'secondary' :
                          log.action === 'ACCOUNT_DELETION' ? 'destructive' :
                          'outline'
                        } className="whitespace-nowrap">
                          {log.action.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <span className="text-sm">{log.description}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
