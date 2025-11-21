"use client";

import React from 'react';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { useRouter } from 'next/navigation';
import './BarTool.css';
type Props = {
    onToggleSidebar: () => void;
    userName?: string;
  };

const BarTool:  React.FC<Props> = ({ onToggleSidebar, userName }) => {

    const router = useRouter();

    const leftContents = (
        <React.Fragment>
           <Button icon="pi pi-bars" severity="success" onClick={onToggleSidebar} />
        </React.Fragment>
    );

  
    const rightContents = (
        <React.Fragment>
            <p className='mx-9'><span className="pi pi-user"></span> {userName}</p>
            <Button label="Loggout" severity='success' icon="pi pi-arrow-circle-right" onClick={()=>{localStorage.removeItem("user");localStorage.removeItem("fullName");localStorage.removeItem("email");localStorage.removeItem("roles"); router.push('/login')}}/>
        </React.Fragment>
    );

    return (
        <Toolbar  right={rightContents} left={leftContents}/>
    );
};

export default BarTool;