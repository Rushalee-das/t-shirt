import React, { useState } from 'react'
import { AnimatePresence , motion} from 'framer-motion';
import { useSnapshot } from 'valtio';
import { useTexture } from '@react-three/drei';

import config from '../config/config';
import state  from '../store';
import {download } from '../assets';
import {downloadCanvasToImage, reader} from '../config/helpers';
import {EditorTabs, FilterTabs, DecalTypes} from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, FilePicker,Tab, CustomButton } from '../components';

const Customizer = () => {
  const snap = useSnapshot(state);

  //show tab content
  const [file, setFile] = useState('')
  const [prompt , setPrompt] = useState('')
  const [generatingImg, setGeneratingImg] = useState(false)

  const [activeEditorTab, setActiveEditorTab] = useState('')
  const [ activeFilterTab, setActiveFilterTab] = useState({
      logoShirt : true,
      stylishShirt : false
  })

  //show tab content depending on the active tab
  const generateTabContent =() => {
    switch(activeEditorTab){
      case 'colorpicker' :
        return <ColorPicker />
      case 'filepicker' :
        return <FilePicker 
          file={file}
          setFile={setFile}
          readFile = {readFile}
        />
      case 'aipicker' :
        return <AIPicker 
        prompt={prompt}
        setPrompt={setPrompt}
        generatingImg={generatingImg}
        setGeneratingImg={setGeneratingImg} // Make sure this prop is passed
        handleSubmit={handleSubmit}
      />
      
      default :
          return null;
    }
  }

  const handleSubmit = async (type) => {
    if (!prompt) {
      alert('Please enter the prompt');
      return;
    }
  
    console.log('Prompt:', prompt); // Log the prompt
  
    setGeneratingImg(true);
    try {
      const response = await fetch('http://localhost:5000/openai/generateimage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }), // Add this line
      });
  
      if (!response.ok) {
        throw new Error('Error generating image');
      }
  
      const data = await response.json();
      console.log('Generated image URL:', data.data);
      handleDecals(type, `data:image/png;base64,${data.photo}`)
      // handleDecals(type, data.photoUrl);
    } 
    catch (error) {
      console.error('Error:', error);
      // Handle the error
    } finally {
      setGeneratingImg(false);
    }
  };
  
  
  // const handleSubmit = async () => {
  //   const promptData = {
  //     prompt: "Your prompt here",
  //   };
  
  //   try {
  //     const response = await fetch('http://localhost:5000/openai/generateimage', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(promptData),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Error generating image');
  //     }
  
  //     const data = await response.json();
  //     console.log('Generated image URL:', data.data);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     // Handle the error
  //   }
  // };
  
  

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch(tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName]
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName]
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
    }

    //after setting the state we need to se the active filter tab to update it
    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName] : !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
    .then((result) => {
      handleDecals(type, result)
      setActiveEditorTab('')
    })
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div className='flex absolute top-1/2 transform -translate-y-1/2 left-0'>
              <div className='editortabs-container tabs'>
                {EditorTabs.map((tab) => (
                  <Tab 
                    key={tab.name}
                    tab={tab}
                    handleClick= {() => setActiveEditorTab(tab.name)}  
                    />
                ))}
                {generateTabContent()}
              </div>
          </motion.div>
          <motion.div className='absolute z-10 top-5 right-5' {...slideAnimation}>
            <CustomButton 
              type="filled"
              title="Go Back"
              handleClick={() => state.intro = true}
              customStyles= "w-fit px-4 py2.5 font-bold text-sm" />
          </motion.div>
          <motion.div className='filtertabs-container' {...slideAnimation('up')}>
            {FilterTabs.map((tab) => (
              <Tab 
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer