'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { contactSchema } from '@/lib/validations/auth'
import { submitContactForm } from '@/app/actions/contactActions'

type ContactFormValues = z.infer<typeof contactSchema>

const ContactForm = () => {
  const [showThanks, setShowThanks] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
  })

  const onSubmit = async (data: ContactFormValues) => {
    const result = await submitContactForm(data)

    if (result.success) {
      setShowThanks(true)
      reset()
      setTimeout(() => setShowThanks(false), 5000)
    }
  }

  return (
    <section id='contact' className='scroll-mt-14'>
      <div className='container'>
        <div className='relative'>
          <h2 className='mb-9 capitalize'>Get in Touch</h2>
          <div className='relative border border-lightblue/35 px-6 py-2 rounded-2xl'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-wrap w-full m-auto justify-between'>
              <div className='sm:flex gap-6 w-full'>
                <div className='mx-0 my-2.5 flex-1'>
                  <label htmlFor='fname' className='pb-3 inline-block text-base text-lightpurple'>
                    First Name
                  </label>
                  <input
                    id='fname'
                    type='text'
                    placeholder='John'
                    className={`w-full text-base px-4 rounded-2xl py-2.5 border transition-all duration-500 focus:outline-0 placeholder:text-lightsky/40 text-white
                      ${errors.firstname ? 'border-red-500 focus:border-red-500' : 'border-lightblue/35 focus:border-primary'}
                    `}
                    {...register('firstname')}
                  />
                  {errors.firstname && <p className='text-red-500 text-sm mt-1'>{errors.firstname.message}</p>}
                </div>
                <div className='mx-0 my-2.5 flex-1'>
                  <label htmlFor='lname' className='pb-3 inline-block text-base text-lightpurple'>
                    Last Name
                  </label>
                  <input
                    id='lname'
                    type='text'
                    placeholder='Doe'
                    className={`w-full text-base px-4 rounded-2xl py-2.5 border transition-all duration-500 focus:outline-0 placeholder:text-lightsky/40 text-white
                      ${errors.lastname ? 'border-red-500 focus:border-red-500' : 'border-lightblue/35 focus:border-primary'}
                    `}
                    {...register('lastname')}
                  />
                  {errors.lastname && <p className='text-red-500 text-sm mt-1'>{errors.lastname.message}</p>}
                </div>
              </div>
              <div className='sm:flex gap-6 w-full'>
                <div className='mx-0 my-2.5 flex-1'>
                  <label htmlFor='email' className='pb-3 inline-block text-base text-lightpurple'>
                    Email Address
                  </label>
                  <input
                    id='email'
                    type='email'
                    placeholder='john.doe@example.com'
                    className={`w-full text-base px-4 rounded-2xl py-2.5 border transition-all duration-500 focus:outline-0 placeholder:text-lightsky/40 text-white
                      ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-lightblue/35 focus:border-primary'}
                    `}
                    {...register('email')}
                  />
                  {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
                </div>
                <div className='mx-0 my-2.5 flex-1'>
                  <label htmlFor='Phnumber' className='pb-3 inline-block text-base text-lightpurple'>
                    Phone Number
                  </label>
                  <input
                    id='Phnumber'
                    type='tel'
                    placeholder='+1234567890'
                    className={`w-full text-base px-4 rounded-2xl py-2.5 border transition-all duration-500 focus:outline-0 placeholder:text-lightsky/40 text-white
                      ${errors.phnumber ? 'border-red-500 focus:border-red-500' : 'border-lightblue/35 focus:border-primary'}
                    `}
                    {...register('phnumber')}
                  />
                  {errors.phnumber && <p className='text-red-500 text-sm mt-1'>{errors.phnumber.message}</p>}
                </div>
              </div>
              <div className='w-full mx-0 my-2.5 flex-1'>
                <label htmlFor='message' className='text-base inline-block text-lightpurple'>
                  Message
                </label>
                <textarea
                  id='message'
                  placeholder='Anything else you wanna communicate'
                  className={`w-full mt-2 rounded-2xl px-5 py-3 border transition-all duration-500 focus:outline-0 placeholder:text-lightsky/40 text-white
                    ${errors.Message ? 'border-red-500 focus:border-red-500' : 'border-lightblue/35 focus:border-primary'}
                  `}
                  {...register('Message')}
                ></textarea>
                {errors.Message && <p className='text-red-500 text-sm mt-1'>{errors.Message.message}</p>}
              </div>
              <div className='mx-0 my-2.5 w-full'>
                <button
                  type='submit'
                  disabled={!isValid || isSubmitting}
                  className={`border leading-none px-6 text-lg font-medium py-4 rounded-full 
                    ${
                      !isValid || isSubmitting
                        ? 'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary border-primary text-white hover:bg-transparent hover:text-primary cursor-pointer'
                    }`}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
          {showThanks && (
            <div className='text-white bg-primary rounded-full px-4 text-lg mb-4.5 mt-1 absolute flex items-center gap-2'>
              Thank you for contacting us! We will get back to you soon.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ContactForm
