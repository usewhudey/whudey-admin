'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLoginMutation } from '@/features/auth/authApi';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'; // 🎯 NEW: Add Mail and Lock icons
import { ApiError } from '@/types/api';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'), // 🎯 Sharper error message
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();
      // 🎯 Better success message
      success('Login Successful!!');

      if (result.user) {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const errorPayload = err as ApiError;
      const errorMessage = errorPayload?.data?.message || 'Failed to login!!.';
      error(errorMessage);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 ">
      <div className="text-center mb-8"></div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <Label htmlFor="email" className="flex items-center gap-2 mb-1">
            <Mail size={16} className="text-primary" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            // 🎯 Use tailwind classes for focus/error ring
            className={`h-11 ${errors.email ? 'ring-2 ring-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password" className="flex items-center gap-2 mb-1">
            <Lock size={16} className="text-primary" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              // 🎯 Use tailwind classes for focus/error ring
              className={`h-11 ${errors.password ? 'ring-2 ring-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 text-lg   font-semibold"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="sm" /> : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}
