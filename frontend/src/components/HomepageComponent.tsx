import React from 'react';
import NavBar from './Layout/NavBar';
import UserComponent from './User/UserComponent';

function HomepageComponent() {
    return (
        <div className='w-full mx-auto bg-white'>
            <NavBar/>
            <UserComponent />
        </div>
    );
}

export default HomepageComponent;
