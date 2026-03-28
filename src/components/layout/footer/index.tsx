import Link from 'next/link'
import Image from 'next/image'
import { Footerlinkdata, Sociallinkdata } from '@/lib/constants'

const Footer = () => {

  return (
    <footer className='bg-body-bg relative pt-10'>
      <div className='bg-linear-to-r from-primary to-secondary hidden lg:block absolute w-full h-full top-0 -left-1/2 blur-390'></div>
      <div className='container relative z-10 pb-16'>
        <div className='grid grid-cols-1 gap-y-10 md:gap-x-16 sm:grid-cols-2 lg:grid-cols-12 xl:gap-x-8'>
          <div className='lg:col-span-6 sm:col-span-2'>
            <img
              className='block h-12 w-20px mb-4'
              src={'/images/logo/logo.svg'}
              alt='Crypto-Logo'
            />
            <p className='text-white/60 text-sm font-normal max-w-96 leading-7 mb-7'>
              {' '}
              Cryptocurrency is a type of virtual currency that uses
              cryptography to secure transactions that are digitally recorded on
              a distributed ledger, such as a blockchain.
            </p>
            <div className='flex gap-4'>
              {Sociallinkdata.map((items, i) => (
                <Link href={items.href} key={i}>
                  <img
                    src={items.imgsrc}
                    alt={items.imgsrc}
                    className='hover:opacity-70'
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className='group relative lg:col-span-2'>
            <p className='text-white text-xl font-medium mb-9'>Useful Links</p>
            <ul>
              {Footerlinkdata.map((product, i) => (
                <li key={i} className='mb-5'>
                  <Link
                    href={product.href}
                    className='text-white/60 text-sm font-normal mb-6 space-links hover:text-primary'>
                    {product.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className='lg:col-span-4'>
            <p className='text-white text-xl font-medium mb-9'>Contact Us</p>
            <Link
              href={'tel:+917290955962'}
              className='text-white/60 hover:text-primary text-sm font-normal mb-6 flex gap-2 w-fit'>
              <Image
                src={'/images/footer/number.svg'}
                alt='number-icon'
                width={20}
                height={20}
              />
              7290955962
            </Link>
            <Link
              href={'mailto:praveen885127@gmail.com'}
              className='text-white/60 hover:text-primary text-sm font-normal mb-6 flex gap-2 w-fit'>
              <Image
                src={'/images/footer/email.svg'}
                alt='email-icon'
                width={20}
                height={20}
              />
              praveen885127@gmail.com
            </Link>
            <div className='text-white/60 text-sm font-normal mb-6 flex gap-2'>
              <Image
                src={'/images/footer/address.svg'}
                alt='address-icon'
                width={20}
                height={20}
              />
              buddha nagar colony sarnath varanasi up.
            </div>
          </div>
        </div>
      </div>
      <div className='py-8 px-4 border-t border-t-lightblue'>
        <p className='text-center text-white'>
          @2026 - All Rights Reserved by{' '}
          <Link
            href='https://github.com/pyapril15'
            target='_blank'
            className='hover:text-primary'>
            {' '}
            Praveen Yadav
          </Link>
        </p>
      </div>
    </footer>
  )
}

export default Footer
