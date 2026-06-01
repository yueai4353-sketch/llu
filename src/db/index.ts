import Dexie, { type Table } from 'dexie';

export interface ChatMessage {
  id?: number;
  contactId: string;
  fullTimestamp: number;
  text: string;
  isMe: boolean;
}

export interface AppSetting {
  key: string;
  value: any;
}

export class ChatDatabase extends Dexie {
  messages!: Table<ChatMessage>;
  appSettings!: Table<AppSetting, string>;

  constructor() {
    super('WeChatSimulator');
    this.version(2).stores({
      messages: '++id, contactId, fullTimestamp, [contactId+fullTimestamp]',
      appSettings: 'key'
    });
  }
}

// ===== 聊天消息数据库 =====
export const DexieChatDB = new ChatDatabase();

// 统一使用 IndexedDB (Dexie)
export const ChatDB = DexieChatDB;
export const AppDB = DexieChatDB; // Alias for compatibility
export const ChatDBReady = DexieChatDB.open().then(() => {
  console.log('✅ ChatDB 初始化成功');
  return true;
}).catch(error => {
  console.error('❌ ChatDB 初始化失败:', error);
  return false;
});

// 导出到全局
if (typeof window !== 'undefined') {
  (window as any).ChatDB = ChatDB;
  (window as any).AppDB = AppDB;
  (window as any).ChatDBReady = ChatDBReady;
  (window as any).DexieChatDB = DexieChatDB;
}
