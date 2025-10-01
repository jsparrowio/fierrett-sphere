// import { useState } from 'react';
import { useLocation } from "react-router-dom";
import Auth from "../utils/auth";
import { useEffect, useLayoutEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { QUERY_ME } from "../utils/queries";

interface MeData {
  Me: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  };
}

interface ActiveData {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
}

export const User: React.FC = () => {
  const { loading, data, refetch } = useQuery<MeData>(QUERY_ME);
  const activeUser = data?.Me || {} as ActiveData;
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(true);


  
  useEffect(() => {
    refetch();
  }, []);

  useLayoutEffect(() => {
    setReload(true);
    refetch();
    const loggedIn = Auth.loggedIn();
    if (loggedIn === true) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setReload(false);
  }, [location]);

  return (
    <>
          {isLoggedIn && loading === false && reload === false && (
            <div
              className="user"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginRight: "15px"
              }}
            >
              <h2
                style={{
                  fontSize: "1rem",
                  color: "#FFFFFF",
                  marginLeft: "1rem"
                }}
              >
                Welcome, {activeUser.first_name}!
              </h2>
            </div>
          ) }
    </>
  );
};
