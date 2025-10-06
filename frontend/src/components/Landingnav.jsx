import React from 'react';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/images/fixion-log.svg'
import Modal from './Modal';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
    <nav className= "bg-white shadow-md py-16 px-2 md:px-10 ">
      <div className= "max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
         <img src={logo} alt="Fixion Logo" className="h-8 w-auto" />
        </Link>
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/about" className="text-sm text-blue-900 hover:text-blue-600 font-medium">ABOUT</Link>
          <Link to="/categories" className="text-sm text-blue-900 hover:text-blue-600 font-medium">CATEGORIES</Link>
          <Link to="/artisans" className="text-sm text-blue-900 hover:text-blue-600 font-medium">ARTISANS</Link>
          <Link to="/contact" className="text-sm text-blue-900 hover:text-blue-600 font-medium">CONTACT US</Link>

          <Link to="/login" className="border border-blue-900 text-blue-900 px-4 py-1 rounded hover:bg-blue-50 transition">LOG IN</Link>

          <button
              onClick={() => setShowModal(true)}
              className="bg-blue-900 text-white px-4 py-1 rounded hover:bg-blue-800 transition"
            >
              SIGN UP
            </button>
          {/* <Link to="/signup" className="bg-blue-900 text-white px-4 py-1 rounded hover:bg-blue-800 transition">SIGN UP</Link> */}
        </div>
        <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link to="/about" className="block text-blue-900 hover:text-blue-600">ABOUT</Link>
          <Link to="/categories" className="block text-blue-900 hover:text-blue-600">CATEGORIES</Link>
          <Link to="/artisans" className="block text-blue-900 hover:text-blue-600">ARTISANS</Link>
          <Link to="/contact" className="block text-blue-900 hover:text-blue-600">CONTACT US</Link>
          <Link to="/login" className="block border border-blue-900 text-blue-900 px-4 py-2 rounded">LOG IN</Link>
          <button
              onClick={() => setShowModal(true)}
              className="block w-full bg-blue-900 text-white px-4 py-2 rounded"
            >
              SIGN UP
            </button>
          {/* <Link to="/signup" className="block bg-blue-900 text-white px-4 py-2 rounded">SIGN UP</Link> */}
        </div>
      )}
    </nav>
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
  </>
  )
}

export default Navbar