import React from 'react'
import './css/sidebarOptions.css'
import { AcUnitOutlined, Add, BuildOutlined, EventAvailable, School } from '@material-ui/icons'
export const RightPanel = () => {
  return (
    <div className="sidebarOptions">
    <div className="sidebarOption">
        
        <p className='text-success'>Coming Soon !!</p>
    </div>
    <div className="sidebarOption">
        <School />
        <p>Academics</p>
    </div>
    <div className="sidebarOption">
        <BuildOutlined />
        <p>Projects</p>
    </div>
    <div className="sidebarOption">
        <EventAvailable />
        <p>Events</p>
    </div>
    <div className="sidebarOption">
        <AcUnitOutlined />
        <p>Other</p>
    </div>
    <div className="sidebarOption">
        <Add />
        <p className='text'>Discover Theme</p>
    </div>
</div>
  )
}
