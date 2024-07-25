import { useState, useRef, useEffect } from "react";
import SvgIcon from "@/components/SvgIcon";
import { useSnapshot } from "valtio";
import { valtioState } from "@/state";
import { generateRandomString } from '@/utils';
// 富文本
import Editor from './Editor';
import Quill from 'quill'; // 导入 Quill.js 库
import 'quill/dist/quill.snow.css';
function ContentDetail() {
  // 添加 isLoading 状态
  const snapshot = useSnapshot(valtioState);
  const initContent = snapshot.memories
  const initCategory = snapshot.categories;
  const searchInputRef = useRef(null); // 搜索
  const [searchValue, setSearchValue] = useState(''); // 搜索关键字
  const [isSearch, setIsSearch] = useState(false) // 存储当前是否是搜索状态
  // 当前内容
  const currentMemoDetail = initContent.find(memo => memo.id === snapshot.currentMemoId) || {};
  // 当前文件夹
  const filterCategory = initCategory.filter(filterItem => filterItem.id === snapshot.currentCategoryId).map(obj => obj.folderName)[0]
  // 富文本
  const quillRef = useRef(null);
  const Delta = Quill.import('delta');
  // 编辑备忘录内容的方法
  const editContent = (content) => {
    if (quillRef.current) {
      quillRef.current.setContents(content);
    }
  };
  useEffect(() => {
    if (currentMemoDetail.contentDetail) {
      editContent(currentMemoDetail.contentDetail);
    }
  }, [currentMemoDetail.id]); // 依赖项包含 currentMemoDetail.id
  // 添加内容
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
  // 编辑富文本
  const handleTextChange = (newContent) => {
    console.log('edit--', newContent);
    const contentToUpdate = JSON.stringify(newContent);
    const updatedMemos = valtioState.memories.map((memo) => {
      if (memo.id === valtioState.currentMemoId) {
        return { ...memo, contentDetail: contentToUpdate, updatedAt: Date.now() };
      }
      return memo;
    });
    valtioState.memories = updatedMemos; // 更新状态
  };
  // 搜索
  const onSearchKeyUp = (e) => {
    if (e.key === "Enter" && e.target.value) {
      // const ser = categoryLists.filter(item => item.folderName === searchValue)
      // setCategoryLists(ser)
      // selectCategory(ser[0])
    } else {
      // setCategoryLists(initCategory)
    }
  }
  const onSearchBlur = () => {
    setIsSearch(false);
  }
  const onSearchFocus = () => {
    setIsSearch(true);
  }
  const memoDetail = (
    <div key={currentMemoDetail.id}>
      {/* 富文本编辑器👖 */}
      <Editor
        ref={quillRef}
        defaultValue={currentMemoDetail.contentDetail}
        onTextChange={handleTextChange}
      />
    </div>
  )


  return (
    <>
      <div className='overflow-auto grow'>
        <div className='flex justify-between items-center bg-zinc-100 p-4'>
          <div className={`p-1.5 text-slate-700 ${snapshot.currentCategoryId && currentMemoDetail.contentDetail !== '' ? 'cursor-pointer' : ' pointer-events-none cursor-not-allowed text-slate-300'}`} onClick={addContent}>
            <SvgIcon name='edit' className="h-6 w-6 " />
          </div>
          <div className='flex'>
            <div className='p-1.5 mr-2 h-6 w-6 text-slate-700' >
              <SvgIcon name='textformat' className="h-6 w-6 " />
            </div>
            <div className='p-1.5  mr-2' >
              <SvgIcon name='checklist' className="h-6 w-6 " />
            </div>
            <div className='p-1.5  mr-2'>
              <SvgIcon name='tablecells' className="h-6 w-6 " />
            </div>
            <div className='p-1.5  mr-2'>
              <SvgIcon name='photo' className="h-6 w-6 " />
            </div>
          </div>

          <div className='flex'>
            <div className='p-1.5  mr-2'>
              <SvgIcon name='share' className={`h-6 w-6 text-slate-700 ${snapshot.currentCategoryId ? 'cursor-pointer' : 'cursor-not-allowed pointer-events-none'}`} />
            </div>
            <div className={`flex items-center p-1.5 bg-white rounded-md ${isSearch && 'outline outline-3 outline-orange-200'}`}>
              <div className='px-1'>
                <SvgIcon name='search' className={`h-4 w-4 text-slate-700 ${snapshot.currentCategoryId ? 'cursor-pointer' : 'cursor-not-allowed pointer-events-none'}`} />
              </div>
              <input
                ref={searchInputRef}
                className="pl-2 w-64 outline-none"
                type="text"
                placeholder="搜索"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onBlur={onSearchBlur}
                onFocus={onSearchFocus}
                onKeyUp={onSearchKeyUp}
              />
            </div>
          </div>
        </div>

        {/* <button className='text-2xl' onClick={removeMemo}>🗑️</button> */}
        <div className='p-4'>
          {snapshot.currentMemoId && memoDetail}
        </div>
      </div >
    </>
  )
}
export default ContentDetail