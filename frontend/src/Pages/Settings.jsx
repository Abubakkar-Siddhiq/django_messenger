import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../utils/appStore'
import { storage } from '../config/firebase'
import useFetch from '../hooks/useFetch'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"

function Settings() {
    const { user } = useAuthStore()
    const [name, setName] = useState(user.name)
    const [username, setUsername] = useState(user.username)
    const [avatar, setAvatar] = useState(user.avatar)
    const [bio, setBio] = useState(user.bio)
    const [prog, setProg] = useState(false)
    const [progresspercent, setProgresspercent] = useState(0)
    const nav = useNavigate()
    const api = useFetch()

    const handleFileChange = (e) => {
        e.preventDefault()
        const file = e.target?.files[0]
        if (!file) return

        const storageRef = ref(storage, `files/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on("state_changed",
        (snapshot) => {
            const progress =
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            setProgresspercent(progress)
            setProg(true)
        },
        (error) => {
            alert(error)
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setAvatar(downloadURL)
            })
        }
        )
    }


    const updateUser = async (name, username, avatar, bio) => {
        try{
            let body = {'name': name, 'username': username, 'avatar': avatar, 'bio': bio}
            let { response, data } = await api(`edit/user/${user.user_id}`, 'PUT', body)
            if(response.status === 200){
                alert('Changes added Successfully! \n Wait a few minutes for the changes to be applied :)')
                setTimeout(() => {
                    nav('/')
                }, [1000])
            }
          }
         catch(err) {
          console.log('Error Logging out', err)
        }
    }

  return (
    <section className="w-screen h-screen bg-bg-image flex items-center justify-center">
    <div className={`w-full h-full lg:h-[93vh] lg:w-[75vw] flex-col p-5 text-white transition-opacity duration-500 flex bg-gray-950/60 backdrop-blur-lg rounded-xl border border-slate-600`}>
        <div className="p-2 flex gap-2 items-center cursor-pointer" onClick={() => nav('/')}>
            <ArrowLeft size={20} />
            <span>Go back</span>
        </div>
        <div className="py-3 px-10">
            <h1 className='text-4xl font-semibold'>Settings</h1>
        </div>
        <div className='w-[40%] flex flex-col mx-auto px-5 gap-5'>
        <div className="flex flex-col items-center gap-10">
            <div className="flex items-center gap-10">
                <img src={avatar} className='rounded-full w-20' alt="User Avatar" />
                <div className="flex flex-col gap-2">
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    { prog && <h1 className='font-thin text-xs'>{progresspercent}% uploaded</h1> }
                </div>
            </div>
            </div>
            <div className="flex flex-col gap-1">
                <h1 className='text-lg'>Name</h1>
                <input type="text" className='bg-slate-700/60 text-base border-none outline-none p-2 rounded-md' placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
                <h1 className='text-lg'>Username</h1>
                <input type="text" className='bg-slate-700/60 text-base border-none outline-none p-2 rounded-md' placeholder="Enter your Username" value={`${username}`} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
                <h1 className='text-lg'>About</h1>
                <textarea type="text" className='bg-slate-700/60 resize-none text-base border-none outline-none p-2 rounded-md' placeholder="Enter about yourself" value={bio} onChange={(e) => setBio(e.target.value)}  />
            </div>
            <button className='p-2 bg-blue-800 rounded-md text-md' onClick={() => {
                updateUser(name, username, avatar, bio)
            }}
            >save
            </button>
        </div>
    </div>
  </section>
  )
}

export default Settings
