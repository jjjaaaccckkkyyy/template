import { motion } from "motion/react";

interface Node {
  id: string;
  name: string;
  role: string;
  status: "active" | "idle";
  x: number;
  y: number;
  connections: string[];
}

// Replace with nodes representing your system architecture
const nodes: Node[] = [
  { id: "api",      name: "API",      role: "Gateway",  status: "active", x: 400, y: 200, connections: ["auth", "db", "cache"] },
  { id: "auth",     name: "Auth",     role: "Service",  status: "active", x: 200, y: 80,  connections: ["sessions", "tokens"] },
  { id: "db",       name: "Database", role: "Storage",  status: "active", x: 400, y: 80,  connections: ["primary", "replica"] },
  { id: "cache",    name: "Cache",    role: "Store",    status: "idle",   x: 600, y: 80,  connections: ["hot", "cold"] },
  { id: "sessions", name: "Sessions", role: "Store",    status: "idle",   x: 100, y: 20,  connections: [] },
  { id: "tokens",   name: "Tokens",   role: "Store",    status: "idle",   x: 200, y: 20,  connections: [] },
  { id: "primary",  name: "Primary",  role: "Replica",  status: "active", x: 350, y: 20,  connections: [] },
  { id: "replica",  name: "Replica",  role: "Replica",  status: "idle",   x: 450, y: 20,  connections: [] },
  { id: "hot",      name: "Hot",      role: "Layer",    status: "active", x: 550, y: 20,  connections: [] },
  { id: "cold",     name: "Cold",     role: "Layer",    status: "idle",   x: 650, y: 20,  connections: [] },
];

export function SystemGraph() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-sm border border-[rgba(255,255,255,0.07)] bg-[#0e0e0e] p-3 md:p-6"
    >
      <div className="relative z-10">
        <h3 className="font-mono mb-4 md:mb-6 text-xs font-bold tracking-[0.28em] uppercase text-[rgba(255,255,255,0.35)]">
          System Graph
        </h3>
        <div className="h-48 md:h-72 overflow-hidden rounded-sm relative">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 250"
            role="img"
            aria-label="System architecture graph"
            className="overflow-visible"
          >
            {nodes.map((node) =>
              node.connections.map((targetId) => {
                const target = nodes.find((n) => n.id === targetId);
                if (!target) return null;
                return (
                  <motion.line
                    key={`${node.id}-${targetId}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    x1={node.x} y1={node.y} x2={target.x} y2={target.y}
                    stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                  />
                );
              })
            )}
            {nodes.map((node, index) => {
              const isLeaf = node.connections.length === 0;
              const isActive = node.status === "active";
              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                  aria-label={`${node.name} — ${node.role} — ${node.status}`}
                >
                  <circle
                    cx={node.x} cy={node.y} r={isLeaf ? 18 : 24}
                    fill={isActive ? "rgba(181,255,24,0.08)" : "rgba(255,255,255,0.04)"}
                    stroke={isActive ? "rgba(181,255,24,0.4)" : "rgba(255,255,255,0.1)"}
                    strokeWidth="1"
                  />
                  {isActive && (
                    <circle cx={node.x} cy={node.y} r={isLeaf ? 18 : 24} fill="none" stroke="rgba(181,255,24,0.3)" strokeWidth="1" opacity="0.5">
                      <animate attributeName="r" from={isLeaf ? 18 : 24} to={isLeaf ? 28 : 34} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <text x={node.x} y={node.y + 4} textAnchor="middle" fill={isActive ? "#b5ff18" : "#e0e0e0"} fontSize={isLeaf ? "9" : "11"} fontFamily="Space Mono, monospace" fontWeight="600">{node.name}</text>
                  <text x={node.x} y={node.y + (isLeaf ? 32 : 40)} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="Space Mono, monospace">[{node.role}]</text>
                </motion.g>
              );
            })}
          </svg>
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
