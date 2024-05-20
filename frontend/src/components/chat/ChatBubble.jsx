function ChatBubble({content, time}) {
  return (
    <div className="texts">
            <p>{content}</p>
            <span>{time}</span>
        </div>
    )
}

function ReplyBubble({content, time}){
    return(
        <>
            <img src="../../src/assets/pfp.jpg" alt="" />
            <div className="texts">
                <p>{content}</p>
                <span>{time}</span>
            </div>
        </>
    )
}

export {ChatBubble, ReplyBubble}
