"use client"

import { useEffect, useState } from "react"

interface IntegrityRingProps {
  score: number
  maxScore?: number
  size?: number
}

export function IntegrityRing({
  score,
  maxScore = 100,
  size = 100,
}: IntegrityRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const strokeWidth = 4
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = Math.min(score / maxScore, 1)
  const animatedPercentage = Math.min(animatedScore / maxScore, 1)
  const strokeDashoffset = circumference * (1 - animatedPercentage)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-border"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-2xl font-bold text-foreground">
          {score}
        </span>
        <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
          Score
        </span>
      </div>
    </div>
  )
}
