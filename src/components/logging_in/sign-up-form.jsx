import { useState } from "react"
import { supabase } from "@/lib/supabaseClient.js"
import { CardContent } from "@/components/ui/card-content"
import { CardHeader } from "@/components/ui/card-header"
import { BtnMain } from "@/components/ui/buttons/btn-main"
import "./styles/sign-up-form.css"

export default function SignUpForm({ onSignInClick }) {
    const [fullName, setFullName] = useState('')
    const [mspName, setMspName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSignUp = async (e) => {
        e.preventDefault()
        setError(null)

        if (password !== repeatPassword) {
            setError('Passwords do not match')
            return
        }

        setIsLoading(true)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/?auth=confirmed`,
                    data: {
                        full_name: fullName,
                        msp_name: mspName,
                        role: 'msp_admin' // First-time creator gets admin role
                    }
                },
            })
            if (error) throw error
            setSuccess(true)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="signup-page">
            <section className="main-wrapper" aria-labelledby="signup-title">
                {success ? (
                    <div className="success-state">
                        <CardHeader />
                        <p className="success-text">
                            You've successfully signed up! Please check your email to confirm your account before signing in.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSignUp}>
                        <CardHeader />

                        <div className="form-fields">
                            <CardContent
                                label="Full Name"
                                type="text"
                                placeholder="Jane Doe"
                                name="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />

                            <CardContent
                                label="MSP / Company Name"
                                type="text"
                                placeholder="Acme Managed Services"
                                name="mspName"
                                value={mspName}
                                onChange={(e) => setMspName(e.target.value)}
                            />

                            <CardContent
                                label="Email"
                                type="email"
                                placeholder="m@example.com"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <CardContent
                                label="Password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <CardContent
                                label="Repeat Password"
                                type="password"
                                name="repeatPassword"
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="form-error">{error}</p>}

                        <BtnMain className="signup-submit" type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating account...' : 'Create MSP Account'}
                        </BtnMain>

                        <p className="signup-footer">
                            Already have an account? <a href="/sign-in" onClick={onSignInClick}>Sign in</a>
                        </p>
                    </form>
                )}
            </section>
        </main>
    )
}