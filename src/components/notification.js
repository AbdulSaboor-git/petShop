"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Notification() {
  const { msg, success, isVisible } = useSelector(
    (state) => state.notification
  );
  // 'show' determines if the notification is rendered
  const [show, setShow] = useState(false);
  // 'animationClass' will control our slide-in/slide-out animations
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    let hideTimer;
    let removeTimer;

    if (isVisible) {
      // When triggered visible, show the notification and animate slide down
      setShow(true);
      setAnimationClass("animate-slideDown");

      // After 4 seconds, trigger the slide-up animation (exit)
      hideTimer = setTimeout(() => {
        setAnimationClass("animate-slideUp");
        // After the animation duration (300ms), remove the notification from DOM
        removeTimer = setTimeout(() => {
          setShow(false);
        }, 300);
      }, 4000);
    } else {
      // If isVisible is set to false externally, animate exit if it's currently shown
      if (show) {
        setAnimationClass("animate-slideUp");
        removeTimer = setTimeout(() => {
          setShow(false);
        }, 300);
      }
    }

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [isVisible]);

  if (!show) return null;

  return (
    <div className="flex w-full justify-center pointer-events-none">
      <div
        className={`fixed z-[200] top-4 p-1 px-5 mx-10 bg-white text-sm rounded-full ${
          success ? "text-[#008514]" : "text-[#cb0000]"
        } ${animationClass}`}
        style={
          success
            ? { boxShadow: "0px 0px 10px 1px green", border: "1px solid green" }
            : {
                boxShadow: "0px 0px 10px 1px #ff2a2a",
                border: "1px solid #ff2a2a",
              }
        }
      >
        {msg}
      </div>
    </div>
  );
}
