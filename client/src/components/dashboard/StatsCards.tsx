import { motion } from "motion/react";
import { Users, Zap, Clock, CheckCircle2, AlertCircle, Loader2, TrendingUp } from "lucide-react";

type MetricStatus = "healthy" | "idle" | "error" | "loading";

interface Metric {
  id: string;
  label: string;
  value: string;
  description: string;
  status: MetricStatus;
  trend?: string;
}

// Replace with real data from your API
const metrics: Metric[] = [
  { id: "1", label: "Total Users",    value: "1,284", description: "Registered accounts", status: "healthy", trend: "+12%" },
  { id: "2", label: "Active Today",   value: "347",   description: "Unique active users",  status: "healthy", trend: "+5%" },
  { id: "3", label: "Requests / min", value: "89",    description: "API throughput",        status: "loading", trend: "" },
  { id: "4", label: "Uptime",         value: "99.9%", description: "Last 30 days",          status: "idle",    trend: "" },
];

const statusConfig: Record<MetricStatus, { icon: React.ElementType; color: string; label: string }> = {
  healthy: { icon: CheckCircle2, color: "text-[rgb(74,222,128)]", label: "healthy" },
  idle:    { icon: TrendingUp,   color: "text-[rgba(255,255,255,0.35)]", label: "stable" },
  error:   { icon: AlertCircle,  color: "text-red-400", label: "error" },
  loading: { icon: Loader2,      color: "text-[#b5ff18]", label: "loading" },
};

function StatusIcon({ status }: { status: MetricStatus }) {
  const { icon: Icon, color } = statusConfig[status];
  return <Icon className={`h-4 w-4 ${color} ${status === "loading" ? "animate-spin" : ""}`} />;
}

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
          className="agent-card"
        >
          <div className="agent-card-glow" />
          <div className="agent-card-border-gradient" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="agent-card-icon">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="agent-card-name">{metric.label}</h3>
                  <p className="agent-card-role">{metric.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <StatusIcon status={metric.status} />
              <span className={`font-mono text-[10px] uppercase tracking-wider ${statusConfig[metric.status].color}`}>
                {statusConfig[metric.status].label}
              </span>
              {metric.status === "healthy" && (
                <span className="relative flex h-1.5 w-1.5 ml-1">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[rgb(74,222,128)] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[rgb(74,222,128)]" />
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] pt-4">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-lg font-bold text-[#e0e0e0] tabular-nums">{metric.value}</span>
              </div>
              {metric.trend && (
                <div className="flex items-center gap-1 text-[rgb(74,222,128)]">
                  <Zap className="h-3 w-3" />
                  <span className="font-mono text-xs">{metric.trend}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
