import HeaderBox from '@/components/HeaderBox';
import React from 'react'

const Home = () => {
  const loggedIn = { firstName: 'Adriana' };
  return (
    <section className='home'>
      <div className="home-content">
        <div className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Access and manage your account"
          />
          Welcome, Naufaldi
        </div>
      </div>
    </section>
  )
}

export default Home