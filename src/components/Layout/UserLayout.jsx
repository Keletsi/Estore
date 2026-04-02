/*mport React from 'react'
import Header from '../Common/Header'
import Footer from '../Common/Footer';

const UserLayout = () => {
  return (
    <>
        <Header/>
        <Footer/>
      
    </>
  );
};

export default UserLayout;*/
/*import React from 'react';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet/>
      </main>
      <Footer />
    </>
  );
};

export default UserLayout;*/
import React from 'react';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <>
      <Header />
      <main> {/* ✅ add padding to prevent overlap */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default UserLayout;




