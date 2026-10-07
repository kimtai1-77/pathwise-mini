import { useState } from "react"
import { supabase } from "@/lib/supabaseClient.js"
import { CardContent } from "@/components/ui/card-content"
import { CardHeader } from "@/components/ui/card-header"
import { BtnMain } from "@/components/ui/buttons/btn-main"
import "../styles/sign-up-form.css"

export default function SignUpForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPasword] = useState('')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSignUp = async (e) => {
        // const supabase = createClient()
        e.preventDefault()
        setError(null)

        if (password !== repeatPassword) {
            setError('Passwords do not match')
            return
        }

        setIsLoading(true)

        try {
            const { error } = await supabase.auth.signUp({
                email, password,
            })
            if (error) throw error
            setSuccess(true)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occured')
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <main className="signup-page">
            <section className="main-wrapper" aria-labelledby="signup-title">
                {success ? (
                    <div className="success-state">
                        <CardHeader />
                        <p className="success-text">
                            You've successfully signed up. Please check your email to confirm your account before signing in.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSignUp}>
                        <CardHeader />

                        <div className="form-fields">
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
                                onChange={(e) => setRepeatPasword(e.target.value)}
                            />
                        </div>

                        {error && <p className="form-error">{error}</p>}

                        <BtnMain className="signup-submit" type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating an account...' : 'Sign up'}
                        </BtnMain>

                        <p className="signup-footer">
                            Already have an account? <a href="#sign-in">Sign in</a>
                        </p>
                    </form>
                )}
            </section>
        </main>
    )
}

