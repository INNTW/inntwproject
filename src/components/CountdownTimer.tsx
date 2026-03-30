"use client";

import { useState, useEffect } from "react";

const TARGET_DATE = new Date("2026-06-06T13:00:00");

interface TimeLeft {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = TARGET_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  // Calculate months and remaining days properly
  let months = 0;
  const tempDate = new Date(now);

  while (true) {
    const nextMonth = new Date(tempDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);    if (nextMonth > TARGET_DATE) break;
    months++;
    tempDate.setMonth(tempDate.getMonth() + 1);
  }

  // Remaining milliseconds after full months
  const remainingMs = TARGET_DATE.getTime() - tempDate.getTime();
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { months, days, hours, minutes, seconds };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const units: { label: string; value: string }[] = [
    { label: "MONTHS", value: pad(timeLeft.months) },
    { label: "DAYS", value: pad(timeLeft.days) },
    { label: "HOURS", value: pad(timeLeft.hours) },
    { label: "MINUTES", value: pad(timeLeft.minutes) },
    { label: "SECONDS", value: pad(timeLeft.seconds) },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "clamp(10px, 2vw, 24px)",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-geist-mono), monospace",
      }}
    >
      {units.map((unit, i) => (
        <div key={unit.label} style={{ display: "flex", alignItems: "center", gap: "clamp(10px, 2vw, 24px)" }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "clamp(11px, 1.2vw, 15px)",
                fontWeight: 300,
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1,              }}
            >
              {unit.value}
            </div>
            <div
              style={{
                fontSize: "clamp(5px, 0.4vw, 6px)",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.35)",
                marginTop: "3px",
                textTransform: "uppercase",
              }}
            >
              {unit.label}
            </div>
          </div>
          {i < units.length - 1 && (
            <div
              style={{
                fontSize: "clamp(8px, 0.9vw, 12px)",
                fontWeight: 200,
                color: "rgba(255,255,255,0.2)",
                lineHeight: 1,
                marginTop: "-4px",
              }}
            >
              :
            </div>
          )}        </div>
      ))}
    </div>
  );
}
