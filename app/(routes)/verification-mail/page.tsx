'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No se proporcionó un token de verificación');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Tu email ha sido verificado correctamente');
          // Redirección automática después de 3 segundos
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Error al verificar el email');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error al conectar con el servidor');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link
            href="/"
            className="inline-block mb-6 text-red-500 hover:text-red-400 transition-colors"
          >
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-white">
            Verificación de Email
          </h1>
        </div>

        <div className="space-y-6 rounded-lg border border-gray-800 bg-gray-900/50 p-6 shadow-lg">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
              <p className="text-gray-400">Verificando tu email...</p>
            </div>
          )}

          {status === 'success' && (
            <Alert className="border-green-800 bg-green-950 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert className="border-red-800 bg-red-950 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            {status === 'success' ? (
              <p className="text-gray-400">
                Serás redirigido automáticamente en unos segundos...
              </p>
            ) : status === 'error' ? (
              <Button
                onClick={() => router.push('/login')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Ir al inicio de sesión
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
