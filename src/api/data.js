// 文件夹
import { generateRandomString } from "../utils";
export const categories = [
  { id: "0", folderName: "全部备忘录", icon: "😀" },
  {
    id: generateRandomString(),
    folderName: "工作",
    icon: "💼",
  },
  {
    id: generateRandomString(),
    folderName: "日常",
    icon: "🏠",
  },
  {
    id: generateRandomString(),
    folderName: "新建文件夹",
    icon: "📁",
  },
];
// 备忘录
export const memories = [
  {
    id: generateRandomString(),
    title: "购物清单",
    contentDetail: '{"ops":[{"insert":"面包"}]}',
    createdAt: 1720368000000,
    updatedAt: 1720368000000,
    reminders: [
      { id: "reminder-1", time: "2024-07-10T18:00:00Z", isCompleted: false },
    ],
    isCompleted: false,
    attachments: ["/path/to/image1.jpg", "/path/to/document1.pdf"],
    category: "日常",
    categoryId: categories[2].id,
  },
  {
    id: generateRandomString(),
    title: "购物清单2",
    contentDetail: '{"ops":[{"insert":"牛奶"}]}',
    createdAt: 1720368000000,
    updatedAt: 1720368000000,
    reminders: [
      { id: "reminder-1", time: "2024-07-10T18:00:00Z", isCompleted: false },
    ],
    isCompleted: false,
    attachments: ["/path/to/image1.jpg", "/path/to/document1.pdf"],
    category: "日常",
    categoryId: categories[2].id,
  },
  {
    id: generateRandomString(),
    title: "完成的优化任务",
    contentDetail:
      '{"ops":[{"insert":"优化"},{"attributes":{"header":1},"insert":"\\n"},{"insert":"UI还原&引入图标"},{"attributes":{"list":"ordered"},"insert":"\\n"},{"insert":"使用富文本编辑器的库"},{"attributes":{"list":"ordered"},"insert":"\\n"},{"insert":"转到国内浏览"},{"attributes":{"list":"ordered"},"insert":"\\n"}]}',
    createdAt: 1720454400000,
    updatedAt: 1721766871428,
    reminders: [
      { id: "reminder-2", time: "2024-07-10T09:00:00Z", isCompleted: false },
    ],
    isCompleted: false,
    attachments: ["/path/to/presentation.pptx"],
    category: "工作",
    categoryId: categories[1].id,
  },
  {
    id: generateRandomString(),
    title: "新准备",
    contentDetail: '{"ops":[{"insert":"hello"}]}',
    createdAt: 1720368000000,
    updatedAt: 1720368000000,
    reminders: [
      { id: "reminder-2", time: "2024-07-10T09:00:00Z", isCompleted: false },
    ],
    isCompleted: false,
    attachments: ["/path/to/presentation.pptx"],
    category: "工作",
    categoryId: categories[1].id,
  },
];
