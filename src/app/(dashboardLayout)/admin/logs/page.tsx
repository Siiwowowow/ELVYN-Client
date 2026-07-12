"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Search, 
  Trash2, 
  RefreshCw,
  AlertTriangle,
  Info,
  XCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface LogEntry {
  id: string;
  timestamp: string;
  type: "INFO" | "WARN" | "ERROR";
  service: string;
  message: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: "log-1", timestamp: "18:44:20", type: "INFO", service: "AuthService", message: "User USR-0045 successfully authenticated via JWT." },
  { id: "log-2", timestamp: "18:41:10", type: "WARN", service: "InventoryService", message: "Product 'Nova Flyknit cushion shoes' stock levels dropping below threshold." },
  { id: "log-3", timestamp: "18:35:05", type: "INFO", service: "DatabasePool", message: "Database connection pool successfully refreshed. Active connections: 42." },
  { id: "log-4", timestamp: "18:30:15", type: "ERROR", service: "PaymentGateway", message: "Webhook signature verification failed for session_id: 'sess_92102'." },
  { id: "log-5", timestamp: "18:15:30", type: "INFO", service: "CronRunner", message: "Backup database task execution completed successfully in 12.4s." },
];

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLogs = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Add a simulated new log sometimes to show dynamic updates
      if (Math.random() > 0.4) {
        const types: ("INFO" | "WARN" | "ERROR")[] = ["INFO", "WARN", "ERROR"];
        const services = ["AuthService", "ProductService", "OrderService", "DatabasePool"];
        const messages = [
          "Category list fetched from cache.",
          "New product added to database.",
          "Order payment completed successfully.",
          "Token verification triggered middleware validation block."
        ];
        
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        const newLog: LogEntry = {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          type: types[Math.floor(Math.random() * types.length)],
          service: services[Math.floor(Math.random() * services.length)],
          message: messages[Math.floor(Math.random() * messages.length)]
        };
        
        setLogs(prev => [newLog, ...prev.slice(0, 9)]);
      }
      setIsRefreshing(false);
      toast.success("Logs list updated.");
    }, 600);
  };

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to clear the logs view?")) {
      setLogs([]);
      toast.success("Logs cleared.");
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? log.type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 w-full animate-fade-in flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="text-emerald-600" size={24} />
            <span>System Logs & Telemetry</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time tracking of requests, alerts, warning flags, and exceptions on the backend server.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={fetchLogs}
            disabled={isRefreshing}
            className="p-2 rounded-lg border bg-white hover:bg-slate-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            title="Force refresh logs"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin text-emerald-600" : ""} />
          </button>
          <button 
            onClick={handleClearLogs}
            className="p-2 rounded-lg border border-rose-200 text-rose-600 bg-white hover:bg-rose-50 transition-colors shadow-sm cursor-pointer"
            title="Clear logs view"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            type="text"
            placeholder="Search logs by message or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full md:w-44 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            <option value="">All Log Levels</option>
            <option value="INFO">Information</option>
            <option value="WARN">Warnings</option>
            <option value="ERROR">Errors</option>
          </select>
        </div>
      </div>

      {/* Logs Card list */}
      <div className="bg-slate-900 text-slate-350 rounded-xl border border-slate-800 shadow-2xl p-4 flex-1 flex flex-col font-mono text-xs overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3 text-slate-500">
          <Clock size={14} />
          <span>System CLI Output -- logs limit: 10 items</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => {
              const IconType = log.type === "ERROR" ? XCircle : log.type === "WARN" ? AlertTriangle : Info;
              const typeColor = log.type === "ERROR" ? "text-rose-450 font-bold" : log.type === "WARN" ? "text-amber-500 font-bold" : "text-emerald-500";
              const borderCol = log.type === "ERROR" ? "border-rose-950 bg-rose-950/10" : log.type === "WARN" ? "border-amber-950 bg-amber-950/10" : "border-slate-850 bg-slate-850/10";

              return (
                <div key={log.id} className={`p-3 rounded border flex flex-col md:flex-row md:items-center gap-2 md:gap-4 transition-colors ${borderCol}`}>
                  {/* Timestamp & Type */}
                  <div className="flex items-center gap-2 shrink-0 select-none">
                    <span className="text-slate-500 font-medium">{log.timestamp}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded uppercase ${typeColor}`}>
                      <IconType size={11} />
                      <span>{log.type}</span>
                    </span>
                  </div>

                  {/* Service tag */}
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0 self-start md:self-auto select-none">
                    [{log.service}]
                  </span>

                  {/* Log message */}
                  <p className="text-slate-200 leading-relaxed font-sans">{log.message}</p>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-slate-600 flex flex-col items-center justify-center gap-1.5 font-sans">
              <FileText size={32} className="text-slate-800" />
              <p className="text-sm font-medium">No logs matched standard filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
