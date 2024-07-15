import { useState, useRef } from "react";
// import CheckList from "./components/CheckList";
import { useSnapshot } from "valtio";
import { valtioState } from "../state";

function ContentDetail() {
  const snapshot = useSnapshot(valtioState);
  const currentMemos = snapshot.memories.filter(item => item.categoryId === snapshot.currentCategoryId)
  const debounceTimeoutRef = useRef(null); // 使用 useRef 来保存定时器引用
  // 移除当前备忘录
  const removeMemo = (e) => {
    e.stopPropagation()
    const reItem = valtioState.memories.filter(item => item.id !== snapshot.currentMemoId)
    valtioState.memories = reItem
    valtioState.currentMemoId = currentMemos[0].id
  }
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
    }, 100); // 延迟1秒
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
  // 内容列表
  const currentMemoDetail = snapshot.memories.find(memo => memo.id === snapshot.currentMemoId) || {};
  // 根据当前选中的备忘录渲染内容
  const contentDetail = (
    <div key={currentMemoDetail.id}>
      {/* 原生实现编辑 */}
      <div className='m-4'>
        <button className='mr-2 px-2 border-2 rounded-md' onClick={boldText}>加粗</button>
        <button className='px-2 border-2 rounded-md' onClick={italicText}>斜体</button>
      </div>
      <div
        ref={debounceTimeoutRef}
        className='h-60 p-4  outline-dashed'
        contentEditable
        onInput={onEditText}
        dangerouslySetInnerHTML={{ __html: currentMemoDetail.contentDetail }}>
      </div>
      {/* {currentMemoDetail.contentDetail ? (
        <div className="truncate">{currentMemoDetail.contentDetail}</div>
      ) : (
        <div className="text-neutral-500">暂无内容</div>
      )} */}
    </div>
  )


  return (
    <>
      <div className='overflow-auto grow p-4'>
        {/* <div>内容功能：文本、清单、表格、图片</div> */}
        {/* 文本：
        <div className='font-bold'>加粗</div>
        <div className='italic'>斜体</div>
        <div className='underline underline-offset-1'>划线</div> */}
        {/* 核对清单：
        <CheckList /> */}
        <button className='text-2xl' onClick={removeMemo}>🗑️</button>
        <hr />
        {contentDetail}
      </div>
    </>
  )
}
export default ContentDetail