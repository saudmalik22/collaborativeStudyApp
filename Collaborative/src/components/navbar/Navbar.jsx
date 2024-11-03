import { useState } from "react";
import img from "../../assets/react.svg"
import {useDispatch, useSelector} from "react-redux";
import {Logout} from "../../store/slices/authSlice.js";
export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const user =useSelector(store=> store.authSlice.user);
    const handleLogout=()=>{
        console.log("logout button is clicked");
        dispatch(Logout())
    }
    return (
        <nav className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="text-white font-bold text-2xl">
                    <a href="/">CollaborativeStudy</a>
                </div>

                {/* Search Bar (Visible on md and up) */}
                <div className=" md:flex relative text-gray-600">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-white h-10 px-4 pr-10 rounded-full text-sm focus:outline-none shadow-sm"
                    />
                    <button type="submit" className="absolute right-0 top-0 mt-2 mr-3">
                        <svg className="h-4 w-4 text-gray-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M10 2a8 8 0 016.32 12.906l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z" />
                        </svg>
                    </button>
                </div>

                {/* Desktop Links */}
                <div className=" md:flex items-center space-x-8 text-white font-semibold">
                    <a href="#home" className="hover:text-gray-200 transition duration-200">Home</a>
                    <a href="#about" className="hover:text-gray-200 transition duration-200">About</a>
                    <a href="#services" className="hover:text-gray-200 transition duration-200">Services</a>
                    <a href="#contact" className="hover:text-gray-200 transition duration-200">Contact</a>
                </div>



                {/* Profile and Logout (Visible on md and up) */}
                <div className=" md:flex items-center space-x-4 text-white">
                    <a href="/profile"
                       className="flex items-center space-x-2 hover:bg-blue-700 transition duration-200 px-4 py-2 rounded">
                        <img src={user.profileImageUrl} alt="Profile" className="h-10 w-10 rounded-full"/>

                    </a>
                    <button onClick={handleLogout} className="hover:bg-blue-700 bg-blue-500 transition duration-200 px-4 py-2 rounded-full ">Logout</button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        console.log(isOpen); // Check state change
                    }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Links */}
            {isOpen && (
                <div className="md:hidden mt-2 space-y-2 text-white font-semibold">
                    <a href="#home" className="block px-4 py-2 hover:bg-blue-700 rounded transition duration-200">Home</a>
                    <a href="#about" className="block px-4 py-2 hover:bg-blue-700 rounded transition duration-200">About</a>
                    <a href="#services" className="block px-4 py-2 hover:bg-blue-700 rounded transition duration-200">Services</a>
                    <a href="#contact" className="block px-4 py-2 hover:bg-blue-700 rounded transition duration-200">Contact</a>

                    {/* Mobile Search Bar */}
                    <div className="px-4 py-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-white h-10 px-4 w-full rounded-full text-sm focus:outline-none shadow-sm"
                        />
                    </div>

                    {/* Profile and Logout for Mobile */}
                    <div className="flex flex-col px-4 space-y-2">
                        <button className="w-full text-left hover:bg-blue-700 rounded transition duration-200 px-4 py-2">Profile</button>
                        <button className="w-full text-left hover:bg-blue-700 rounded transition duration-200 px-4 py-2">Logout</button>
                    </div>
                </div>
            )}
        </nav>
    );
};
