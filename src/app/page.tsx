
import Providers from '@/Providers'
import { redirect } from 'next/navigation'
import { Children } from 'react'

const Home = () => {
  redirect('/login');
}

export default Home