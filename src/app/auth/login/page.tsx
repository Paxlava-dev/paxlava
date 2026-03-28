'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PaxlavaLogo } from '@/components/shared/PaxlavaLogo'

export default function LoginPage() {
  const router      = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard/buyer'
  const [serverErr, setServerErr] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setServerErr(null)
    try {
      // Sign in with Firebase to get ID token
      const cred = await signInWithEmailAndPassword(auth, data.email, data.password)
      const idToken = await cred.user.getIdToken()

      // Pass ID token to NextAuth credentials provider
      const res = await signIn('credentials', {
        email:    data.email,
        password: idToken,
        redirect: false,
      })
      if (res?.error) { setServerErr('Invalid email or password'); return }
      router.push(callbackUrl)
    } catch (e: any) {
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
        setServerErr('Invalid email or password')
      } else {
        setServerErr('Something went wrong — please try again')
      }
    }
  }

  const oauthLogin = (provider: 'google' | 'github') =>
    signIn(provider, { callbackUrl })

  return (
    <div className="min-h-[calc(100vh-60px)] grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center px-14 py-16 bg-amber border-r-2 border-black">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <PaxlavaLogo size={40} />
          <span className="text-2xl font-black">Paxlava</span>
        </Link>
        <h2 className="text-4xl font-black tracking-tight leading-tight mb-4">
          Welcome back.<br />Keep building.
        </h2>
        <p className="text-gray-700 leading-relaxed mb-8 max-w-sm">
          Log back in to manage your listings, check your sales, and connect with buyers.
        </p>
        <div className="bg-white border-2 border-black rounded-xl p-5 max-w-sm shadow-hard">
          <p className="text-sm font-semibold leading-relaxed mb-3">
            &quot;I listed my e-commerce template and made $2,400 in the first month. The buyers are serious and the escrow gave me full peace of mind.&quot;
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-yellow border-2 border-black flex items-center justify-center text-xs font-black">AH</div>
            <div>
              <div className="font-bold text-sm">@azer_hub</div>
              <div className="text-xs text-gray-500">E-Commerce Developer, Baku</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center px-8 lg:px-16 py-12 bg-white">
        <div className="max-w-sm w-full mx-auto">
          <h3 className="text-3xl font-black tracking-tight mb-1">Welcome back</h3>
          <p className="text-sm text-gray-500 mb-7">Log in to your Paxlava account</p>

          {/* OAuth */}
          <button onClick={() => oauthLogin('google')} className="w-full py-3 border-2 border-black rounded-xl bg-cream hover:bg-[#edeae1] font-bold text-sm flex items-center justify-center gap-2.5 mb-3 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <button onClick={() => oauthLogin('github')} className="w-full py-3 border-2 border-black rounded-xl bg-cream hover:bg-[#edeae1] font-bold text-sm flex items-center justify-center gap-2.5 mb-6 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            Continue with GitHub
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-0.5 bg-black" />
            <span className="text-xs font-bold text-gray-400">or</span>
            <div className="flex-1 h-0.5 bg-black" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            {serverErr && (
              <div className="bg-red-50 border-2 border-red-400 rounded-xl px-4 py-3 text-sm text-red-700 font-semibold">
                {serverErr}
              </div>
            )}
            <Button type="submit" loading={isSubmitting} fullWidth size="lg">
              Log in →
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-bold underline hover:no-underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
