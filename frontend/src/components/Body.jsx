import React from 'react'
import Feed from './Feed'
import { LeftPanel } from './LeftPanel'
import { RightPanel } from './RightPanel'
import Header from './Header'

export const Body = () => {
    return (
        <div className='container '>

            <div className='container d-flex justify-content-between align-items-stretch'>
                <div style={{ marginTop: "112px"}} className='d-none d-md-block'>
                    <LeftPanel />
                </div>
                <div style={{ marginTop: "92px"}} className='align-items-center'>
                    <Feed />
                </div>
                <div style={{ marginTop: "112px" }} className='d-none d-md-block'>
                    <RightPanel />
                </div>
            </div>
        </div>
    )
}
