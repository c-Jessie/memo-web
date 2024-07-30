import { proxy, subscribe } from "valtio";
import { categories, memories } from "./api/data";
// 1 创建一个状态对象并初始化
const valtioState = proxy({
  categories,
  memories,
  searchMemories: memories,
  currentCategoryId: "0",
  currentMemoId: null,
  searchValue: "",
});
const storedData = localStorage.getItem("myValtioData");
if (storedData) {
  // 2 判断是否需要初始化  如果本地存储中有数据，就使用本地存储的数据
  Object.assign(valtioState, JSON.parse(storedData));
}
// 3 订阅Valtio状态更改并进行更改  如果本地存储中没有数据，就使用默认数据
subscribe(valtioState, () => {
  localStorage.setItem("myValtioData", JSON.stringify(valtioState));
});
export { valtioState };
