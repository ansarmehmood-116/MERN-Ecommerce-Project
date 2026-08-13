import React from 'react'
import{Link} from 'react-router-dom';

const Footer = () => {
  return (
    // <div className='bg-dark text-light p-3'> this is bootstrap class we have added 
      <div className='footer'>
      {/* p-3 for padding */}
      <h4 className='text-center'>All Rights Reserved &copy; AnserTec</h4>
      <p className="text-center m-3">
        {/* m-3 used for margin all */}
        <Link to='/about'>About</Link>
        |
        <Link to='/contact'>Contact</Link>
        |
        <Link to='/policy'>Privacy Policy</Link>
      </p>
      {/* here we have used Link property of react-router-dom this this is because of the
      reasons below: Link is primarily used for navigation purposes in React Router. It doesn't
      come with any built-in styling features we also can call this anchor <tag> and select
      it with selector a in css. 
      while On the other hand, NavLink not only facilitates navigation but also provides 
      additional features like styling based on whether the link matches the current route. 
      This is achieved through the addition of an active class to the link when it corresponds 
      to the active route, allowing you to apply specific styles to the active link. 
      So, NavLink offers both navigation functionality and the ability to style active links,
      making it a convenient choice when you need to create styled navigation menus.That's 
      why With NavLink, you don't need to manually add classes to apply styling. React Router
      automatically adds an active class to the NavLink component when it matches the current 
      URL. This makes it easier to style the active link using CSS, as you can simply target
      the active class to apply the desired styles. So, you can focus on defining your styling 
      rules in CSS, and React Router takes care of applying the active class as needed based on
      the current route.*/}
    </div>
  )
}

export default Footer
// now we will wrap our app.js and all pages to be created in Layout we will import layout
// in that pages