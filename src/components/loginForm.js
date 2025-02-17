"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setUser } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import { triggerNotification } from "@/redux/notificationThunk";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const dispatch = useDispatch();
  const showMessage = (msg, state) => {
    dispatch(
      triggerNotification({
        msg: msg,
        success: state,
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const input = email.toLowerCase();
    setLoading(true);
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Login failed", false);
        throw new Error(data.error || "Login failed");
      }

      // Handle successful login (e.g., store token, user info, redirect user)
      // Set the cookies
      showMessage("Successfully loged in", true);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch(setUser(data.user)); // Store user in Redux
      router.push("/user"); // Redirect to a different page after successful login
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" backdrop-blur-lg bg-[#0000002c] shadow-lg drop-shadow rounded-xl p-8 w-full max-w-[300px] ">
      <div className=" flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="block text-white font-semibold">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email or Phone Number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#9e6e3b]"
            />
          </div>
          <div className="flex flex-col gap-1 relative">
            <label
              htmlFor="password"
              className="block text-white font-semibold"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#9e6e3b] pr-12"
            />
            {password && (
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute right-0 inset-y-0 mt-6 pr-3 flex items-center text-[#9e6e3b]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            )}
          </div>
          <button
            type="submit"
            className={`w-full bg-gradient-to-br hover:bg-gradient-radial from-orange-500 via-orange-500 to-orange-600 text-white font-semibold py-2 rounded`}
          >
            {loading ? <p className="animate-bounce">. . .</p> : <p>Login</p>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
