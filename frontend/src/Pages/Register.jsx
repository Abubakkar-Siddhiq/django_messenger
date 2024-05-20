import { useRef } from 'react'
import useAuthStore from "../utils/appStore"
import { Link, useNavigate } from 'react-router-dom'

function Register() {
    const nav = useNavigate()
    const { registerUser } = useAuthStore()
    const nameRef = useRef(null)
    const usernameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const cpasswordRef = useRef(null)
    var nameValue, usernameValue, emailValue, passwordValue, cpasswordValue

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await registerUser(nameValue, usernameValue, emailValue, passwordValue, cpasswordValue)
            nav('/')
        } catch (err){
            console.err(err)
        }
    }
    
    
      return (
        <div className="w-screen h-screen bg-bg-image flex flex-col items-center">
            <div className="auth-containter w-[40%] h-[70%] flex flex-col items-center justify-evenly bg-slate-950/70 rounded-lg mt-24 text-white backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-xl font-semibold">Welcome on Board!</h2>
                    <h3>Get Started with Django Messenger</h3>
                </div>
                <form className="w-full flex flex-col items-center gap-3" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" ref={nameRef} onChange={() =>  nameValue = nameRef.current.value} className="outline-none border-none w-[60%] bg-slate-700/60 resize-none text-base p-2 rounded-md" name="name" id="" />
                    <input type="text" placeholder="Username" ref={usernameRef} onChange={() =>  usernameValue = usernameRef.current.value} className="outline-none border-none w-[60%] bg-slate-700/60 resize-none text-base p-2 rounded-md" name="password" id="" />
                    <input type="email" placeholder="Email" ref={emailRef} onChange={() =>  emailValue = emailRef.current.value} className="outline-none border-none w-[60%] bg-slate-700/60 resize-none text-base p-2 rounded-md" name="name" id="" />
                    <input type="password" placeholder="Password (min. 8 chars)" ref={passwordRef} onChange={() =>  passwordValue = passwordRef.current.value} className="outline-none border-none w-[60%] bg-slate-700/60 resize-none text-base p-2 rounded-md" name="password" id="" />
                    <input type="password" placeholder="Confirm Password" ref={cpasswordRef} onChange={() =>  cpasswordValue = cpasswordRef.current.value} className="outline-none border-none w-[60%] bg-slate-700/60 resize-none text-base p-2 rounded-md" name="password" id="" />
                    <input type="submit" className="cursor-pointer bg-black w-[60%] p-2 rounded-md text-sm font-light" value="Register" />
                </form>
                <div className="flex flex-col items-center gap-2">
                    <p className='font-thin text-sm text-blue-400 hover:text-blue-600 cursor-pointer' onClick={() => alert('We sell your data. That\'s it!')}>Terms & Conditions</p>
                    <p className='font-thin text-sm'>Already a user? <span><Link to="/login" className='text-blue-400 hover:text-blue-600'>Login</Link></span></p>
                </div>
            </div>
        </div>
      )
}

export default Register 
