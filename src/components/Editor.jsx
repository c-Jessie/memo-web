import { forwardRef, useEffect, useLayoutEffect, useRef } from "react"; // 导入 React 的钩子
import Quill from 'quill'; // 导入 Quill.js 库
import 'quill/dist/quill.snow.css'; // 导入 Quill 的默认主题样式

// 使用 forwardRef 创建一个引用的 React 组件
const Editor = forwardRef(({ defaultValue, onTextChange, onEditorBlur }, ref) => {
  // 创建一个引用，用于访问 DOM 元素
  const containerRef = useRef(null);
  // 使用 useRef 钩子来保存 defaultValue 和回调函数
  const defaultValueRef = useRef(defaultValue);
  const onTextChangeRef = useRef(onTextChange);

  // 使用 useLayoutEffect 钩子来同步更新回调函数引用
  useLayoutEffect(() => {
    onTextChangeRef.current = onTextChange;
  }, [onTextChange]);

  // 使用 useEffect 钩子来处理 Quill 编辑器的初始化和清理
  useEffect(() => {
    const container = containerRef.current; // 获取 DOM 容器
    // 创建一个新的 div 元素作为 Quill 编辑器的容器，并添加到 DOM 中
    const editorContainer = container.appendChild(container.ownerDocument.createElement("div"));
    // 初始化 Quill 编辑器
    const quill = new Quill(editorContainer, {
      placeholder: '请输入...', // 编辑器的占位符文本
      theme: "snow", // 使用 'snow' 主题
    });
    // 将 Quill 实例通过 ref 传递给父组件
    ref.current = quill;
    // 如果存在默认值，则设置编辑器的初始内容
    if (defaultValueRef.current) {
      quill.setContents(JSON.parse(defaultValueRef.current).ops);
    }
    quill.setSelection(quill.getLength());
    // 监听 'text-change' 事件，当用户修改内容时更新 onTextChange 回调
    quill.on('text-change', (delta, oldDelta, source) => {
      if (source === Quill.sources.USER) {
        onTextChange(quill.getContents());
      }
    });
    // 失焦
    quill.on('selection-change', (range, oldRange, source) => {
      if (range === null && source === 'user') {
        onEditorBlur(quill);
      }
    });
    // 组件卸载时的清理逻辑
    return () => {
      quill.off('text-change');
      quill.off('selection-change');
      ref.current = null; // 清除 ref 的引用
      container.innerHTML = ""; // 清空容器内容
      quill.disable(); // 禁用 Quill 编辑器
    };
  }, [ref]); // 依赖项数组，当 ref 变化时重新运行 effect

  // 渲染一个包含引用的 div 元素
  return <div ref={containerRef} className='h-screen'></div>;
});

// 设置组件的显示名称，便于调试
Editor.displayName = "Editor";

// 导出 Editor 组件
export default Editor;