import { useRef } from 'react'
import useAuthStore from "../utils/appStore"
import { Link, useNavigate } from 'react-router-dom'


function Login() {

const nav = useNavigate()
const { loginUser } = useAuthStore()
const emailRef = useRef(null)
const passwordRef = useRef(null)
var emailValue, passwordValue


const handleSubmit = async (e) => {
    e.preventDefault()
    try{
        await loginUser(emailValue, passwordValue)
        nav('/')
    } catch (err){
        console.err(err)
    }
}


  return (
    <div className="w-screen h-screen bg-bg-image flex flex-col items-center">
        <div className="auth-containter w-[30%] h-[60%] flex flex-col items-center justify-evenly bg-slate-950/70 rounded-lg mt-24 text-white backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-xl font-semibold">Welcome Back!</h2>
                <h3>Login to Django Messenger</h3>
            </div>
            <form className="w-full flex flex-col items-center gap-3" onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" ref={emailRef} onChange={() =>  emailValue = emailRef.current.value} className="outline-none border-none w-[60%] bg-slate-700/60 resize-none text-base p-2 rounded-md" name="name" id="" />
                <input type="password" placeholder="Password" ref={passwordRef} onChange={() =>  passwordValue = passwordRef.current.value} className="outline-none border-none w-[60%] bg-slate-700/60 resize-none text-base p-2 rounded-md" name="password" id="" />
                <input type="submit" className="cursor-pointer bg-black w-[60%] p-2 rounded-md text-sm font-light" value="Login" />
            </form>
            <div className="flex flex-col items-center gap-2">
                <p className='font-thin text-sm text-blue-400 hover:text-blue-600 cursor-pointer' onClick={() => alert('Your Fault')}>Forgot passowrd?</p>
                <p className='font-thin text-sm'>Don't have a account? <span><Link to="/register" className='text-blue-400 hover:text-blue-600'>Sign Up</Link></span></p>
            </div>
        </div>
    </div>
  )
}

export default Login
