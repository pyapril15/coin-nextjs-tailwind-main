'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { signUpSchema } from '@/lib/validations/auth'
import { registerUser } from '@/app/actions/authActions'
import SocialSignUp from '../SocialSignUp'
import Logo from '../../layout/header/logo'

type SignUpValues = z.infer<typeof signUpSchema>

const SignUp = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpValues) => {
    setErrorMsg('')
    setSuccessMsg('')
    const result = await registerUser(data)

    if (!result.success) {
      setErrorMsg(result.message || 'An error occurred')
    } else {
      setSuccessMsg(result.message || 'Success!')
    }
  }

  return (
    <>
      <div className='mb-10 text-center mx-auto inline-block max-w-[160px]'>
        <Logo />
      </div>

      <SocialSignUp />

      <span className='my-8 flex items-center justify-center text-center'>
        <span className='flex-grow border-t border-white/20'></span>
        <span className='mx-4 text-base text-white'>OR</span>
        <span className='flex-grow border-t border-white/20'></span>
      </span>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 mb-4 py-2 px-4 rounded-md text-sm">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 mb-4 py-2 px-4 rounded-md text-sm">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-[22px]'>
          <input
            {...register('name')}
            type='text'
            placeholder='Name'
            className={`w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base outline-hidden transition placeholder:text-grey text-white
              ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-primary'}`}
          />
          {errors.name && <p className="text-red-500 text-left text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div className='mb-[22px]'>
          <input
            {...register('email')}
            type='email'
            placeholder='Email'
            className={`w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base outline-hidden transition placeholder:text-grey text-white
              ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-primary'}`}
          />
          {errors.email && <p className="text-red-500 text-left text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className='mb-[22px]'>
          <input
            {...register('password')}
            type='password'
            placeholder='Password'
            className={`w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base outline-hidden transition placeholder:text-grey text-white
              ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-primary'}`}
          />
          {errors.password && <p className="text-red-500 text-left text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div className='mb-9 mt-4'>
          <button
            type='submit'
            disabled={isSubmitting}
            className={`flex w-full items-center text-lg text-white font-medium justify-center rounded-md border transition duration-300 ease-in-out
              ${isSubmitting ? 'bg-gray-500 border-gray-500 cursor-not-allowed' : 'bg-primary border-primary hover:bg-transparent hover:text-primary cursor-pointer'}
            `}>
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </form>

      <p className='text-body-secondary mb-4 text-white text-base'>
        By creating an account you are agree with our{' '}
        <a href='/#' className='text-primary hover:underline'>
          Privacy
        </a>{' '}
        and{' '}
        <a href='/#' className='text-primary hover:underline'>
          Policy
        </a>
      </p>

      <p className='text-body-secondary text-white text-base'>
        Already have an account?
        <Link href='/' className='pl-2 text-primary hover:underline'>
          Sign In
        </Link>
      </p>
    </>
  )
}

export default SignUp
