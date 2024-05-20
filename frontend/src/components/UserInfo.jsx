import { Ellipsis, Video, SquarePen, Search, ArrowLeftFromLine, ArrowLeft, Settings } from "lucide-react"
import useAuthStore, { useSearch } from "../utils/appStore"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
function UserMenu({showMenu}){
  const { logoutUser} = useAuthStore()
  const nav = useNavigate()
  return(
    <div className={`absolute right-1 text-white top-4 z-10 mt-2 w-56 origin-top-right rounded-lg bg-slate-950/20 backdrop-blur-lg ${ showMenu ? '' : 'hidden' }`}>
      <ul className="flex flex-col items-start">
        <li className="w-full h-full flex items-center gap-2 border border-none cursor-pointer hover:bg-slate-300/10 px-5 py-2 rounded-t-lg" onClick={() => nav('/settings')}>
          <Settings size={18} />
          <span>Settings</span>
        </li>
        <li className="w-full h-full border flex items-center gap-2 border-none cursor-pointer hover:bg-slate-300/10 px-5 py-2 rounded-b-lg" 
        onClick={() => {
          logoutUser()
          nav('/login')
          }
        }>
          <ArrowLeftFromLine size={18} color="#EF4444" />
          <span className="text-red-500">Logout</span>
        </li>

      </ul>
    </div>
  )
}

function UserInfo() {
  const {user} = useAuthStore()
  const { searchQuery, setSearchQuery, setShowSearch } = useSearch()
  const [showMenu, setShowMenu] = useState(false)

  const clearSearch = () => {
    setSearchQuery('')
  }

  useEffect(() => {
    if(searchQuery !== ''){
      setShowSearch(true)
    } else {
      setShowSearch(false)
    }
  }, [searchQuery])

  return (
    <div className="flex flex-col" onMouseLeave={() => setShowMenu(false)}>
      <div className="p-5 flex items-center justify-between text-white">
      <div className="flex items-center gap-5">
        <img src={user.avatar} alt="Profile Picture" className="w-12 h-12 rounded-full object-cover" />
        <h2>{user.name}</h2> 
      </div>
      <div className="flex justify-center gap-5 relative">
        <div className="cursor-pointer" onClick={() => setShowMenu((prev) => !prev)}>
          <Ellipsis size={22} />
          <UserMenu showMenu={showMenu}/>
        </div>
      </div>
      
    </div>
    <div className="flex items-center gap-5 p-5">
      <div className="searchbar flex flex-1 align-middle gap-5 p-1 pl-3 rounded-md bg-slate-600/40 ">
        { searchQuery ? <ArrowLeft className="cursor-pointer" onClick={() => clearSearch()}  /> : <Search /> }
        <form className="w-full">
          <input className="w-full h-full bg-transparent border-none outline-none text-white text-sm" type="text" value={searchQuery} placeholder="Search" onChange={(e) => setSearchQuery(e.target.value)} />
        </form>
      </div>
    </div>
  </div>
  )
}

export default UserInfo
