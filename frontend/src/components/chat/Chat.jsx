import { useState, useRef, useEffect, useMemo } from "react"
import { Laugh, Phone, Video, Image, Camera, Mic, SendHorizontal, MessageSquareQuote, EllipsisVertical } from "lucide-react"
import EmojiPicker from "emoji-picker-react"
import useFetch from "../../hooks/useFetch"
import { ChatBubble, ReplyBubble } from "./ChatBubble"
import useWebSocket from 'react-use-websocket'
import useAuthStore, { useAppLayout, useOtherUser } from '../../utils/appStore'
import { formatDistanceToNowStrict } from "date-fns"


const Chat = () => {
  const { otherUser } = useOtherUser()
  const { user } = useAuthStore()
  const { toggleDetail } = useAppLayout()
  const [isEmojiPickerOpened, setIsEmojiPickerOpened] = useState(false)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const [uuid, setUUID] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const endRef = useRef(null)

  const api = useFetch()
  // const { formatDistanceToNow } = dateFns

  const getRoomId = async (otherUser) => {
    try {
      const { response, data } = await api(`chat/user/${otherUser}`)
      if (response.status === 200) {
        setRoomId(data.chatroom)
      } else {
        console.error('Error fetching room ID:', response.status)
      }
    } catch (error) {
      console.error('Error fetching room ID:', error)
    }
  }

  const getMessages = async (roomId) => {
    try {
      console.log('Fetching messages for room:', roomId)
      const { response, data } = await api(`chat/room/${roomId}`)
      if (response.status === 200) {
        setMessages(data)
      } else {
        console.error('Error fetching messages:', response.status)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

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

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp)
    return formatDistanceToNowStrict(date, { addSuffix: true })
}

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const fetchRoomAndMessages = async () => {
      await getRoomId(otherUser.username)
      await getUUID()
    }

    otherUser && fetchRoomAndMessages()
  }, [otherUser])

  useEffect(() => {
    if (roomId) {
      getMessages(roomId)
    }
  }, [roomId])

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    uuid && roomId ? `ws://127.0.0.1:8000/ws/chatroom/${roomId}` : null,
    {
      queryParams: { uuid },
      onOpen: () => console.log('WebSocket connection established'),
      onClose: () => console.log('WebSocket connection closed'),
      onError: (error) => console.error('WebSocket error:', error),
      onMessage: (event) => {
        const message = JSON.parse(event.data)
        setMessages((prevMessages) => [...prevMessages, message])
      },
    }
  )

  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data)
      setMessages((prevMessages) => [...prevMessages, message.data])
    }
  }, [lastMessage])

  const handleEmoji = (e) =>{
    setText((prev) => prev+ e.emoji)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if(text){
      try{
        sendJsonMessage(text)
        setText("")
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
      otherUser ? (
        <div className="h-full flex flex-col flex-2 border border-transparent border-l-slate-600 border-r-slate-600">
          <div className="px-5 py-3 flex items-center justify-between border border-transparent border-b-slate-600">
            <div className="flex items-center gap-5 cursor-pointer" onClick={toggleDetail }>
              <img src={otherUser.avatar} className="w-10 rounded-full object-cover" alt="" />
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold">{otherUser.name}</span>
                {/* <p className="text-sm font-light text-slate-400">Lorem ipsumahdjasdkj asdhjkads</p> */}
              </div>
            </div>
            <div className="flex gap-5">
              <Phone size={22} className="cursor-pointer" />
              <Video size={22} className="cursor-pointer" />
              <EllipsisVertical size={22} className="cursor-pointer" />
            </div>
          </div>
          <div className="flex flex-col flex-1 p-5 gap-5 overflow-y-scroll scroll-smooth">
            {messages && messages.length > 0 ? (
              messages.map((item, index) => (
                <div className={ item.sender === user.username ? "message own" : item.sender === otherUser.username ? "message" : "" } key={index}>
                  { item.sender === user.username ? <ChatBubble content={item.content} time={formatTimeAgo(item.created_at)} /> : item.sender === otherUser.username ? <ReplyBubble content={item.content} time={formatTimeAgo(item.created_at)} /> : ""  }
                </div>
            ))
            ) : (
              <p className="self-center my-auto">No Messages to Display</p>
            )}
            <div className="pt-3" ref={endRef}></div>
          </div>
          <div className="mt-auto px-5 py-3 flex items-center justify-between border border-transparent gap-5 border-t-slate-600">
            <div className="flex gap-5">
              <Image size={20} />
              <Camera size={20} />
              <Mic size={20} />
            </div>
            <form className="w-full flex justify-evenly gap-4 items-center" onSubmit={handleFormSubmit}>
              <input type="text" value={text} placeholder="Type a message...." onChange={(e) => setText(e.target.value)} className="flex-1 bg-slate-700/60 text-base border-none outline-none px-3 py-2 rounded-md" />
              <div className="cursor-pointer relative" onClick={() => {setIsEmojiPickerOpened((prev) => !prev)}}>
                  <Laugh size={24} />
                  <div className="absolute bottom-12 left-0">
                    <EmojiPicker open={isEmojiPickerOpened} onEmojiClick={handleEmoji} height={350} width={270} />
                  </div>
              </div>
              <button type="submit" className={ text ? "bg-blue-600 px-4 py-2 rounded-lg" : "bg-blue-600 px-4 py-2 rounded-lg cursor-not-allowed" }><SendHorizontal/></button>
            </form>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col flex-2 items-center justify-center border border-transparent border-l-slate-600 border-r-slate-600 select-none">
          <div className="flex flex-col items-center gap-3">
            <MessageSquareQuote size={60} />
            <h1 className="text-lg font-semibold">Django Web Messenger</h1>
            <p className="text-md font-light">Send and Recieve messeages from your friends and closest ones, Start Texting...</p>
          </div>
        </div>
      )
    )
}

export default Chat
