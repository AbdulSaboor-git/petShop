"use client";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "../redux/store";
import Notification from "@/components/notification";
import { initMessageHook } from "@/hooks/useMessage";

function MessageInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    initMessageHook(dispatch);
  }, [dispatch]);

  return null;
}

const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <MessageInitializer />
      {children}
      <Notification />
    </Provider>
  );
};

export default ReduxProvider;
