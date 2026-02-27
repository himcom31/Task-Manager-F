import React, { useState } from "react"
import AuthLayout from "../../components/AuthLayout"
import { FaEyeSlash, FaPeopleGroup } from "react-icons/fa6"
import { FaEye } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { validateEmail } from "../../utils/helper"
import axiosInstance from "../../utils/axioInstance"
import { useDispatch, useSelector } from "react-redux"
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/slice/userSlice"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)

  const { loading } = useSelector((state) => state.user)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!password) {
      setError("Please enter the password")
      return
    }

    setError(null)

    // Login API call
    try {
      dispatch(signInStart())

      const response = await axiosInstance.post(
        "/auth/sign-in",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      )

      // console.log(response.data)

      if (response.data.role === "admin") {
        dispatch(signInSuccess(response.data))
        navigate("/admin/dashboard")
      } else {
        dispatch(signInSuccess(response.data))
        navigate("/user/dashboard")
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
        dispatch(signInFailure(error.response.data.message))
      } else {
        setError("Something went wrong. Please try again!")
        dispatch(signInFailure("Something went wrong. Please try again!"))
      }
    }
  }

  return (
    <AuthLayout>
   <div className="w-full max-w-md mx-auto">
  <div className="relative rounded-2xl overflow-hidden 
  bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)]
  border border-white/40 transition-all duration-500 hover:shadow-[0_25px_70px_rgba(0,0,0,0.2)]">

    {/* Gradient Glow Background */}
    <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-400 opacity-20 blur-3xl rounded-full"></div>

    {/* Gradient top line */}
    <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400"></div>

    <div className="relative p-10">

      {/* LOGO + TITLE */}
      <div className="text-center mb-10">

        <div className="flex justify-center">
          <div className="
          bg-gradient-to-r from-indigo-500 to-blue-500
          p-4 rounded-2xl shadow-lg
          hover:scale-110 transition duration-300">
            <FaPeopleGroup className="text-4xl text-white" />
          </div>
        </div>

        <h1 className="
        text-3xl font-extrabold mt-6
        bg-gradient-to-r from-indigo-600 to-blue-500
        bg-clip-text text-transparent tracking-wide">
          Project Flow
        </h1>

        <p className="text-gray-500 mt-2 text-sm">
          Manage your projects efficiently 🚀
        </p>
      </div>

      {/* LOGIN FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* EMAIL */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="
            w-full mt-2 px-4 py-3 rounded-xl
            bg-gray-50 border border-gray-200
            focus:ring-2 focus:ring-indigo-400
            focus:bg-white transition-all duration-300 outline-none"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Password
          </label>

          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="
              w-full px-4 py-3 rounded-xl
              bg-gray-50 border border-gray-200
              focus:ring-2 focus:ring-indigo-400
              focus:bg-white transition-all duration-300 outline-none pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-indigo-600 transition"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">
            {error}
          </p>
        )}

        {/* BUTTON */}
        {loading ? (
          <div className="w-full py-3 text-center rounded-xl 
          bg-gradient-to-r from-indigo-500 to-blue-500 text-white animate-pulse">
            Loading...
          </div>
        ) : (
          <button
            type="submit"
            className="
            w-full py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-indigo-600 to-blue-500
            hover:from-indigo-700 hover:to-blue-600
            shadow-lg hover:shadow-xl
            transition-all duration-300 hover:scale-[1.02]">
            LOGIN
          </button>
        )}
      </form>

      {/* SIGNUP LINK */}
      <div className="mt-8 text-center text-sm">
        <p className="text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-500 transition">
            Sign up
          </Link>
        </p>
      </div>

    </div>
  </div>
</div>
    </AuthLayout>
  )
}

export default Login
