import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const storedTokens = localStorage.getItem('authTokens')
let parsedTokens = null
let decodedUser = null

if (storedTokens) {
  try {
    parsedTokens = JSON.parse(storedTokens)
    if (parsedTokens.detail && parsedTokens.detail === "Token is blacklisted") {
      parsedTokens = null
    } else {
      decodedUser = jwtDecode(storedTokens)
    }
  } catch (error) {
    console.error('Error parsing authTokens:', error)
    parsedTokens = null
  }
}

const useAuthStore = create((set) => ({
    isLoading: true,
    authTokens: parsedTokens,
    setAuthTokens: (authTokens) => set({ authTokens }),
    user: decodedUser,
    setUser: (user) => set({ user }),
    loginUser: async (email, password)=> {
        try{
          var response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
              method:'POST',
              headers:{
                  'Content-Type':'application/json'
              },
              body:JSON.stringify({'email': email, 'password': password})
        })
        let data = await response.json()

        if (response.status === 200) {
        set({ authTokens: data })
        set({ user: jwtDecode(data.access) })
        localStorage.setItem('authTokens', JSON.stringify(data))
      } else {
        alert('Something went wrong!')
      }
    } catch (error) {
      console.error('Error logging in:', error)
    }
    },
    registerUser: async (name, username, email, password, cpassword)=> {
      try{
        var response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'name': name, 'username': username, 'email': email, 'password': password, 'confirm_password': cpassword})
      })
      let data = await response.json()

      if (response.status === 200) {
        const nav = useNavigate()
        nav('/login')
    } else {
      alert('Something went wrong!')
    }
  } catch (error) {
    console.error('Error logging in:', error)
  }
  },
    logoutUser: async () => {
      try{
        await fetch('http://127.0.0.1:8000/api/auth/logout/', {
          method:'POST',
          headers:{
              'Content-Type':'application/json'
          }, 
        })
        localStorage.removeItem('authTokens')
        set({ authTokens: null })
        set({ user: null })
      }catch(err){
        console.log('Error Logging out', err)
      }
    },
}))

export const useOtherUser = create((set) => ({
  otherUser: '',
  setOtherUser: (otherUser) => set({ otherUser }),
}))

export const useAppLayout = create((set) => ({
  showDetail: false,
  toggleDetail: () => set((state) => ({ showDetail: !state.showDetail })),
}))

export const useSearch = create((set) => ({
  showSearch: true,
  setShowSearch: (showSearch) => set({ showSearch }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}))

export const useFriends = create((set) => ({
  friendsList: [],
  setFriendsList: (friendsList) => set({ friendsList })
}))

export default useAuthStore