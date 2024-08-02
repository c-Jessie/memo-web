import SideMenu from "./components/SideMenu";
import ContentList from "./components/ContentList";
import ContentDetail from "./components/ContentDetail";
// import Inspirational from "./components/Inspirational";

import { useSnapshot } from "valtio";
import { valtioState } from "@/state";
function App() {
  const snapshot = useSnapshot(valtioState);
  return (
    <>
      {/* 每日一句鸡汤 */}
      {/* <Inspirational /> */}

      <div className='flex overflow-hidden h-screen relative'>
        {/* 文件夹列表 */}
        <SideMenu />
        {/* 内容列表 */}
        <ContentList />
        {/* 内容详情 */}
        <ContentDetail />
      </div>
    </>
  )
}

export default App
