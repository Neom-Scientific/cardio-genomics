import React from 'react'
import Cookies from 'js-cookie';

const Header = () => {
    return (
        <div>
            <header>
                <div className="flex h-20 w-full shrink-0 items-center justify-between px-4 md:px-6 relative">
                    <div className='flex justify-start items-center'>
                        <img src='/logo.png' alt='logo' height={30} width={30} />
                        {/* <span className="ms-3 text-2xl text-transparent bg-clip-text inline-block bg-gradient-to-r from-orange-400 to-blue-600">Cardio Genomics</span> */}
                        <span className="ms-3 text-2xl text-[#ccc] font-bold">Cardio Genomics</span>
                        {/* <span
                            className="ms-3 text-2xl text-orange-500 font-extrabold"
                            style={{
                                textShadow: "0 2px 8px rgba(0,0,0,0.18), 0 1px 0 #fff",
                                background: "rgba(255,255,255,0.25)",
                                borderRadius: "8px",
                                padding: "2px 10px"
                            }}
                        >
                            Cardio Genomics
                        </span> */}
                    </div>
                    <div>
                        <button
                            onClick={() => {
                                Cookies.remove('cardio_genomics_user');
                                window.location.reload();
                            }}
                            className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'>
                            Log Out
                        </button>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header

