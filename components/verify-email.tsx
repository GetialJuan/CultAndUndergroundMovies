/**
 * @fileoverview VerifyEmailComponent for verifying user email addresses.
 * This component handles the email verification process using a token from the URL's search parameters.
 * It displays different states (loading, success, error) based on the verification result.
 *
 * @component
 * @example
 * <VerifyEmailComponent />
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

/**
 * VerifyEmailComponent.
 *
 * @returns {JSX.Element} The rendered VerifyEmailComponent.
 */
export default function VerifyEmailComponent() {
  /**
   * @typedef {"loading" | "success" | "error"} VerificationStatus
   */

  /** @type {[VerificationStatus, React.Dispatch<React.SetStateAction<VerificationStatus>>]} */
  const [status, setStatus] = useState<VerificationStatus>("loading")
  /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  /**
   * Effect to verify the email using the token from the URL.
   */
  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error")
        setErrorMessage("Verification token not found. Please request a new verification link.")
        return
      }

      try {
        // Here would be the actual token verification logic
        // This is a simulated example
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Simulate successful verification
        setStatus("success")

        // Automatic redirection after 3 seconds
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } catch (err) {
        setStatus("error")
        setErrorMessage("We couldn't verify your email. The link may have expired or be invalid.")
      }
    }

    verifyEmail()
  }, [token, router])

  /**
   * Handles navigation to the home page.
   */
  const handleGoToHome = () => {
    router.push("/")
  }

  /**
   * Handles navigation to the login page.
   */
  const handleGoToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="space-y-6 rounded-lg border border-gray-800 bg-gray-900/50 p-6 shadow-lg">
      {status === "loading" && (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-red-500" />
          <p className="text-gray-400">Verifying your email address...</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6">
          <Alert className="border-green-800 bg-green-950 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Your email has been successfully verified!</AlertDescription>
          </Alert>

          <div className="space-y-4 text-center">
            <p className="text-gray-400">You will be automatically redirected to the homepage in a few seconds.</p>

            <Button onClick={handleGoToHome} className="w-full bg-red-600 hover:bg-red-700 text-white">
              Go to Homepage
            </Button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6">
          <Alert variant="destructive" className="border-red-800 bg-red-950 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>

          <div className="space-y-4 text-center">
            <p className="text-gray-400">
              Please try registering again or contact support if the issue persists.
            </p>

            <Button onClick={handleGoToLogin} className="w-full bg-red-600 hover:bg-red-700 text-white">
              Return to Login
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
