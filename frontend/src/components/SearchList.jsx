import { useEffect, useState } from "react"
import useFetch from "../hooks/useFetch"
import useAuthStore, { useOtherUser, useSearch, useFriends } from "../utils/appStore"
import { UserPlus } from "lucide-react"

function SearchList() {
    const { user } = useAuthStore()
    const { setOtherUser } = useOtherUser()
    const { showSearch, searchQuery, setSearchQuery } = useSearch()
    const { friendsList } = useFriends()
    const [searchResults, setSearchResults] = useState()
    const api = useFetch()

    const searchUser = async () => {
      try {
        const { response, data } = await api(`users/?search=${searchQuery}`)
        if (response.status === 200) {
          setSearchResults(data)
        } else {
          console.error('Error fetching Search Results: ', response.status)
        }
      } catch (error) {
        console.error('Error fetching Search Results: ', error)
      }
    }

    useEffect(() => {
      searchUser()
    }, [searchQuery, friendsList])

  return (
    <div className={`flex-1 overflow-y-scroll scroll-smooth  px-3 gap-5 ${ showSearch ? '' : 'hidden' }`}>
      <h1 className="px-3 pb-3 font-semibold text-lg">Showing Results for : {searchQuery}</h1>
      <div className="">
      {
      searchResults && searchResults.map((item, index) => (
        <div key={index}>
          {
            item.username === user.username ? '' :
            <div className="flex items-center align-middle gap-5 cursor-pointer border border-transparent border-b-slate-600 p-2" onClick={() => {
              setSearchQuery('')
              setOtherUser(item)
              }}>
              <img src={item.avatar} className="w-12 h-12 rounded-full" alt="" />
                <div className="texts flex-1">
                  <span>{item.name}</span><br />
                  {/* <span className="text-xs font-light">@{item.username}</span> */}
                  <p className='font-light'>Start a Conversation 👋</p>
                </div>
                {
                  friendsList && friendsList.includes(item.username) ? '' :
                  <div className="rounded-full p-2"><UserPlus /></div>
                }
            </div>
          }
        </div>
        ))
        }
        </div>
    </div>
  )
}

export default SearchList
