import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Container from '../components/Container'
import cn from 'classnames'

const Home: NextPage = () => {
  return (
    <Container>
      <div className="flex flex-col justify-center items-start max-w-2xl border-gray-200 dark:border-gray-700 mx-auto pb-16">
        <div className="flex flex-col-reverse sm:flex-row items-start">
          <div className="flex flex-col pr-8">
            <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-1 text-black dark:text-white">
              Ashraf Ali
            </h1>
            <h2 className="text-gray-700 dark:text-gray-200 mb-4">
              Studying @ {' '}
              <span className="font-semibold"><a href="https://www.ucd.ie/">UCD</a></span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-16">
              CS student at University College Dublin.
              Busy learning about graphs, running UCD Netsoc & developing a music taste. <br />
              Previously interned at <span className="font-semibold"><a href="https://stripe.com/en-ie">Stripe</a></span>.
            </p>
          </div>
          <div className="w-[180px] sm:w-[400px] relative mb-8 sm:mb-0 mr-auto ">
            <div className=" rounded-full w-full bg-gradient-to-r p-1 from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]">
              <div className="flex flex-col justify-between h-full bg-gray-200 dark:bg-gray-900 rounded-full p-1">
                <Image
                  alt="Ash Ali"
                  height={400}
                  width={400}
                  src="/me.jpg"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Home
