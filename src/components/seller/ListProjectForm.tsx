'use client'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { projectSchema, type ProjectInput } from '@/lib/validations'
import { CATEGORY_LABELS } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Input'

const CATEGORY_OPTIONS = [
  { value: '', label: 'Select a category' },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
]

export function ListProjectForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [techInput, setTechInput] = useState('')
  const [featInput, setFeatInput] = useState('')

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: { techStack: [], features: [], tags: [], price: 0 },
  })

  const techStack = watch('techStack')
  const features  = watch('features')

  const addTech = () => {
    const val = techInput.trim()
    if (val && !techStack.includes(val)) setValue('techStack', [...techStack, val])
    setTechInput('')
  }
  const removeTech = (t: string) => setValue('techStack', techStack.filter(x => x !== t))

  const addFeature = () => {
    const val = featInput.trim()
    if (val) setValue('features', [...features, val])
    setFeatInput('')
  }
  const removeFeature = (i: number) => setValue('features', features.filter((_, idx) => idx !== i))

  const onSubmit = async (data: ProjectInput) => {
    setServerError(null)
    try {
      const res = await fetch('/api/projects', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })
      const json = await res.json()
      if (!json.ok) { setServerError(json.error?.message || 'Submission failed'); return }
      router.push(`/dashboard/seller?tab=projects`)
    } catch {
      setServerError('Network error — please try again')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <Input
        label="Project title"
        placeholder="e.g. Full-Stack E-Commerce with Stripe & Admin Panel"
        error={errors.title?.message}
        {...register('title')}
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Select
            label="Category"
            options={CATEGORY_OPTIONS}
            error={errors.category?.message}
            {...field}
          />
        )}
      />

      <Textarea
        label="Short description"
        placeholder="Describe what the project does (shown on cards)"
        error={errors.description?.message}
        {...register('description')}
      />

      <Textarea
        label="Full description (optional)"
        placeholder="Detailed explanation for the project page"
        className="min-h-[140px]"
        {...register('longDescription')}
      />

      <Input
        label="Price (USD)"
        type="number"
        min={1}
        max={50000}
        step={1}
        placeholder="299"
        error={errors.price?.message}
        {...register('price', { valueAsNumber: true })}
      />

      <Input
        label="Live demo URL (optional)"
        type="url"
        placeholder="https://demo.yourproject.com"
        error={errors.demoURL?.message}
        {...register('demoURL')}
      />

      {/* Tech stack chips */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-1.5">
          Tech stack <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {techStack.map(t => (
            <span key={t} className="flex items-center gap-1 px-3 py-1 bg-black text-white rounded-pill text-xs font-bold">
              {t}
              <button type="button" onClick={() => removeTech(t)} className="hover:text-red-300 ml-1">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={techInput}
            onChange={e => setTechInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
            placeholder="e.g. Next.js"
            className="flex-1 border-2 border-black rounded-xl px-4 py-2.5 bg-cream text-sm focus:outline-none focus:bg-white"
          />
          <Button type="button" variant="outline" size="sm" onClick={addTech}>Add</Button>
        </div>
        {errors.techStack && <p className="text-xs text-red-600 font-semibold mt-1">{errors.techStack.message}</p>}
      </div>

      {/* What's included */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wide text-gray-600 block mb-1.5">
          What's included <span className="text-red-500">*</span>
        </label>
        <div className="space-y-1.5 mb-2">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="text-teal font-bold">✓</span>
              <span className="flex-1">{f}</span>
              <button type="button" onClick={() => removeFeature(i)} className="text-gray-400 hover:text-red-500 text-xs">×</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={featInput}
            onChange={e => setFeatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            placeholder="e.g. Full source code included"
            className="flex-1 border-2 border-black rounded-xl px-4 py-2.5 bg-cream text-sm focus:outline-none focus:bg-white"
          />
          <Button type="button" variant="outline" size="sm" onClick={addFeature}>Add</Button>
        </div>
        {errors.features && <p className="text-xs text-red-600 font-semibold mt-1">{errors.features.message}</p>}
      </div>

      {serverError && (
        <div className="bg-red-50 border-2 border-red-400 rounded-xl px-4 py-3 text-sm text-red-700 font-semibold">
          {serverError}
        </div>
      )}

      <Button type="submit" loading={isSubmitting} size="lg" fullWidth>
        Submit for review →
      </Button>
      <p className="text-center text-xs text-gray-400">Projects reviewed within 24h · 10% platform fee on sales</p>
    </form>
  )
}
