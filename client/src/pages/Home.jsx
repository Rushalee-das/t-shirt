import {motion, AnimatePresence}  from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store';
import {headContainerAnimation , headContentAnimation, headTextAnimation, slideAnimation} from '../config/motion';

import React from 'react'
import { CustomButton } from '../components';

const Home = () => {
    const snap = useSnapshot(state);
    
  return (
    <AnimatePresence>
        {snap.intro && (
            <motion.section className='home p-0' {...slideAnimation('left')}>
                <motion.header {...slideAnimation('down')}>
                    <img src='./Home-logo.png'
                        alt='logo'
                        className='w-20 h-20 object-contain home-logo' />
                </motion.header>
                <motion.div {...headTextAnimation}>
                    <h1 className='head-text'>LET'S <br className="xl:block hidden" />DO IT</h1>
                </motion.div>
                <motion.div {...headContentAnimation} className='flex flex-col gap-5'>
                    <p className='max-w-md font-normal text-black-600 text-base'>
                        Create your unique and creative shirt with our brand-new 3D customization tool.
                        <strong>unleash your imagination</strong> {" "} and define your own style.
                    </p>
                </motion.div>
                <div className="button-container">
                    <CustomButton 
                        type="filled"
                        title="Customize It"
                        handleClick={() => state.intro = false}
                        customStyles="px-4 py-2 font-bold text-sm"
                    />
                </div>

            </motion.section>
        )}
    </AnimatePresence>
  )
}

export default Home