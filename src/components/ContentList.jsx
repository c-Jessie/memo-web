import { useEffect, useState } from "react";
import SvgIcon from "@/components/SvgIcon";
import { useSnapshot } from "valtio";
import { valtioState } from "@/state";
import { getTimeDisplay } from '@/utils';
function ContentList() {
  // 添加 isLoading 状态
  const [isLoading, setIsLoading] = useState(false);
  const snapshot = useSnapshot(valtioState);
  const initCategory = snapshot.categories;
  const initContent = snapshot.memories
  // 当前文件夹
  const filterCategory = initCategory.filter(filterItem => filterItem.id === snapshot.currentCategoryId).map(obj => obj.folderName)[0]
  // 当前备忘录
  const filterContent = initContent.filter(filterItem => filterItem.category === filterCategory)
  // const addContent = async () => {
  //   setIsLoading(true);
  //   try {
  //     // 获取当前时间并转换为ISO 8601格式的字符串
  //     const now = new Date();
  //     // 如果你想要UTC时间戳
  //     const timestamp = now.getTime();

  //     // 这里是添加内容的逻辑
  //     const newContent = {
  //       id: generateRandomString(),
  //       title: `新建备忘录 ${initContent.length + 1}`,
  //       contentDetail: '',
  //       createdAt: timestamp, // 使用当前时间作为创建时间
  //       updatedAt: timestamp, // 同时更新更新时间
  //       reminders: [],
  //       isCompleted: false,
  //       attachments: [],
  //       category: filterCategory,
  //       categoryId: snapshot.currentCategoryId
  //     };
  //     await simulateAsyncOperation();
  //     // 更新备忘录列表
  //     valtioState.memories = [newContent, ...initContent]
  //     // 当前选中备忘录
  //     valtioState.currentMemoId = newContent.id
  //     setIsLoading(false);
  //   } catch (error) {
  //     setIsLoading(false); // 停止加载
  //   }
  // };
  const simulateAsyncOperation = () => {
    // 模拟异步操作
    return new Promise((res) => {
      setTimeout(() => {
        res()
      }, 0)
    })
  }
  // 移除当前备忘录
  const removeMemo = async (e) => {
    e.stopPropagation()
    if (filterContent && filterContent.length > 0) {
      const reItem = valtioState.memories.filter(item => item.id !== snapshot.currentMemoId)
      await simulateAsyncOperation();
      valtioState.memories = reItem
      valtioState.currentMemoId = ''
    }
  }
  // 内容列表
  const contentItems =
    filterContent.length === 0 ?
      <div className='py-3 px-4 text-center text-neutral-500 text-3xl'>{'无备忘录'}</div> :
      filterContent.map((items, index) =>
        <div
          key={items.id}
          onClick={() => valtioState.currentMemoId = items.id}
          className={`my-2.5 py-3 px-4 cursor-default rounded-md  ${items.id === snapshot.currentMemoId && 'bg-amber-200'}`}>
          <div className='truncate w-60 font-bold'>{items.title}</div>
          <div className='w-60 flex'>
            <span className='mr-1'>{getTimeDisplay(items.updatedAt)}</span>
            {
              items.contentDetail ?
                <div className='truncate text-neutral-500'>{items.contentDetail}</div> :
                <div className=' text-neutral-500'>{'暂无内容'}</div>
            }
          </div>
        </div>
      )

  return (
    <>
      <div className='flex-none overflow-auto min-w-80 h-screen border-r-[1px] border-l-black'>
        <div className='flex justify-between items-center p-4 bg-zinc-100 '>
          <div className='flex'>
            <div className=' p-1.5 mr-2 bg-zinc-200 rounded-md'>
              <SvgIcon name='listbullet' className='h-5 w-5 text-slate-700 ' />
            </div>
            <div className=' p-1.5 rounded-md'>
              <SvgIcon name='sgrid' className='h-5 w-5 text-slate-700' />
            </div>
          </div>
          {/* <button className='text-2xl' onClick={addContent}>✍️</button> */}
          <div className='p-1.5' onClick={removeMemo}><SvgIcon name='trash' className='h-6 w-6 text-slate-700 cursor-pointer' /></div>
        </div>
        <div className='p-4'>
          {isLoading ? '加载中' : contentItems}
        </div>
      </div>
    </>
  )
}
export default ContentList