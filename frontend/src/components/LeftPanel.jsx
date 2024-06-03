import React from 'react'
import WidgetContent from './WidgetContent'
import './css/widget.css'
export const LeftPanel = () => {
  return (
    <div className='widget' >
        <div className="widget__header">
     <h5 className='text-success fw-bold text-center'>Coming Soon !!</h5>
          <h5>Space to follow</h5>
        </div>
        <div className="widget__contents">
          <WidgetContent />
        </div>
     </div>
    

  )
}
