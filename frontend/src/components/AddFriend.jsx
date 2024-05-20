import React from 'react'

function AddFriend(display) {
  return (
    <div className={ display == true ? "bg-black w-52 h-52 z-10 absolute t-10 left-7 hidden" : "bg-black w-52 h-52 z-10 absolute t-10 left-7"}>
      hi
    </div>
  )
}

export default AddFriend
