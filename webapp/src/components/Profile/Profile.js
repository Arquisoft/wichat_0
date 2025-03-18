import React from 'react';

import { useNavigate } from 'react-router';
import LargeButton from '../ReactComponents/LargeButton';
import CustomH1 from '../ReactComponents/CustomH1';

const Profile = () => {

  const navigate = useNavigate();
  
  const exitProfile = () => {
    navigate('/home');
  }

  return (
    <div>
          <CustomH1>
           AAAAAAAAAAAA
          </CustomH1>
          <LargeButton onClick={exitProfile}>
            Salir
          </LargeButton>
    </div>
  );
};

export default Profile;