export function generateRandomString() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export function getTimeDisplay(givenTime) {
  // 获取当前时间的时间戳（毫秒）
  const now = Date.now();

  // 解析给定的时间戳
  const then = new Date(givenTime);

  // 计算时间差（毫秒）
  const timeDifference = now - then.getTime();

  // 转换时间差为小时
  const hoursDifference = timeDifference / (1000 * 3600);

  // 根据时间差决定显示日期或时间
  if (hoursDifference > 24) {
    // 超过24小时，显示日期
    return then.toISOString().substring(0, 10); // YYYY-MM-DD
  } else {
    // 未超过24小时，显示时间
    return then.toLocaleTimeString();
  }
}
