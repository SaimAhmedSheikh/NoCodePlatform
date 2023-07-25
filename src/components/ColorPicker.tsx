'use strict'

import React, { useEffect, useState } from 'react'
import { ChromePicker, ColorResult } from 'react-color'


type ColorPickerProps = {
    value: string
    onPickColor: (color: ColorResult) => void
}
const ColorPicker = ({ value, onPickColor }: ColorPickerProps) =>  {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');

  useEffect(() => {
    setSelectedColor(value)
  }, [value]);

  const handleClick = () => {
    setShowPicker(!showPicker)
  };

  const handleClose = () => {
    setShowPicker(false)
  };
  const handleChangeComplete = (color: ColorResult) => {
    setSelectedColor(color.hex)
    onPickColor(color)
  };


    return (
      <div className='relative'>
        <div className={`w-6 h-6 rounded-full bg-black`} style={{ backgroundColor: selectedColor }} onClick={ handleClick }></div>
        { 
        showPicker ? 
        <div style={{ position: "absolute", zIndex: 2 }}>
          <div 
            style={{
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',          
            }} 
            onClick={ handleClose }/>
          <ChromePicker onChangeComplete={handleChangeComplete} color={selectedColor} disableAlpha={false}/>
        </div> : null }
      </div>
    )
}

export default ColorPicker
