import { useState, useRef, useEffect } from "react";
import SvgIcon from "@/components/SvgIcon";
import Editor from './Editor';// 富文本
import { useSnapshot } from "valtio";
import { valtioState } from "@/state";
import { generateRandomString, debounce } from '@/utils';
import html2canvas from 'html2canvas';
function ContentDetail() {
  // 添加 isLoading 状态
  const snapshot = useSnapshot(valtioState);
  const initCategory = snapshot.categories;
  const initContent = snapshot.memories
  const [allMemo, setAllMemo] = useState(initContent);
  const searchInputRef = useRef(null); // 搜索
  const [searchValue, setSearchValue] = useState(''); // 搜索关键字
  const [isSearch, setIsSearch] = useState(false) // 存储当前是否是搜索状态
  // 富文本
  const quillRef = useRef(null);
  // 当前内容
  const currentMemoDetail = allMemo.find(memo => memo.id === snapshot.currentMemoId) || {};
  // 当前文件夹
  const filterCategory = initCategory.filter(filterItem => filterItem.id === snapshot.currentCategoryId).map(obj => obj.folderName)[0]
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
  const onTextChange = (newContent) => {
    const contentToUpdate = JSON.stringify(newContent);
    const updatedMemos = valtioState.memories.map((memo) => {
      if (memo.id === valtioState.currentMemoId) {
        return { ...memo, contentDetail: contentToUpdate, updatedAt: Date.now() };
      }
      return memo;
    });
    valtioState.memories = updatedMemos; // 更新状态
  };
  // 失焦 没有备忘录内容则删掉
  const onEditorBlur = (quill) => {
    const content = quill.getText().trim();
    if (content === "") {
      const updatedMemos = valtioState.memories.filter(memo => memo.id !== valtioState.currentMemoId);
      valtioState.memories = updatedMemos;
      const catNum = updatedMemos.filter(filterItem => filterItem.categoryId === snapshot.currentCategoryId)
      valtioState.currentMemoId = catNum.length > 0 ? catNum[0].id : null;
    }
  };
  // 生成图片
  const handleCapture = () => {
    const element = document.querySelector('.ql-editor');
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${currentMemoDetail.title}.png`;
      link.click();
    });
  };
  // 搜索
  useEffect(() => {
    setSearchValue(snapshot.searchValue)
  }, [snapshot.searchValue])

  const onSearchKeyUp = debounce((e) => {
    e.preventDefault();
    valtioState.searchValue = searchValue
    if (searchValue) {
      valtioState.currentCategoryId = '0'
    }
  }, 0)
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
        onTextChange={onTextChange}
      // onEditorBlur={onEditorBlur}
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
          {/* <div className='flex'>
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
          </div> */}

          <div className='flex'>
            <div onClick={handleCapture} className={`p-1.5  mr-2  ${snapshot.currentMemoId && snapshot.currentCategoryId ? 'cursor-pointer' : 'cursor-not-allowed pointer-events-none'}`} >
              <SvgIcon name='share' className='h-6 w-6 text-slate-700' />
            </div>
            <div className={`flex items-center p-1.5 bg-white rounded-md ${isSearch && 'outline outline-3 outline-orange-200'}`}>
              <div className='px-1'>
                <SvgIcon name='search' className="h-4 w-4 text-slate-700 " />
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
        <div className='p-4'>
          {snapshot.currentMemoId && memoDetail}
        </div>
      </div >
    </>
  )
}
export default ContentDetail