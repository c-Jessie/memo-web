import { useState, useRef, useEffect } from "react";
import { useSnapshot } from "valtio";
import { valtioState } from "@/state";
import { generateRandomString } from '@/utils';
import SvgIcon from "@/components/SvgIcon";

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
  const [newFolderName, setNewFolderName] = useState(''); // 存储当前新增文件夹名称
  const addInputRef = useRef(null); // 新增
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
        const insertAt = 1; // 可能是任何索引

        const nextArtists = [
          // 插入点之前的元素：
          ...initCategory.slice(0, insertAt),
          // 新的元素：
          newCategory,
          // 插入点之后的元素：
          ...initCategory.slice(insertAt)
        ];
        setCategoryLists(nextArtists)
        valtioState.categories = nextArtists
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
  const onBlur = () => {
    setIsEdit(false);
    setEditIndex(-1); // 重置编辑索引
  }
  const selectCategory = (items) => {
    valtioState.currentCategoryId = items.id
    valtioState.searchValue = ''
    const newMemo = initMemo.filter(
      filterMemo => filterMemo.categoryId === items.id
    )
    if (newMemo.length > 0) {
      if (items.id !== '0') {
        if (newMemo.length > 0) {
          valtioState.currentMemoId = newMemo[0].id
        } else {
          valtioState.currentMemoId = null
        }
      } else {
        valtioState.currentMemoId = initMemo[0].id
      }
    }
  }
  useEffect(() => {
    if (snapshot.currentCategoryId === '0' && initMemo.length > 0) {
      valtioState.currentMemoId = initMemo[0].id
    }
  }, [snapshot.currentCategoryId])
  // 全部数据

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
            onBlur={onBlur}
            onKeyUp={onEditInputKeyUp}
          />
        ) : (
          <div className='flex items-center'>
            <SvgIcon name='folder' className='h-6 w-6 mr-2 text-amber-500' />
            <div className='truncate w-20'>{items.folderName}</div>
          </div>
        )}
      </div>
      <div className='flex'>
        <div className='text-neutral-500'>{
          items.id === '0' ?
            initMemo.length :
            initMemo.filter(total => total.categoryId === items.id).length
        }</div>
        <div className={` ${items.id === '0' && 'hidden'}`}>
          {!(editIndex === index) && (
            <button className="ml-3 text-neutral-400" onClick={(e) => startEdit(e, index)}>✏️</button>
          )}
          <button className={`ml-3 text-neutral-400 ${editIndex === index && 'hidden'}`} onClick={(e) => removeCat(e, items)}>🗑️</button>
        </div>
      </div>
    </div >
  );
  return (
    <>
      <div className={`w-64 flex-none overflow-auto px-4 py-5 bg-neutral-200 border-r-[1px] border-l-black ${!snapshot.showMenuStatue && 'hidden'}`} >
        <div className='bg-neutral-200 sticky top-0'>
          <div className='flex items-center mb-6' >
            <div className='w-4 h-4 mr-2 rounded-full bg-rose-500'></div>
            <div className='w-4 h-4 mr-2 rounded-full bg-yellow-500'></div>
            <div className='w-4 h-4 mr-20 rounded-full bg-green-500'></div>
            <div className={`cursor-pointer ${!snapshot.showMenuStatue && 'hidden'}`} onClick={() => valtioState.showMenuStatue = false}>
              <SvgIcon name='sidebarleft' className='h-6 w-6 text-slate-700' />
            </div>
          </div>

          <div className='flex items-center text-slate-600 mb-6' >
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
        </div>

        <div className=''>
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
