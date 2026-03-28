'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { signupSchema, type SignupInput } from '@/lib/validations'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PaxlavaLogo } from '@/components/shared/PaxlavaLogo'

export default function SignupPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const defaultRole  = (searchParams.get('role') as 'buyer' | 'seller') || 'buyer'
  const [role, setRole]         = useState<'buyer' | 'seller'>(defaultRole)
  const [serverErr, setServerErr] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: defaultRole },
  })

  const onSubmit = async (data: SignupInput) => {
    setServerErr(null)
    try {
      // Create Firebase user
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password)
      await updateProfile(cred.user, { displayName: data.displayName })
      const idToken = await cred.user.getIdToken()

      // Sign in via NextAuth (creates Firestore user doc with correct role)
      const res = await signIn('credentials', {
        email:    data.email,
        password: idToken,
        role:     role,
        redirect: false,
      })

      if (res?.error) { setServerErr('Account created but sign-in failed — please log in.'); return }

      router.push(role === 'seller' ? '/dashboard/seller' : '/discover')
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        setServerErr('An account with this email already exists')
      } else {
        setServerErr('Something went wrong — please try again')
      }
    }
  }

  const oauthLogin = (provider: 'google' | 'github') =>
    signIn(provider, { callbackUrl: role === 'seller' ? '/dashboard/seller' : '/discover' })

  return (
    <div className="min-h-[calc(100vh-60px)] grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center px-14 py-16 bg-teal text-white border-r-2 border-black">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <PaxlavaLogo size={40} />
          <span className="text-2xl font-black text-white">Paxlava</span>
        </Link>
        <h2 className="text-4xl font-black tracking-tight leading-tight mb-4">
          Turn your IT projects<br />into income.
        </h2>
        <p className="text-white/80 leading-relaxed mb-8 max-w-sm">
          Join hundreds of developers from Azerbaijan and around the world selling ready-to-deploy projects on Paxlava.
        </p>
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {[
            { n: '1,240+', l: 'Projects listed'    },
            { n: '340+',   l: 'Verified sellers'    },
            { n: '$2.1M',  l: 'Earned by sellers'   },
            { n: '98%',    l: 'Buyer satisfaction'  },
          ].map(s => (
            <div key={s.l} className="bg-white/15 rounded-xl p-4 border border-white/25">
              <div className="text-2xl font-black">{s.n}</div>
              <div className="text-xs text-white/70 mt-1 font-semibold">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center px-8 lg:px-16 py-12 bg-white">
        <div className="max-w-sm w-full mx-auto">
          <h3 className="text-3xl font-black tracking-tight mb-1">Create your account</h3>
          <p className="text-sm text-gray-500 mb-6">Join the IT marketplace</p>

          {/* Role toggle */}
          <div className="grid grid-cols-2 border-2 border-black rounded-xl overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`py-3.5 text-sm font-bold transition-colors ${role === 'buyer' ? 'bg-black text-white' : 'bg-white hover:bg-cream'}`}
            >
              🛒 I&apos;m a Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`py-3.5 text-sm font-bold transition-colors ${role === 'seller' ? 'bg-black text-white' : 'bg-white hover:bg-cream'}`}
            >
              💰 I&apos;m a Seller
            </button>
          </div>

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
            <Input label="Full name"  placeholder="Your name" error={errors.displayName?.message} {...register('displayName')} />
            <Input label="Email"      type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            <Input label="Password"   type="password" placeholder="At least 6 characters" error={errors.password?.message} {...register('password')} />
            {serverErr && (
              <div className="bg-red-50 border-2 border-red-400 rounded-xl px-4 py-3 text-sm text-red-700 font-semibold">
                {serverErr}
              </div>
            )}
            <Button type="submit" loading={isSubmitting} fullWidth size="lg">
              Create account →
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="underline">Terms</Link> and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
          <p className="text-center text-sm text-gray-500 mt-3">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold underline hover:no-underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
