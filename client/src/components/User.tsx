import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import Auth from "../utils/auth";
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

export interface ActiveUser {
  _id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
}

export const useUser = (): ActiveUser => {
  const location = useLocation();
  const isLoggedIn = Auth.loggedIn();
  const { data, refetch } = useQuery<MeData>(QUERY_ME, {
    skip: !isLoggedIn,
  });

  useEffect(() => {
    if (isLoggedIn) {
      refetch();
    }
  }, [isLoggedIn, location.pathname, refetch]);

  return data?.Me ?? {};
};
