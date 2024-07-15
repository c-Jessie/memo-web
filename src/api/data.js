// 文件夹
import { generateRandomString } from "../utils";
export const categories = [
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
    contentDetail: "牛奶, 面包, 鸡蛋, 苹果",
    createdAt: 1720368000000,
    updatedAt: 1720368000000,
    reminders: [
      { id: "reminder-1", time: "2024-07-10T18:00:00Z", isCompleted: false },
    ],
    isCompleted: false,
    attachments: ["/path/to/image1.jpg", "/path/to/document1.pdf"],
    category: "日常",
    categoryId: categories[1].id,
  },
  {
    id: generateRandomString(),
    title: "购物清单22",
    contentDetail: "牛奶222",
    createdAt: 1720368000000,
    updatedAt: 1720368000000,
    reminders: [
      { id: "reminder-1", time: "2024-07-10T18:00:00Z", isCompleted: false },
    ],
    isCompleted: false,
    attachments: ["/path/to/image1.jpg", "/path/to/document1.pdf"],
    category: "日常",
    categoryId: categories[1].id,
  },
  {
    id: generateRandomString(),
    title: "工作会议",
    contentDetail: "准备项目报告，讨论预算。",
    createdAt: 1720454400000,
    updatedAt: 1720454400000,
    reminders: [
      { id: "reminder-2", time: "2024-07-10T09:00:00Z", isCompleted: false },
    ],
    isCompleted: false,
    attachments: ["/path/to/presentation.pptx"],
    category: "工作",
    categoryId: categories[0].id,
  },
  {
    id: generateRandomString(),
    title: "新准备",
    contentDetail: "",
    createdAt: 1720368000000,
    updatedAt: 1720368000000,
    reminders: [
      { id: "reminder-2", time: "2024-07-10T09:00:00Z", isCompleted: false },
    ],
    isCompleted: false,
    attachments: ["/path/to/presentation.pptx"],
    category: "工作",
    categoryId: categories[0].id,
  },
];
