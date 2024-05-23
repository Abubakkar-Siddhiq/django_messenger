import useAuthStore, { useOtherUser, useSearch, useFriends, useAppLayout } from '../utils/appStore'
import useFetch from '../hooks/useFetch'
import { useEffect, useState, useCallback } from 'react'
import useWebSocket from 'react-use-websocket'

export default function ChatList() {
  const { user } = useAuthStore()
  const { setOtherUser } = useOtherUser()
  const { showSearch } = useSearch()
  const { setFriendsList } = useFriends()
  const [friends, setFriends] = useState()
  const [uuid, setUUID] = useState()
  const api = useFetch()

  const getUUID = async () => {
    try {
      const { response, data } = await api('auth/auth_for_ws_connection')
      if (response.status === 200) {
        setUUID(data.uuid)
      } else {
        console.error('Error fetching UUID:', response.status)
      }
    } catch (error) {
      console.error('Error fetching UUID:', error)
    }
  }

  const getFriends = useCallback(async () => {
    try {
      let { data } = await api(`chat/friends`)
      await getUUID()
      await getFriendsInfo()
      const f = data['friends']
      setFriendsList(f)
      
    } catch (error) {
      console.error("Error fetching friends", error)
    }
  })

  const getFriendsInfo = async (fname) => {
    let { data } = await api(`chat/friends/all`)
    setFriends(data)
  }

  useEffect(() => {
    getFriends()
  }, [])


 useWebSocket(
    uuid && `ws://127.0.0.1:8000/ws/notifications/`, 
  {
    queryParams: { uuid },
    onOpen: () => console.log('WebSocket connection established.'),
    onClose: () => console.log('WebSocket connection closed'),
    onError: (error) => console.error('WebSocket error:', error),
    onMessage: (message) => {
        const data = JSON.parse(message.data)
        console.log(data)
        if (data.type === 'notify_message') {
            console.log(data.message)
            getFriends()
        }
    },
    shouldReconnect: (closeEvent) => true, 
})


  return (
    <div className={`flex-1 overflow-y-scroll scroll-smooth  px-3 gap-5 ${ showSearch ? 'hidden' : '' }`}>
      <div className="px-3 pb-2">
        <h1 className='text-xl font-semibold mr-auto'>Friends: </h1>
      </div>
      <div className="flex flex-col gap-2">
      {
      friends && friends.map((item, index) => (
        <div key={index}>
          <div className="flex align-middle gap-3 cursor-pointer border border-transparent border-b-slate-600 p-3" onClick={() => {
            setOtherUser(item)
            setTimeout(()=>{
              getFriends()
            }, 1200)
          }}>
            <img src={item.avatar} className="w-12 h-12 rounded-full" alt="" />
            <div className="flex flex-col flex-1 truncate">
              <span>{item.name}</span>
              {
                item.last_message && item.last_message !== null ? (
                  <span className='font-light flex gap-2 truncate'>
                    <p>{item.last_message.sender === user.username ? "You: " : ""}</p>
                    <p>{item.last_message.content}</p>
                  </span>
                ) : (
                  <p className='font-light'>Start with a Hi! 👋</p>
                )
              }
            </div>
            {
              item.unread_count > 0 ? <div className="self-center px-3 py-1 rounded-full bg-blue-500">{item.unread_count}</div> : ""
            }
          </div>
        </div>
      ))
    }
      </div>
    </div>
  )
}