import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Ingresa tu nombre completo').max(120),
    email: z.string().email('Email inválido'),
    phone: z.string().trim().regex(/^\+?[0-9]{8,15}$/, 'Número inválido (ej: 912345678)'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(8, 'Confirma tu contraseña'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

type TrialHistoryResult = {
  hasTrialHistory: boolean;
  totalTrials?: number;
};

export default function Signup() {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingHistory, setIsCheckingHistory] = useState(false);
  const [trialHistory, setTrialHistory] = useState<TrialHistoryResult | null>(null);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const emailValue = form.watch('email');

  useEffect(() => {
    document.title = 'Crear cuenta | Nave Studio';
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const canCheckHistory = useMemo(() => z.string().email().safeParse(emailValue).success, [emailValue]);

  const checkTrialHistory = async () => {
    if (!canCheckHistory) return;

    setIsCheckingHistory(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-user-trial-history', {
        body: { email: emailValue.trim().toLowerCase() },
      });

      if (error) {
        console.error('Error checking trial history:', error);
        setTrialHistory(null);
        return;
      }

      setTrialHistory(data ?? null);
    } catch (error) {
      console.error('Error checking trial history:', error);
      setTrialHistory(null);
    } finally {
      setIsCheckingHistory(false);
    }
  };

  const onSubmit = async (values: SignupFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await signUp(values.email, values.password, values.fullName);
      if (error) {
        toast.error(error.message || 'No se pudo crear tu cuenta');
        return;
      }

      toast.success('Cuenta creada. Revisa tu email para confirmar tu registro.');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>Regístrate para centralizar tu historial y gestionar tus clases.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre y apellido" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        disabled={isSubmitting}
                        onBlur={(event) => {
                          field.onBlur();
                          void checkTrialHistory();
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isCheckingHistory && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando historial de clases de prueba...
                </p>
              )}

              {trialHistory?.hasTrialHistory && (
                <p className="rounded-md border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-foreground">
                  Detectamos {trialHistory.totalTrials} clase(s) de prueba con este email. Las vincularemos automáticamente a tu cuenta.
                </p>
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear cuenta'
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
