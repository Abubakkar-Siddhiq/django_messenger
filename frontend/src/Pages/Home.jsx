import Detail from "../components/Detail"
import Chat from "../components/chat/Chat"
import List from "../components/List"
import { useAppLayout } from "../utils/appStore"

function Home() {
  const { showDetail } = useAppLayout()
  return (
    <main className="w-screen h-screen text-white">
      <section className="bg-bg-image w-full h-full flex items-center justify-center">
        <div className={`w-full h-full lg:h-[93vh] transition-opacity duration-500 flex bg-gray-950/60 backdrop-blur-lg rounded-xl border border-slate-600 ${ showDetail ? 'lg:w-[88vw]' : 'lg:w-[75vw]'}`}>
          <List />
          <Chat />
          <Detail />
        </div>
      </section>
    </main>
  )
}

export default Home