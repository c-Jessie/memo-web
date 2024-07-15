import { useState, useEffect, useCallback } from 'react';

const Inspirational = () => {
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [loading, setLoading] = useState(false); // 新增加载状态

  // 使用 useCallback 钩子来避免在每次渲染时都创建一个新的函数
  const nextQuote = useCallback(async () => {
    setLoading(true);
    try {
      // 假设 fetchQuote 是一个获取新引用的异步函数
      const newQuote = await fetchQuote();
      setQuote(newQuote);
    } catch (error) {
      console.error('Failed to fetch new quote:', error);
    } finally {
      setLoading(false);
    }
  }, []); // 空依赖数组意味着这个回调只会在组件挂载时创建一次

  // 模拟 fetchQuote 异步函数
  const fetchQuote = async () => {
    const response = await fetch('https://type.fit/api/quotes');
    const data = await response.json();
    const randomQuote = data[Math.floor(Math.random() * data.length)];
    return randomQuote;
  };
  useEffect(() => {
    // 初始加载
    // nextQuote();
  }, []); // 空依赖数组意味着这个 effect 只会在组件挂载时运行一次
  // 切换背景颜色
  const [isDark, setIsDark] = useState(false)
  const changeTheme = () => { setIsDark(!isDark) }
  return (
    <div className={`p-8 max-w-xl mx-auto rounded-lg shadow-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <div className="font-bold text-3xl mb-4 flex justify-between">
        <div className="text-center" onClick={changeTheme} style={{ cursor: 'pointer' }}>
          {!isDark ? '🌞' : '🌛'}每日一句
        </div>
        <span className='cursor-pointer' onClick={nextQuote}>🔄</span>
      </div>
      {loading ? (
        <p className="text-xl font-serif mb-4">加载中...</p>
      ) : (
        <>
          <p className="text-xl font-serif mb-4">{quote.text}</p>
          <p className="">- {quote.author}</p>
        </>
      )}
    </div>
  );
};

export default Inspirational;