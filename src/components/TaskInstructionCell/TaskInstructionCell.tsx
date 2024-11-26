import React, { FC, ReactNode } from 'react'
import './TaskInstructionCell.css'

const TaskInstructionCell: FC = () => {
    return (
        <a
            href='https://telegra.ph/Bitget-Wallet--Yescoin-Giveaway-Terms-and-Condiotions-07-20'
            target='_blank'
        >
            <div className='TaskInstructionCell--container'>
                <video
                    loop
                    muted
                    playsInline
                    autoPlay
                    className='TaskInstructionCell--video'
                >
                    <source
                        src={require('../../assets/images/tasks/bitget_task_video.mp4')}
                        type='video/mp4'
                    />
                </video>
            </div>
        </a>
    )
}

export default TaskInstructionCell
