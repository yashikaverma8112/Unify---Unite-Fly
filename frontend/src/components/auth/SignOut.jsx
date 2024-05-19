import React from 'react';
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const SignOut = () => {
    const [cookies, setCookie] = useCookies(['token']);

    useEffect(() => {
        let expires = new Date()
        setCookie('token', '', { path: '/',  expires})
      }, []);

    return(
        <>
            <h3>SignOut</h3>
            User SignOut successfully.
        </>
    )
}

export default SignOut;