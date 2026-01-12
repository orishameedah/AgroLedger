import React from "react";

// --- BADGE COMPONENT ---
export const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${className}`}
  >
    {children}
  </span>
);

// --- CARD COMPONENTS ---
export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden ${className}`}
  >
    {children}
  </div>
);

export const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`p-8 border-b border-slate-50 dark:border-slate-800 ${className}`}
  >
    {children}
  </div>
);

export const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3
    className={`text-xl font-black text-slate-800 dark:text-white flex items-center gap-3 ${className}`}
  >
    {children}
  </h3>
);

export const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-8 ${className}`}>{children}</div>;
