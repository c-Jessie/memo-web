import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { valtioState } from "../state";
import { generateRandomString, getTimeDisplay } from '../utils';
function ContentList() {
  const snapshot = useSnapshot(valtioState);
  const initCategory = snapshot.categories;
  const initContent = snapshot.memories
  // 当前文件夹
  const filterCategory = initCategory.filter(filterItem => filterItem.id === snapshot.currentCategoryId).map(obj => obj.folderName)[0]
  // 当前备忘录
  const filterContent = initContent.filter(filterItem => filterItem.category === filterCategory)
  const addContent = () => {
    // 获取当前时间并转换为ISO 8601格式的字符串
    const now = new Date();
    // 如果你想要UTC时间戳
    const timestamp = now.getTime();

    // 这里是添加内容的逻辑
    const newContent = {
      id: generateRandomString(),
      title: `新建备忘录 ${initContent.length + 1}`,
      contentDetail: '',
      createdAt: timestamp, // 使用当前时间作为创建时间
      updatedAt: timestamp, // 同时更新更新时间
      reminders: [],
      isCompleted: false,
      attachments: [],
      category: filterCategory,
      categoryId: snapshot.currentCategoryId
    };
    // 更新备忘录列表
    valtioState.memories = [newContent, ...initContent]
    // 当前选中备忘录
    valtioState.currentMemoId = newContent.id
  };
  const selectContent = (items, index) => {
    valtioState.currentMemoId = items.id
  }
  // 内容列表
  const contentItems =
    filterContent.length === 0 ?
      <div className='py-3 px-4 text-center text-neutral-500'>{'暂无内容'}</div> :
      filterContent.map((items, index) =>
        <div
          key={items.id}
          onClick={() => selectContent(items, index)}
          className={`my-2.5 py-3 px-4 cursor-default rounded-md  ${items.id === snapshot.currentMemoId && 'bg-yellow-300'}`}>
          <div className='truncate w-60 font-bold'>{items.title}</div>
          <div className='w-60 flex'>
            <span className='mr-1'>{getTimeDisplay(items.updatedAt)}</span>
            {
              items.contentDetail ?
                <div className='truncate text-neutral-500'>{items.contentDetail}</div> :
                <div className='text-neutral-500'>{'暂无内容'}</div>
            }
          </div>
        </div>
      )

  return (
    <>
      <div className='flex-none overflow-auto p-4 min-w-80 h-screen border-r-[1px] border-l-black'>
        <div className='flex justify-between'>
          <button className='text-2xl' onClick={addContent}>✍️</button>
          {/* <button className='text-2xl' >🗑️</button> */}
        </div>
        <hr />
        {contentItems}
      </div>
    </>
  )
}
export default ContentList