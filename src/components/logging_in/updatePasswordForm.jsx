import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient.js'
import { CardContent } from '@/components/ui/card-content'
import { CardHeader } from '@/components/ui/card-header'
import { BtnMain } from '@/components/ui/buttons/btn-main'
import './styles/updatePasswordForm.css'

export default function UpdatePasswordForm({ onPasswordUpdated, onSignInClick }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleUpdatePassword = async (e) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const { data, error } = await supabase.auth.updateUser({ password })
            if (error) throw error
            if (onPasswordUpdated) onPasswordUpdated(data.user)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="update-password-page">
            <section className="update-password-wrapper" aria-labelledby="update-password-title">
                <form onSubmit={handleUpdatePassword}>
                    <CardHeader
                        title="Choose a new password"
                        description="Enter your new password below."
                        titleId="update-password-title"
                    />

                    <div className="update-password-fields">
                        <CardContent
                            label="New password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    {error && <p className="update-password-error" role="alert">{error}</p>}

                    <BtnMain className="update-password-submit" type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save new password'}
                    </BtnMain>

                    <p className="update-password-footer">
                        Remembered your password?{' '}
                        <a href="/sign-in" onClick={onSignInClick}>Sign in</a>
                    </p>
                </form>
            </section>
        </main>
    )
}