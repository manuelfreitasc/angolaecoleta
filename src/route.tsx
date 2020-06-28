import React from 'react'
import { Route,BrowserRouter } from 'react-router-dom'
import Home from './peges/Home'
import Points from './peges/points'

const Routes=()=>{
    return(
        <BrowserRouter>
            <Route component={Home} path="/" exact />
            <Route component={Points}  path="/points" />
        </BrowserRouter>
    )
}

export default Routes