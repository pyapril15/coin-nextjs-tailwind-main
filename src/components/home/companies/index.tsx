'use client'
import React from 'react'
import Image from 'next/image'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import { Companiesdata } from '@/lib/constants'

const Companies = () => {

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  }

  return (
    <section className='border-none -my-2 pt-0'>
      <div className='container'>
        <div>
          <Slider {...settings}>
            {Companiesdata.map((item, i) => (
              <div key={i}>
                <Image
                  src={item.imgSrc}
                  alt={item.imgSrc}
                  width={203}
                  height={101}
                  className='w-auto'
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  )
}

export default Companies
