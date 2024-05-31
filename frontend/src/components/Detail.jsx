import { X, UserMinus } from "lucide-react"
import { useAppLayout, useOtherUser } from "../utils/appStore"
import useFetch from '../hooks/useFetch'
function Detail() {

  const { showDetail, toggleDetail } = useAppLayout()
  const { otherUser, setOtherUser } = useOtherUser()
  const api = useFetch()
  
  const removeFriend = async () => {
    try {
      let { response, data } = await api(`chat/friend/remove/${otherUser.username}`)
      if(response.status == 200){
        setOtherUser('')
        toggleDetail()
      } else {
        console.log('Error Removing Friend! \n Response: ', response, '\n Data: ', data)
      }
    } catch (error) {
      console.error("Error fetching friends", error)
    }
  }

  return (
    <div className={`flex-1 flex flex-col transition-opacity duration-500 ${ showDetail ? '' : 'hidden' }`}>
      <div className="flex items-center justify-between p-[.9rem]">
        <X size={20} className="cursor-pointer" onClick={toggleDetail} />
        <h1 className="mx-auto self-center font-semibold">User Profile</h1>
      </div>
      <div className="px-8 py-5 flex flex-col items-center gap-5 border border-transparent">
        <img src={otherUser.avatar} className="w-24 h-24 rounded-full object-cover" alt="" />
        <div className="flex-col items-center gap-1">
          <h2>{otherUser.name}</h2>
          <h2 className="font-thin text-xs">@{otherUser.username}</h2>
        </div>
        <p>{otherUser.bio}</p>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-end gap-6">
        <button className="flex items-center gap-3 cursor-pointer border-none outline-none bg-red-600 hover:bg-red-700 py-1 px-6 self-center rounded-lg">
          <UserMinus size={16} />
          <span className="font-light" onClick={() => removeFriend()}>Remove Friend</span>
        </button>
      </div>
    </div>
  )
}

export default Detail
