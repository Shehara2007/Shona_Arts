import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../components/Toast';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { googleLogin, login, register } from '../redux/authSlice';

const authSchema = z.object({
  name: z.string().optional(),
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type AuthForm = z.infer<typeof authSchema>;

export function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.auth.loading);
  const user = useAppSelector((state) => state.auth.user);
  const { showToast } = useToast();
  const { register: field, handleSubmit, formState: { errors } } = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: { name: '', email: 'admin@shonaarts.com', password: 'password123' },
  });

  const submit = async (form: AuthForm) => {
    const action = mode === 'login' ? login({ email: form.email, password: form.password }) : register({ name: form.name || 'Shona Collector', email: form.email, password: form.password });
    const result = await dispatch(action);
    if (login.fulfilled.match(result) || register.fulfilled.match(result)) {
      showToast(mode === 'login' ? 'Welcome back to Shona Arts' : 'Account created successfully');
      navigate(result.payload.user.role === 'admin' ? '/admin' : '/user');
      return;
    }
    showToast('Login failed. Please check your details and try again.');
  };

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : '/user', { replace: true });
  }, [navigate, user]);

  return (
    <section className="mx-auto grid min-h-[calc(100vh-160px)] max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <p className="font-bold uppercase tracking-[0.18em] text-gallery-red">Secure access</p>
        <h1 className="font-display text-5xl font-extrabold">Login, collect, bid, and commission.</h1>
        <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">JWT authentication protects customer routes, admin tools, checkout, reviews, auctions, and custom artwork requests.</p>
      </div>
      <form onSubmit={handleSubmit(submit)} className="glass rounded-lg p-6">
        <div className="mb-5 grid grid-cols-2 rounded-md bg-gallery-rose p-1 dark:bg-white/10">
          {(['login', 'register'] as const).map((item) => (
            <button key={item} type="button" onClick={() => setMode(item)} className={`rounded px-4 py-2 font-bold capitalize ${mode === item ? 'bg-white text-gallery-red shadow-sm dark:bg-zinc-950' : ''}`}>{item}</button>
          ))}
        </div>
        {mode === 'register' && <Input {...field('name')} placeholder="Full name" className="mb-3" />}
        <Input {...field('email')} placeholder="Email" className="mb-2" />
        {errors.email && <p className="mb-2 text-sm font-semibold text-gallery-red">{errors.email.message}</p>}
        <Input type="password" {...field('password')} placeholder="Password" className="mb-2" />
        {errors.password && <p className="mb-4 text-sm font-semibold text-gallery-red">{errors.password.message}</p>}
        <Button type="submit" className="w-full">{loading ? 'Please wait...' : 'Continue'}</Button>
        <Button type="button" variant="secondary" onClick={() => dispatch(googleLogin({ credential: 'google-demo-token' }))} className="mt-3 w-full">
          Continue with Google
        </Button>
      </form>
    </section>
  );
}
