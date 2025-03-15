import React from 'react'

const Navbar = () => {
    return (
        <div className='w-full absolute top-4  flex justify-center'>
            <ul className='flex flex-row sticky items-center px-12 justify-between border backdrop-blur-lg w-[1200px] border-black rounded-2xl'>
                <div className='flex flex-row items-center gap-x-12 text-xl'>
                    <a href="/"><img src="/postcss.config.png" alt="home logo" className='w-24 h-auto' /></a>
                    <a href="/create"><li className='hover:text-[#D13523]'>CREATE</li></a>
                    <a href="/explore"><li className='hover:text-[#D13523]'>EXPLORE</li></a>
                </div>

                <div className='flex flex-row items-center gap-x-6 text-xl text-black'>
                    <a href=""><li className='border border-black rounded-2xl px-8 py-2  hover:bg-gray-300'>Login</li></a>
                    <a href=""><li className='border border-black rounded-2xl px-8 py-2 hover:bg-gray-300 '>Sign Up</li></a>
                </div>

            </ul>

        </div>
    )
}

export default Navbar