"use client"

import { useRef, useState } from "react"
import Link from "next/link"

type QuadrantProduct = {
  id: string
  name: string
  slug: string
  visionScore: number  // 0-100, x-axis
  executionScore: number // 0-100, y-axis
  quadrant: "Leaders" | "Challengers" | "Visionaries" | "Niche Players"
}

interface MarketQuadrantProps {
  products: QuadrantProduct[]
  title?: string
  subtitle?: string
}

const QUADRANT_COLORS: Record<string, string> = {
  "Leaders": "#ff6d29",
  "Challengers": "#34d399",
  "Visionaries": "#bababa",
  "Niche Players": "#6b625c",
}

function getQuadrant(vision: number, execution: number): QuadrantProduct["quadrant"] {
  if (vision >= 50 && execution >= 50) return "Leaders"
  if (vision < 50 && execution >= 50) return "Challengers"
  if (vision >= 50 && execution < 50) return "Visionaries"
  return "Niche Players"
}

export function MarketQuadrant({ products, title = "This Quarter's Market Quadrant", subtitle }: MarketQuadrantProps) {
  const [hoveredProduct, setHoveredProduct] = useState<QuadrantProduct | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  // Chart dimensions
  const padding = 50
  const chartSize = 500

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-saffron mb-1">THE SIGNAL</p>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink">{title}</h2>
        <p className="text-sm text-ink/60 mt-1">
          {subtitle || "Every pin is placed by verified peer reviews — weighted by recency, never bought. Hover to focus, click to open a product."}
        </p>
      </div>

      {/* Chart Container */}
      <div className="bg-paper border border-indigo/10 rounded-2xl p-4 md:p-8 shadow-sm overflow-hidden">
        <div className="text-left mb-4">
          <h3 className="font-heading font-bold text-ink text-lg">DeshStack Market Quadrant</h3>
          <p className="text-xs text-ink/50">Placement is computed from verified peer reviews — <span className="text-saffron font-medium">never bought or manually set.</span></p>
        </div>

        {/* SVG Quadrant */}
        <div ref={chartRef} className="relative w-full" style={{ maxWidth: chartSize + padding * 2 }}>
          <svg
            viewBox={`0 0 ${chartSize + padding * 2} ${chartSize + padding * 2}`}
            className="w-full h-auto"
            style={{ maxHeight: "600px" }}
          >
            {/* Background quadrants */}
            <rect x={padding} y={padding} width={chartSize / 2} height={chartSize / 2} fill="#221c19" stroke="#302722" strokeWidth="1" />
            <rect x={padding + chartSize / 2} y={padding} width={chartSize / 2} height={chartSize / 2} fill="#1e1917" stroke="#302722" strokeWidth="1" />
            <rect x={padding} y={padding + chartSize / 2} width={chartSize / 2} height={chartSize / 2} fill="#261f1b" stroke="#302722" strokeWidth="1" />
            <rect x={padding + chartSize / 2} y={padding + chartSize / 2} width={chartSize / 2} height={chartSize / 2} fill="#221c19" stroke="#302722" strokeWidth="1" />

            {/* Dotted center lines */}
            <line x1={padding} y1={padding + chartSize / 2} x2={padding + chartSize} y2={padding + chartSize / 2} stroke="#4a3a30" strokeWidth="1" strokeDasharray="6 4" />
            <line x1={padding + chartSize / 2} y1={padding} x2={padding + chartSize / 2} y2={padding + chartSize} stroke="#4a3a30" strokeWidth="1" strokeDasharray="6 4" />

            {/* Quadrant Labels */}
            <text x={padding + chartSize * 0.25} y={padding + 24} textAnchor="middle" className="fill-teal font-heading font-bold text-[14px]">Challengers</text>
            <text x={padding + chartSize * 0.75} y={padding + 24} textAnchor="middle" className="fill-saffron font-heading font-bold text-[14px]">Leaders</text>
            <text x={padding + chartSize * 0.25} y={padding + chartSize - 10} textAnchor="middle" className="fill-muted font-heading font-bold text-[14px]">Niche Players</text>
            <text x={padding + chartSize * 0.75} y={padding + chartSize - 10} textAnchor="middle" className="fill-indigo font-heading font-bold text-[14px]">Visionaries</text>

            {/* Y-axis label */}
            <text
              x={18}
              y={padding + chartSize / 2}
              textAnchor="middle"
              transform={`rotate(-90, 18, ${padding + chartSize / 2})`}
              className="fill-teal font-bold text-[11px] uppercase tracking-widest"
            >
              ABILITY TO EXECUTE →
            </text>

            {/* X-axis label */}
            <text
              x={padding + chartSize / 2}
              y={chartSize + padding + 40}
              textAnchor="middle"
              className="fill-indigo font-bold text-[11px] uppercase tracking-widest"
            >
              COMPLETENESS OF VISION →
            </text>

            {/* Product dots */}
            {products.map((product) => {
              const x = padding + (product.visionScore / 100) * chartSize
              const y = padding + chartSize - (product.executionScore / 100) * chartSize
              const isHovered = hoveredProduct?.id === product.id
              const color = QUADRANT_COLORS[product.quadrant]

              return (
                <g key={product.id}>
                  <Link href={`/products/${product.slug}`}>
                    {/* Hover ring */}
                    {isHovered && (
                      <circle
                        cx={x}
                        cy={y}
                        r={14}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        opacity={0.3}
                        className="animate-pulse-glow"
                      />
                    )}
                    {/* Dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 8 : 6}
                      fill={color}
                      className="cursor-pointer transition-all duration-200"
                      style={{ filter: isHovered ? "brightness(1.2)" : "none" }}
                      onMouseEnter={() => setHoveredProduct(product)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    />
                    {/* Label */}
                    <text
                      x={x + 12}
                      y={y + 4}
                      className="text-[11px] font-semibold fill-ink cursor-pointer"
                      style={{ opacity: isHovered ? 1 : 0.8 }}
                      onMouseEnter={() => setHoveredProduct(product)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      {product.name}
                    </text>
                  </Link>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-indigo/10">
          {Object.entries(QUADRANT_COLORS).map(([label, color]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-medium text-ink/70">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper to compute quadrant products from DB data
export function computeQuadrantProducts(
  products: Array<{
    id: string
    name: string
    slug: string
    score?: { executionScore: number; visionScore: number } | null
  }>
): QuadrantProduct[] {
  return products
    .filter(p => p.score)
    .map(p => {
      const vision = Math.min(100, Math.max(0, (p.score!.visionScore / 5) * 100))
      const execution = Math.min(100, Math.max(0, (p.score!.executionScore / 5) * 100))
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        visionScore: vision,
        executionScore: execution,
        quadrant: getQuadrant(vision, execution),
      }
    })
}
