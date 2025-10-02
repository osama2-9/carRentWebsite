import React from "react";
import { useAuth } from "../store/auth";

export const PermessionChcker = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  if (user?.role == "ADMIN") {
    return <>{children}</>;
  } else {
    return <p className=" font-bold m-2">Unauthorized</p>;
  }
};
