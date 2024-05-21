import { useOtherUser } from "../../utils/appStore"
function ChatBubble({content, time}) {
  return (
    <div className="texts">
            <p>{content}</p>
            <span>{time}</span>
        </div>
    )
}

function ReplyBubble({content, time}){
    const { otherUser } = useOtherUser()
    return(
        <>
            <img src={otherUser.avatar} alt="" />
            <div className="texts">
                <p>{content}</p>
                <span>{time}</span>
            </div>
        </>
    )
}

export {ChatBubble, ReplyBubble}
