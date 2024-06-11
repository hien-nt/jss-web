import React from 'react'
import { Button, Result } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
function Unauthorized() {
    const navigate = useNavigate();
    const location = useLocation();
  
    const handleBack = () => {
      // Check if the 'from' state exists
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        // Navigate to a default route if no state is found
        navigate('/');
      }
    };
  
    
  return (
    <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={<Button type="primary" onClick={handleBack}>Back Home</Button>}
  />
  )
}

export default Unauthorized