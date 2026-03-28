'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Flame, ShoppingCart, BarChart3, Smartphone, Bot, Globe, Code, Gamepad2, Lock, Lightbulb } from 'lucide-react'
import { formatPrice, centsToDollars, timeAgo } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Project } from '@/types'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'e-commerce':    <ShoppingCart size={28} />,
  'saas':          <BarChart3 size={28} />,
  'mobile-app':    <Smartphone size={28} />,
  'ai-automation': <Bot size={28} />,
  'landing-page':  <Globe size={28} />,
  'script-api':    <Code size={28} />,
  'game':          <Gamepad2 size={28} />,
  'security':      <Lock size={28} />,
  'other':         <Lightbulb size={28} />,
}

const BG_COLORS = [
  'bg-amber', 'bg-teal', 'bg-[#C8B2FF]', 'bg-yellow',
  'bg-[#B7E4C7]', 'bg-cobalt/30', 'bg-coral/40',
]

function colorFromId(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return BG_COLORS[Math.abs(hash) % BG_COLORS.length]
}

interface ProjectCardProps {
  project:    Project
  className?: string
}

export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  const bg = colorFromId(project.id || project.title)
  const initials = project.sellerName.slice(0, 2).toUpperCase()

  return (
    <Link
      href={`/projects/${project.id}`}
      className={`block border-r-2 border-b-2 border-black bg-cream cursor-pointer group transition-colors hover:bg-white ${className}`}
    >
      {/* Thumbnail */}
      <div className={`relative w-full aspect-video ${bg} border-b-2 border-black flex items-center justify-center overflow-hidden`}>
        {project.thumbnailURL ? (
          <Image
            src={project.thumbnailURL}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <span className="opacity-30">{CATEGORY_ICONS[project.category] ?? <Code size={28} />}</span>
        )}
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {project.hasDemo && (
            <span className="inline-flex items-center gap-1 bg-[#B7E4C7] border-2 border-black rounded-pill px-2.5 py-0.5 text-[11px] font-bold">
              <Play size={9} className="fill-current" /> Demo
            </span>
          )}
        </div>
        <div className="absolute top-2.5 right-2.5">
          {project.purchases > 10 && (
            <span className="inline-flex items-center gap-1 bg-amber border-2 border-black rounded-pill px-2.5 py-0.5 text-[11px] font-bold">
              <Flame size={10} /> Hot
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Seller row */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-full border-2 border-black bg-amber flex items-center justify-center text-[10px] font-black shrink-0">
            {project.sellerPhotoURL ? (
              <Image src={project.sellerPhotoURL} alt={project.sellerName} width={24} height={24} className="rounded-full" />
            ) : initials}
          </div>
          <span className="text-[12px] font-semibold text-gray-500">@{project.sellerName}</span>
          {project.rating > 0 && (
            <span className="text-[11px] text-yellow-600 ml-auto">
              {'★'.repeat(Math.floor(project.rating))} {project.rating.toFixed(1)}
            </span>
          )}
        </div>

        <h3 className="font-black text-[15px] leading-tight tracking-tight mb-1.5 line-clamp-2">
          {project.title}
        </h3>

        <p className="text-[13px] text-gray-500 leading-snug line-clamp-2 mb-3">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.techStack.slice(0, 4).map(t => (
            <span key={t} className="text-[11px] font-bold px-2 py-0.5 rounded-pill border border-black bg-cream">
              {t}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-black">
          <span className="text-[19px] font-black tracking-tight">
            {formatPrice(project.price)}
          </span>
          <div className="flex gap-1.5">
            {project.hasDemo && (
              <button
                onClick={e => { e.preventDefault(); window.open(project.demoURL, '_blank') }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-pill border-2 border-black text-[12px] font-bold hover:bg-black hover:text-white transition-colors"
              >
                <Play size={10} className="fill-current" /> Demo
              </button>
            )}
            <span className="px-3 py-1.5 rounded-pill bg-black text-white text-[12px] font-bold group-hover:bg-gray-800 transition-colors">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
