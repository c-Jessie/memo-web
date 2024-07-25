import { useState, useRef } from "react";
import SvgIcon from "@/components/SvgIcon";
// import CheckList from "./components/CheckList";
import { useSnapshot } from "valtio";
import { valtioState } from "@/state";
import { generateRandomString } from '@/utils';
// 简介版：文字加粗&斜体功能
function ContentDetail() {
  // 添加 isLoading 状态
  const [isLoading, setIsLoading] = useState(false);
  const snapshot = useSnapshot(valtioState);
  const initContent = snapshot.memories
  const initCategory = snapshot.categories;
  const searchInputRef = useRef(null); // 搜索
  const [searchValue, setSearchValue] = useState(''); // 搜索关键字
  const [isSearch, setIsSearch] = useState(false) // 存储当前是否是搜索状态
  // 当前文件夹
  const filterCategory = initCategory.filter(filterItem => filterItem.id === snapshot.currentCategoryId).map(obj => obj.folderName)[0]
  const debounceTimeoutRef = useRef(null); // 使用 useRef 来保存定时器引用
  // 添加内容
  const addContent = async () => {
    setIsLoading(true);
    try {
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
      await simulateAsyncOperation();
      // 更新备忘录列表
      valtioState.memories = [newContent, ...initContent]
      // 当前选中备忘录
      valtioState.currentMemoId = newContent.id
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false); // 停止加载
    }
  };
  const simulateAsyncOperation = () => {
    // 模拟异步操作
    return new Promise((res) => {
      setTimeout(() => {
        res()
      }, 0)
    })
  }
  // 移除当前备忘录
  // const removeMemo = (e) => {
  //   e.stopPropagation()
  //   const reItem = valtioState.memories.filter(item => item.id !== snapshot.currentMemoId)
  //   valtioState.memories = reItem
  //   valtioState.currentMemoId = currentMemos[0].id
  // }
  // 原生编辑当前备忘录
  // 防抖函数，用于延迟更新状态
  const debounceUpdateContent = (newContent) => {
    // 如果定时器已经存在，先清除
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    // 设置新的定时器
    debounceTimeoutRef.current = setTimeout(() => {
      updateContentDetail(newContent);
    }, 500); // 延迟1秒
  };
  // 更新内容详情的状态更新逻辑
  const updateContentDetail = (contentDetail) => {
    // 更新 Valtio 状态，替换当前备忘录的 contentDetail 属性
    // 获取当前时间并转换为ISO 8601格式的字符串
    const now = new Date();
    const updatedMemos = valtioState.memories.map(memo => {
      if (memo.id === snapshot.currentMemoId) {
        return { ...memo, contentDetail, updatedAt: now.toISOString() };
      }
      return memo;
    });
    // 将更新后的记忆列表设置回 Valtio 状态
    valtioState.memories = updatedMemos;
  };
  const onEditText = (e) => {
    debounceUpdateContent(e.target.innerHTML)
  }
  const boldText = () => {
    document.execCommand('bold', false);
  };

  const italicText = () => {
    document.execCommand('italic', false);
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
  const onBlurddd = () => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(debounceTimeoutRef.current);
    selection.removeAllRanges();
    selection.addRange(range);
  };
  // 内容列表
  const currentMemoDetail = snapshot.memories.find(memo => memo.id === snapshot.currentMemoId) || {};
  // 根据当前选中的备忘录渲染内容
  const memoDetail = (
    <div key={currentMemoDetail.id}>
      {/* 原生实现编辑 */}
      {/* <div className='m-4'>
        <button className='mr-2 px-2 border-2 rounded-md' onClick={boldText}>加粗</button>
        <button className='px-2 border-2 rounded-md' onClick={italicText}>斜体</button>
      </div> */}
      <div
        ref={debounceTimeoutRef}
        className='h-60 p-4  outline-dashed'
        contentEditable
        onInput={onEditText}
        onBlur={onBlurddd}
        dangerouslySetInnerHTML={{ __html: currentMemoDetail.contentDetail }}>
      </div>
    </div>
  )


  return (
    <>
      <div className='overflow-auto grow'>
        {/* <div>内容功能：文本、清单、表格、图片</div> */}
        {/* 文本：
        <div className='font-bold'>加粗</div>
        <div className='italic'>斜体</div>
        <div className='underline underline-offset-1'>划线</div> */}
        {/* 核对清单：
        <CheckList /> */}
        <div className='flex justify-between items-center bg-zinc-100 p-4'>
          <div className={`p-1.5 text-slate-700 ${snapshot.currentCategoryId ? 'cursor-pointer' : 'cursor-not-allowed pointer-events-none'}`} onClick={addContent}>
            <SvgIcon name='edit' className="h-6 w-6 " />
          </div>
          <div className='flex'>
            <div className='p-1.5 mr-2 h-6 w-6 text-slate-700' onClick={boldText}>
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
      </div>
    </>
  )
}
export default ContentDetail