import { useEffect, useState, useRef } from "react";
import { useSnapshot } from "valtio";
import { valtioState } from "@/state";
import { generateRandomString } from '@/utils';
import SvgIcon from "@/components/SvgIcon";
// import sidebarLeftIcon from '@/assets/icons/sidebarleft.svg';
// import 'vite-plugin-svg-icons/register'; // 必须在引入图标前引入

function SideMenu() {
  const snapshot = useSnapshot(valtioState);
  const initCategory = snapshot.categories;
  const initMemo = snapshot.memories;
  // useEffect(() => {
  //   // 处理input没对焦问题-- 方法1
  //   if (addInputRef.current) {
  //     addInputRef.current.focus();
  //   }
  // }, [isAdd]);

  const [categoryLists, setCategoryLists] = useState(initCategory)
  const [isAdd, setIsAdd] = useState(false) // 存储当前是否是新增状态
  const [isSearch, setIsSearch] = useState(false) // 存储当前是否是搜索状态
  const [newFolderName, setNewFolderName] = useState(''); // 存储当前新增文件夹名称
  const [searchValue, setSearchValue] = useState(''); // 搜索关键字
  const addInputRef = useRef(null); // 新增
  const searchInputRef = useRef(null); // 搜索
  // 新增
  const addCategory = () => {
    valtioState.currentCategoryId = ''
    valtioState.currentMemoId = ''
    setIsAdd(!isAdd);
    // 处理input没对焦问题 -- 方法2
    setTimeout(() => {
      addInputRef.current.focus();
    }, 0);
  };
  const onAddInputBlur = (e) => {
    setIsAdd(false);
    if (!e.target.value) {
      setNewFolderName('')
    }
  };
  const onAddInputKeyUp = (e) => {
    if (e.key === "Enter" && e.target.value) {
      const isRename = initCategory.map(item => item.folderName === e.target.value).some(item => item === true);
      if (!isRename) {
        const newCategory = {
          id: generateRandomString(),
          folderName: e.target.value,
          icon: '📁',
          total: 0
        };
        setCategoryLists([newCategory, ...initCategory])
        valtioState.categories = [newCategory, ...initCategory]
        valtioState.currentCategoryId = valtioState.categories[0].id
        setIsAdd(false);
        setNewFolderName('')
      } else {
        setIsAdd(true);
        alert('不能重复命名哦～')
      }
    }
  };
  // 删除
  const removeCat = (e, items) => {
    e.stopPropagation()
    const delCat = initCategory.filter(lists => lists.id !== items.id)
    const delMemo = initMemo.filter(lists => lists.categoryId !== items.id)
    valtioState.categories = delCat
    valtioState.memories = delMemo
    setCategoryLists(delCat)
    if (delCat.length > 0) {
      valtioState.currentCategoryId = valtioState.categories[0].id
    } else {
      valtioState.currentCategoryId = ''
      valtioState.currentMemoId = ''
    }
  }
  // 搜索
  const onSearchKeyUp = (e) => {
    if (e.key === "Enter" && e.target.value) {
      const ser = categoryLists.filter(item => item.folderName === searchValue)
      setCategoryLists(ser)
      selectCategory(ser[0])
    } else {
      setCategoryLists(initCategory)
    }
  }
  const onSearchBlur = () => {
    setIsSearch(false);
  }
  const onSearchFocus = () => {
    setIsSearch(true);
  }

  // 编辑
  const [isEdit, setIsEdit] = useState(false) // 存储当前是否是编辑状态
  const [editIndex, setEditIndex] = useState(-1); // 存储当前编辑项的索引
  const [editedFolderName, setEditedFolderName] = useState(''); // 存储正在编辑的文件夹名称
  // 编辑项的函数
  const startEdit = (e, index) => {
    e.stopPropagation()
    const itemToEdit = categoryLists[index];
    setEditIndex(index);
    setIsEdit(true);
    setEditedFolderName(itemToEdit.folderName); // 设置正在编辑的文件夹名称
    // 处理input没对焦问题 -- 方法2
    setTimeout(() => {
      addInputRef.current.focus();
    }, 0);
  };
  const onEditInputKeyUp = (e) => {
    if (e.key === "Enter") {
      const isRename = initCategory.map(item => item.folderName === e.target.value).some(item => item === true);
      if (!isRename) {
        finishEdit()
      } else {
        // setEditedFolderName(''); // 取消编辑并清空输入框
        setIsAdd(true);
        alert('不能重复命名哦～')
      }
    } else if (e.key === "Escape") {
      setIsEdit(false);
      setEditedFolderName(''); // 取消编辑并清空输入框
    }
  };
  const finishEdit = () => {
    if (editedFolderName.trim() && editIndex !== -1) {
      const updatedCategory = valtioState.categories.map((item, idx) => {
        if (idx === editIndex) {
          return { ...item, folderName: editedFolderName };
        }
        return item;
      });
      valtioState.categories = updatedCategory
      setCategoryLists(updatedCategory)
    }

    setIsEdit(false);
    setEditIndex(-1); // 重置编辑索引
  };
  const selectCategory = (items) => {
    valtioState.currentCategoryId = items.id
    const newMemo = initMemo.filter(
      filterMemo => filterMemo.category === items.folderName
    )
    if (newMemo.length > 0) {
      valtioState.currentMemoId = newMemo[0].id
    } else {
      valtioState.currentMemoId = null
    }

  }
  // 文件夹列表
  const folderItems = categoryLists.map((items, index) =>
    <div
      key={items.id}
      className={`p-3 mb-2.5 rounded-md flex justify-between cursor-default  ${items.id === snapshot.currentCategoryId && 'bg-neutral-300'}`}
      onClick={() => selectCategory(items)}>
      <div className=''>
        {isEdit && editIndex === index ? (
          <input
            ref={addInputRef}
            className="pl-2 w-36"
            type="text"
            value={editedFolderName}
            onChange={(e) => setEditedFolderName(e.target.value)}
            onBlur={finishEdit}
            onKeyUp={onEditInputKeyUp}
          />
        ) : (
          <div className='flex items-center'>
            {/* <span className='pr-2'>{items.icon}</span> */}
            <SvgIcon name='folder' className='h-6 w-6 mr-2 text-amber-500' />
            <div className='truncate w-20'>{items.folderName}</div>
          </div>
        )}
      </div>
      <div className='flex'>
        <div className='text-neutral-500'>{
          initMemo.filter(total => total.category === items.folderName).length
        }</div>
        {!(editIndex === index) && (
          <button className="ml-3 text-neutral-400" onClick={(e) => startEdit(e, index)}>✏️</button>
        )}
        <button className={`ml-3 text-neutral-400 ${editIndex === index && 'hidden'}`} onClick={(e) => removeCat(e, items)}>🗑️</button>
      </div>
    </div >
  );
  // 排序
  // function onSort() {
  //   const nextList = [...category];
  //   nextList.reverse();
  //   setCategory(nextList);
  // }
  return (
    <>
      <div className='bg-neutral-200 flex-none overflow-auto px-4 w-64 h-screen py-5 border-r-[1px] border-l-black' >
        {/* <button onClick={onSort}> 翻转 </button> */}

        {/* <div className=''>
          <span >{isSearch ? '👀' : '🔍'}</span>
          <input
            ref={searchInputRef}
            className="pl-2 mb-2.5 w-36 outline-none"
            type="text"
            placeholder="搜索分类"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onBlur={onSearchBlur}
            onFocus={onSearchFocus}
            onKeyUp={onSearchKeyUp}
          />
        </div> */}
        <div className='flex items-center mb-6'>
          <div className='w-4 h-4 mr-2 rounded-full bg-rose-500'></div>
          <div className='w-4 h-4 mr-2 rounded-full bg-yellow-500'></div>
          <div className='w-4 h-4 mr-20 rounded-full bg-green-500'></div>
          <SvgIcon name='sidebarleft' className='h-7 w-7 text-slate-700' />
        </div>

        <div className='flex items-center text-slate-600 mb-6' >
          {/* <span className='pr-2'>➕</span> */}
          <SvgIcon name='pluscircle' className='h-5 w-5 mr-2' />
          {
            isAdd ?
              (
                <input
                  ref={addInputRef}
                  className="pl-2 w-40"
                  type="text"
                  placeholder="请输入文件名"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={onAddInputBlur}
                  onKeyUp={onAddInputKeyUp}
                />
              ) :
              (<button onClick={addCategory}>新建文件夹</button>)
          }
        </div>
        <div className='h-full'>
          {
            categoryLists.length > 0 ?
              folderItems :
              <div className='px-4 py-4 text-slate-400'>无备忘录</div>
          }
        </div>
      </div >
    </>
  )
}

export default SideMenu
