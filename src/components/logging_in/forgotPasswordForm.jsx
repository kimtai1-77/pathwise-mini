import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient.js'
import { CardContent } from '@/components/ui/card-content'
import { CardHeader } from '@/components/ui/card-header'
import { BtnMain } from '@/components/ui/buttons/btn-main'
import './styles/forgotPasswordForm.css'

export default function ForgotPasswordForm({ onSignInClick }) {
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const redirectTo = `${window.location.origin}/?auth=update-password`
            const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
            if (error) throw error
            setSuccess(true)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="forgot-password-page">
            <section className="forgot-password-wrapper" aria-labelledby="forgot-password-title">
                {success ? (
                    <div className="forgot-password-success">
                        <CardHeader
                            title="Check your email"
                            description="Password reset instructions sent"
                            titleId="forgot-password-title"
                        />
                        <p role="status">
                            If you registered with this email address, you will receive a password reset link.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleForgotPassword}>
                        <CardHeader
                            title="Reset your password"
                            description="Enter your email and we’ll send you a link to reset your password."
                            titleId="forgot-password-title"
                        />

                        <div className="forgot-password-fields">
                            <CardContent
                                label="Email"
                                type="email"
                                placeholder="m@example.com"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>

                        {error && <p className="forgot-password-error" role="alert">{error}</p>}

                        <BtnMain className="forgot-password-submit" type="submit" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send reset email'}
                        </BtnMain>

                        <p className="forgot-password-footer">
                            Already have an account?{' '}
                            <a href="/sign-in" onClick={onSignInClick}>Sign in</a>
                        </p>
                    </form>
                )}
            </section>
        </main>
    )
}