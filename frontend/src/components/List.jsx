import ChatList from "./ChatList"
import UserInfo from "./UserInfo"
import SearchList from "./SearchList"

function List() {
  return (
    <div className="h-full flex flex-col flex-1 overflow-hidden select-none">
      <UserInfo />
      <SearchList />
      <ChatList />
    </div>
  )
}

export default List
