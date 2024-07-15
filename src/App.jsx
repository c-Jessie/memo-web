import SideMenu from "./components/SideMenu";
import ContentList from "./components/ContentList";
import ContentDetail from "./components/ContentDetail";
// import Inspirational from "./components/Inspirational";
function App() {

  return (
    <>
      <div >
        {/* 每日一句鸡汤 */}
        {/* <Inspirational /> */}
        <div className='flex overflow-hidden '>
          {/* 文件夹列表 */}
          <SideMenu />
          {/* 内容列表 */}
          <ContentList />
          {/* 内容详情 */}
          <ContentDetail />
        </div>
      </div >
    </>
  )
}

export default App
