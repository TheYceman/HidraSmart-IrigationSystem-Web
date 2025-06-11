import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
 
function RedirectPage() {

  const navigate = useNavigate();
 
  useEffect(() => {

    navigate("/login");

  }, [navigate]);
 
  return null; 

}
 
export default RedirectPage;
 