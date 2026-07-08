import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-ink mb-2">Join DeshStack</h1>
          <p className="text-ink/60">Create your account and start discovering software built for Bharat</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border border-indigo/10 rounded-2xl",
              headerTitle: "font-heading",
              formButtonPrimary: "bg-indigo hover:bg-indigo/90",
            },
          }}
        />
      </div>
    </div>
  )
}
