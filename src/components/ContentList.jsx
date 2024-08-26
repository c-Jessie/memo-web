import { useEffect, useState, useRef } from "react";
import SvgIcon from "@/components/SvgIcon";
import { useSnapshot } from "valtio";
import { valtioState } from "@/state";
import { getTimeDisplay } from '@/utils';
function ContentList() {
  // 添加 isLoading 状态
  const [isLoading, setIsLoading] = useState(false);
  const snapshot = useSnapshot(valtioState);
  const initSearch = snapshot.searchMemories
  const initContent = snapshot.memories
  const rename = useRef(null) //重命名
  const [allMemo, setAllMemo] = useState(initContent)
  const [renameVal, setRenameVal] = useState('')
  const [isRename, setIsRename] = useState(false)
  const [editId, setEditId] = useState(-1)
  const [showMenu, setShowMenu] = useState(valtioState.showMenuStatue); // 菜单显示状态
  // 当前备忘录
  const filterContent = initContent.filter(filterItem => filterItem.categoryId === snapshot.currentCategoryId)
  // 重命名
  const setMemoName = (e, item) => {
    setIsRename(!isRename)
    setEditId(item.id)
    setRenameVal(item.title)
    setTimeout(() => {
      rename.current.focus();
    }, 0);
  }
  const onKeyUp = (e) => {
    if (e.key === "Enter") {
      const updatedMemo = valtioState.memories.map((item) => {
        if (item.id === editId) {
          return { ...item, title: renameVal }
        }
        return item
      })
      valtioState.memories = updatedMemo
      // setRenameVal(e.target.value)
      setIsRename(false);
      setEditId(-1);

    }
  }
  const onBlur = () => {
    setIsRename(!isRename)
  }
  // 移除当前备忘录
  const removeMemo = (e) => {
    e.stopPropagation()
    // 查找当前备忘录 ID 在 allMemo 中的索引
    const currentIndex = allMemo.findIndex(item => item.id === snapshot.currentMemoId);
    const reItem = allMemo.filter(item => item.id !== snapshot.currentMemoId)
    // 过滤掉要移除的备忘录项
    valtioState.memories = valtioState.memories.filter(item => item.id !== snapshot.currentMemoId)
    setAllMemo(reItem); // 更新状态
    if (currentIndex !== -1) {
      // 获取下一项的索引
      const nextIndex = currentIndex + 1;
      // 如果存在下一项，更新 currentMemoId
      if (nextIndex < allMemo.length) {
        valtioState.currentMemoId = allMemo[nextIndex].id;
      } else {
        // 如果没有下一项，可能需要将 currentMemoId 设置为前一项的 ID 或者清空
        if (nextIndex > 0) {
          valtioState.currentMemoId = allMemo[nextIndex - 2]?.id;
        } else {
          valtioState.currentMemoId = null;
        }
      }
    }
  }
  const deltaToPlainText = (delta) => {
    let text = '';
    const newO = JSON.parse(delta).ops
    newO.forEach(op => {
      if (op.insert) {
        text += op.insert;
      }
    });
    return text;
  }
  useEffect(() => {
    const newList = snapshot.memories.filter(item => item.categoryId === valtioState.currentCategoryId)
    setAllMemo(newList)
  }, [snapshot.memories])
  useEffect(() => {
    if (snapshot.searchValue) {
      const searchLists = valtioState.memories.filter(item => item.title.includes(snapshot.searchValue) || item.contentDetail.includes(snapshot.searchValue))
      valtioState.searchMemories = searchLists
      valtioState.currentMemoId = searchLists.length > 0 ? searchLists[0].id : null
      valtioState.currentCategoryId = searchLists.length > 0 ? searchLists[0].categoryId : null
      setAllMemo(searchLists)
    } else {
      // valtioState.currentCategoryId = '0'
      // valtioState.searchMemories = initContent
      if (snapshot.currentCategoryId !== '0') {
        setAllMemo(filterContent)
        valtioState.searchMemories = filterContent
      } else {
        setAllMemo(initContent)
        valtioState.searchMemories = initContent
      }
    }
  }, [snapshot.searchValue, snapshot.currentCategoryId, snapshot.currentMemoId])

  // 内容列表
  const contentItems =
    allMemo.length === 0 ?
      <div className='py-3 px-4 text-center text-neutral-500 text-3xl'>{'无备忘录'}</div> :
      allMemo.map((items, index) =>
        <div
          key={items.id}
          onClick={() => valtioState.currentMemoId = items.id}
          className={`py-3 px-4 cursor-default ${items.id === snapshot.currentMemoId ? 'bg-amber-200  rounded-md border-0' : 'border-b'}`}>
          <div onDoubleClick={(e) => setMemoName(e, items)}>
            {
              isRename && editId === items.id ?
                <input
                  ref={rename}
                  className="pl-2 w-40"
                  type="text"
                  value={renameVal}
                  onChange={(e) => setRenameVal(e.target.value)}
                  onBlur={onBlur}
                  onKeyUp={(e) => onKeyUp(e)}
                /> :
                <div className='truncate w-60 font-bold' >{items.title}</div>
            }
          </div>
          <div className='w-60 flex'>
            <span className='mr-1'>{getTimeDisplay(items.updatedAt)}</span>
            {
              items.contentDetail ?
                <div className='truncate text-neutral-500'>{deltaToPlainText(items.contentDetail)}</div> :
                <div className=' text-neutral-500'>暂无内容</div>
            }
          </div>
        </div>
      )

  return (
    <>
      <div className={`w-80 flex-none overflow-hidden`}>
        <div className='flex justify-between items-center p-4 bg-zinc-100 sticky top-0'>
          <div className='flex items-centers'>
            <div className={`cursor-pointer mr-2 p-1.5 rounded-md hover:bg-zinc-200 ${snapshot.showMenuStatue && 'hidden'}`} onClick={() => valtioState.showMenuStatue = true}>
              <SvgIcon name='sidebarleft' className='h-6 w-6 text-slate-700' />
            </div>
            <div className='p-1.5 mr-2 rounded-md hover:bg-zinc-200'>
              <SvgIcon name='listbullet' className='h-6 w-6 text-slate-700 ' />
            </div>
            <div className='p-1.5 mr-2 rounded-md hover:bg-zinc-200'>
              <SvgIcon name='sgrid' className='h-6 w-6 text-slate-700' />
            </div>
          </div>
          {/* <button className='text-2xl' onClick={addContent}>✍️</button> */}
          <div className='p-1.5' onClick={removeMemo}><SvgIcon name='trash' className='h-6 w-6 text-slate-700 cursor-pointer' /></div>
        </div>
        <div className='p-4 border-r overflow-auto h-[60rem]'>
          {isLoading ? '加载中' : contentItems}
        </div>
      </div>
    </>
  )
}
export default ContentList