import { useOtherUser, useSearch, useFriends } from '../utils/appStore'
import useFetch from '../hooks/useFetch'
import { useEffect, useState } from 'react'
function ChatList() {
  const { setOtherUser } = useOtherUser()
  const { showSearch } = useSearch()
  const { friendsList, setFriendsList } = useFriends()
  const [friends, setFriends] = useState()
  const api = useFetch()

  const getFriends = async () => {
    try {
      let { data } = await api(`chat/friends`)
      const f = data['friends']
      setFriendsList(f)
      let friendsData = []
  
      for (const f_name of f) {
        const friendInfo = await getFriendsInfo(f_name)
        friendsData.push(friendInfo)
      }
  
      setFriends(friendsData)
    } catch (error) {
      console.error("Error fetching friends", error)
    }
  }

  const getFriendsInfo = async (fname) => {
    let { data } = await api(`user/${fname}`)
    return data[0]
  }

  useEffect(() => {
    getFriends()
  }, [])

  return (
    <div className={`flex-1 overflow-y-scroll scroll-smooth  px-3 gap-5 ${ showSearch ? 'hidden' : '' }`}>
      <h1 className='px-3 pb-2 text-lg font-semibold'>Friends: </h1>
      <div className="flex flex-col gap-2">
      {
      friends && friends.map((item, index) => (
        <div key={index}>
          <div className="flex align-middle gap-5 cursor-pointer border border-transparent border-b-slate-600 p-3" onClick={() => setOtherUser(item)}>
            <img src={item.avatar} className="w-12 h-12 rounded-full" alt="" />
              <div className="flex flex-col">
                <span>{item.name}</span>
                <p className='font-light'>click here to start chatting</p>
              </div>
          </div>
        </div>
      ))
    }
      </div>
    </div>
  )
}

export default ChatList