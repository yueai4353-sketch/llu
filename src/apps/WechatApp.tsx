import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Signal, Wifi, Battery, ChevronLeft, ChevronRight, User, MoreHorizontal, Plus, Heart, Send, MessageSquare, Phone, Disc, RefreshCcw, Layout, UserPlus, Users, Tag, Search, Camera, Snowflake, Edit2, CreditCard, X, Globe, Folder, Copy, Trash2, LayoutGrid, CornerUpLeft, ChevronsUpDown } from 'lucide-react';
import { CurrentTime, ToggleSwitch, useCurrentTime } from '../components';
import { AppDB } from '../db';

const ChatSettingsScreen = ({ onBack, friend, onSetRemark, onSetWallpaper }: { onBack: () => void, friend: any, onSetRemark?: (remark: string) => void, onSetWallpaper?: (wp: string) => void, key?: React.Key }) => {
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remarkInput, setRemarkInput] = useState(friend.wechat_remark || '');

  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [wallpaperType, setWallpaperType] = useState<'url' | 'local'>('url');
  const [wallpaperUrl, setWallpaperUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [disableTimePerceive, setDisableTimePerceive] = useState(false);
  const [aiTimezone, setAiTimezone] = useState('跟随用户');
  const currentTime = useCurrentTime();

  useEffect(() => {
    if (friend?.id) {
      AppDB.appSettings.get(`chat_settings_${friend.id}`).then(record => {
        if (record && record.value) {
          setDisableTimePerceive(!!record.value.disableTimeAwareness);
          if (record.value.aiTimezone) {
            setAiTimezone(record.value.aiTimezone);
          }
        }
      });
    }
  }, [friend?.id]);

  const handleToggleTimeAwareness = async (val: boolean) => {
    setDisableTimePerceive(val);
    if (friend?.id) {
      const key = `chat_settings_${friend.id}`;
      let record = await AppDB.appSettings.get(key) || { key, value: {} };
      record.value.disableTimeAwareness = val;
      await AppDB.appSettings.put(record);
    }
  };

  const handleSetTimezone = async (val: string) => {
    setAiTimezone(val);
    if (friend?.id) {
      const key = `chat_settings_${friend.id}`;
      let record = await AppDB.appSettings.get(key) || { key, value: {} };
      record.value.aiTimezone = val;
      await AppDB.appSettings.put(record);
    }
  };

  const getFormattedTimezoneTime = (tz: string) => {
    if (tz === '跟随用户') return '';
    try {
      const date = new Date(currentTime.toLocaleString('en-US', { timeZone: tz }));
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();
      const wds = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const wd = wds[date.getDay()];
      const h = date.getHours().toString().padStart(2, '0');
      const min = date.getMinutes().toString().padStart(2, '0');
      
      return `${y}年${m}月${d}日 ${wd} ${h}:${min}`;
    } catch (e) {
      return '';
    }
  };

  const handleApplyWallpaper = () => {
    if (wallpaperType === 'url') {
      if (onSetWallpaper) onSetWallpaper(wallpaperUrl);
      setShowWallpaperModal(false);
    }
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (onSetWallpaper) onSetWallpaper(result);
        setShowWallpaperModal(false);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <>
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 bg-[#f3f3f3] z-[90] flex flex-col pt-4"
    >
      {/* Status Bar */}
      <div className="flex justify-between items-center px-7 text-[13px] font-medium text-gray-800 shrink-0 bg-white pb-2">
        <div className="flex items-center">
          <CurrentTime />
        </div>
        <div className="flex items-center">
           100%
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center px-4 py-3 shrink-0 bg-white border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-800 active:bg-gray-100 rounded-full transition-colors z-10">
          <ChevronLeft size={24} strokeWidth={2} />
        </button>
        <span className="text-[17px] font-medium text-gray-800 flex-1 text-center -ml-6">
          聊天设置
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col p-3 gap-2">
        <div 
          onClick={() => {
            setRemarkInput(friend.wechat_remark || '');
            setShowRemarkModal(true);
          }}
          className="bg-white border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between px-4 min-h-[60px] active:bg-gray-50 cursor-pointer rounded-[12px]"
        >
          <span className="text-[16px] text-[#333333]">备注</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] text-[#999999]">{friend.wechat_remark || '未设置'}</span>
            <ChevronRight size={18} className="text-[#cccccc]" />
          </div>
        </div>

        <div 
          onClick={() => setShowWallpaperModal(true)}
          className="bg-white border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between px-4 min-h-[60px] active:bg-gray-50 cursor-pointer rounded-[12px]"
        >
          <span className="text-[16px] text-[#333333]">聊天背景</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] text-[#999999]">更换</span>
            <ChevronRight size={18} className="text-[#cccccc]" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-5 flex flex-col rounded-[12px] mt-2">
          <span className="text-[15px] text-[#999999] mb-5 font-medium">AI 时间感知</span>
          
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[16px] text-[#333333] font-medium">停用时间感知</span>
              <ToggleSwitch checked={disableTimePerceive} onChange={handleToggleTimeAwareness} />
            </div>
            <p className="text-[14px] text-[#999999] leading-relaxed tracking-wide">
              开启后 AI 不再感知时间流逝，仅续接上文对话。消息时间戳、定时消息等不受影响。
            </p>
          </div>

          <div className="h-px bg-gray-100 my-6" />

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className={`text-[16px] font-medium ${disableTimePerceive ? 'text-[#cccccc]' : 'text-[#333333]'}`}>AI 所在时区</span>
              <div className="relative">
                <select 
                  value={aiTimezone}
                  onChange={(e) => handleSetTimezone(e.target.value)}
                  disabled={disableTimePerceive}
                  className={`appearance-none border rounded-[8px] px-3 py-1.5 pr-8 text-[15px] outline-none min-w-[120px] transition-colors ${disableTimePerceive ? 'bg-[#f5f5f5] border-[#eeeeee] text-[#cccccc]' : 'bg-white border-gray-200 text-[#333333]'}`}
                >
                  <option value="跟随用户">跟随用户</option>
                  <option value="Asia/Shanghai">中国 (UTC+8)</option>
                  <option value="America/New_York">美东 (UTC-5)</option>
                  <option value="Europe/London">伦敦 (UTC+0)</option>
                  <option value="Asia/Tokyo">日本 (UTC+9)</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronsUpDown size={14} className={disableTimePerceive ? 'text-[#cccccc]' : 'text-[#333333]'} />
                </div>
              </div>
            </div>
            {!disableTimePerceive && (
              <p className="text-[14px] text-[#999999] leading-relaxed tracking-wide">
                设置后 AI 感知所选时区的当地时间，模拟异地生活
                {aiTimezone !== '跟随用户' && (
                  <span className="block text-[#007AFF] mt-1">当前该时区时间: {getFormattedTimezoneTime(aiTimezone)}</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
    
    <AnimatePresence>
      {showRemarkModal && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRemarkModal(false)}
            className="fixed inset-0 bg-black/40 z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: -20, x: '-50%' }}
            className="fixed top-1/2 left-1/2 w-[80%] bg-white rounded-[12px] z-[110] flex flex-col overflow-hidden"
          >
            <div className="p-5 pb-4">
              <div className="text-[17px] font-medium text-gray-900 mb-4">修改备注名</div>
              <input 
                type="text" 
                value={remarkInput}
                onChange={e => setRemarkInput(e.target.value)}
                placeholder="请输入备注名"
                className="w-full h-10 px-0 border-b border-[#07C160] text-[16px] focus:outline-none focus:border-[#07C160] transition-colors"
                autoFocus
              />
            </div>
            
            <div className="flex border-t border-gray-100">
              <button 
                onClick={() => setShowRemarkModal(false)}
                className="flex-1 py-3 text-[16px] font-medium text-gray-900 active:bg-gray-50 transition-colors border-r border-gray-100"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (onSetRemark) onSetRemark(remarkInput);
                  setShowRemarkModal(false);
                }}
                className="flex-1 py-3 text-[16px] font-medium text-[#576B95] active:bg-gray-50 transition-colors"
              >
                确定
              </button>
            </div>
          </motion.div>
        </>
      )}

      {showWallpaperModal && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWallpaperModal(false)}
            className="fixed inset-0 bg-black/40 z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: -20, x: '-50%' }}
            className="fixed top-1/2 left-1/2 w-[84%] bg-white rounded-[20px] z-[110] flex flex-col p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-[17px] font-medium text-gray-800">更换壁纸</span>
              <button onClick={() => setShowWallpaperModal(false)} className="text-gray-400 active:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-4 mb-5">
              <button 
                onClick={() => setWallpaperType('url')}
                className={`flex-1 flex flex-col items-center justify-center py-5 rounded-[12px] border-2 transition-colors ${wallpaperType === 'url' ? 'border-[#07C160]' : 'border-gray-200'}`}
              >
                <Globe size={28} className={wallpaperType === 'url' ? 'text-[#07C160]' : 'text-gray-400'} strokeWidth={1.5} />
                <span className={`text-[14px] font-medium mt-2 leading-tight ${wallpaperType === 'url' ? 'text-[#07C160]' : 'text-gray-500'}`}>网络<br/>URL</span>
              </button>
              <button 
                onClick={() => setWallpaperType('local')}
                className={`flex-1 flex flex-col items-center justify-center py-5 rounded-[12px] border-2 transition-colors ${wallpaperType === 'local' ? 'border-[#07C160]' : 'border-gray-200'}`}
              >
                <Folder size={28} className={wallpaperType === 'local' ? 'text-[#07C160]' : 'text-gray-400'} strokeWidth={1.5} />
                <span className={`text-[14px] font-medium mt-2 leading-tight ${wallpaperType === 'local' ? 'text-[#07C160]' : 'text-gray-500'}`}>本地<br/>文件</span>
              </button>
            </div>

            <div className="min-h-[80px]">
              {wallpaperType === 'url' ? (
                <>
                  <input 
                    type="text" 
                    value={wallpaperUrl}
                    onChange={e => setWallpaperUrl(e.target.value)}
                    placeholder="输入图片URL地址"
                    className="w-full h-11 px-3 border border-gray-200 rounded-[8px] text-[15px] focus:outline-none focus:border-gray-400 transition-colors mb-2"
                  />
                  <div className="text-[12px] text-gray-400">支持 jpg, png, gif, webp 格式</div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center pt-2">
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef}
                    onChange={handleLocalFileChange}
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-[8px] text-[15px] font-medium active:bg-[#f2f2f2] transition-colors shadow-sm"
                  >
                    选择图片文件
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setShowWallpaperModal(false)}
                className="flex-1 py-3 bg-[#f2f2f2] text-gray-800 rounded-[8px] text-[15px] font-medium active:bg-[#e5e5e5] transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleApplyWallpaper}
                disabled={wallpaperType === 'local' || !wallpaperUrl.trim()}
                className={`flex-1 py-3 text-white rounded-[8px] text-[15px] font-medium transition-colors ${wallpaperType === 'local' || !wallpaperUrl.trim() ? 'bg-gray-300' : 'bg-[#333333] active:bg-black'}`}
              >
                应用壁纸
              </button>
            </div>

            <div className="mt-5 text-center">
              <button 
                onClick={() => {
                  if (onSetWallpaper) onSetWallpaper('');
                  setShowWallpaperModal(false);
                }}
                className="text-[13px] text-gray-500 active:text-gray-700"
              >
                恢复默认壁纸
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
};

const ChatScreen = ({ friend, messages, onSendMessage, onBack, onSetRemark }: { friend: any, messages: any[], onSendMessage: (msg: string) => void, onBack: () => void, onSetRemark?: (remark: string) => void }) => {
  const [inputText, setInputText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [actionMenuMsg, setActionMenuMsg] = useState<any | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startLongPress = (msg: any) => {
    longPressTimerRef.current = setTimeout(() => {
      setActionMenuMsg(msg);
    }, 500);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const [chatWallpaper, setChatWallpaper] = useState<string | null>(() => {
    return localStorage.getItem(`wechat_wallpaper_${friend.id}`);
  });

  const handleSetWallpaper = (wp: string) => {
    setChatWallpaper(wp);
    if (wp) {
      localStorage.setItem(`wechat_wallpaper_${friend.id}`, wp);
    } else {
      localStorage.removeItem(`wechat_wallpaper_${friend.id}`);
    }
  };

  const displayFriendName = friend.wechat_remark || friend.name;

  return (
    <>
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 bg-[#ededed] z-[80] flex flex-col pt-4"
      style={chatWallpaper ? { backgroundImage: `url(${chatWallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {/* Status Bar */}
      <div className="flex justify-between items-center px-7 text-[13px] font-medium text-gray-800 shrink-0 bg-[#ededed] pb-2">
        <div className="flex items-center">
          <CurrentTime /> <Moon size={11} className="ml-1 opacity-80" fill="currentColor" strokeWidth={1} />
        </div>
        <div className="flex items-center gap-1.5 opacity-60">
          <Signal size={14} strokeWidth={2.5} />
          <Wifi size={14} strokeWidth={2.5} />
          <Battery size={16} strokeWidth={2} />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-[#ededed]">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-800 active:bg-gray-200 rounded-full transition-colors z-10">
          <ChevronLeft size={24} strokeWidth={2} />
        </button>
        <span className="text-[17px] font-medium text-gray-800 absolute left-1/2 -translate-x-1/2">
          {displayFriendName}
        </span>
        <button onClick={() => setShowSettings(true)} className="p-2 -mr-2 text-gray-800 active:bg-gray-200 rounded-full transition-colors z-10">
          <MoreHorizontal size={24} strokeWidth={2} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="text-center mt-2">
             <span className="text-[12px] text-gray-400"><CurrentTime /></span>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-gray-200 rounded-[6px] flex items-center justify-center overflow-hidden shrink-0 mt-0.5">
               {msg.isMe ? (
                 friend.my_bound_avatar ? <img src={friend.my_bound_avatar} alt="" className="w-full h-full object-cover" /> : <User size={20} className="text-gray-400" />
               ) : (
                 friend.avatar ? <img src={friend.avatar} alt="" className="w-full h-full object-cover" /> : <User size={20} className="text-gray-400" />
               )}
            </div>
            <div 
              className={`max-w-[70%] px-4 py-2.5 rounded-[10px] text-[15px] ${msg.isMe ? 'bg-[#95EC69] text-black' : 'bg-white text-gray-800'} break-words whitespace-pre-wrap select-none cursor-pointer active:brightness-95`}
              onPointerDown={() => startLongPress(msg)}
              onPointerUp={cancelLongPress}
              onPointerLeave={cancelLongPress}
              onPointerCancel={cancelLongPress}
              onContextMenu={(e) => { e.preventDefault(); cancelLongPress(); }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-[#f7f7f7] border-t border-gray-200 px-3 py-2 shrink-0 pb-6 flex items-end gap-3 min-h-[60px]">
        <button className="text-gray-500 p-1 shrink-0 mb-1">
          <div className="w-[26px] h-[26px] rounded-full border-2 border-gray-500 flex items-center justify-center">
            <Plus size={16} strokeWidth={2.5} />
          </div>
        </button>
        <div className="flex-1 min-h-[40px] bg-white rounded-md flex items-center px-3 py-1 border border-gray-200 overflow-hidden mb-1">
          <textarea 
            placeholder="请输入消息..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (inputText.trim()) {
                  onSendMessage(inputText);
                  setInputText('');
                }
              }
            }}
            rows={1}
            style={{ minHeight: '24px', maxHeight: '100px' }}
            className="w-full text-[15px] bg-transparent outline-none resize-none leading-[24px]"
          />
        </div>
        <button className="text-gray-500 shrink-0 mb-1 p-1">
           <Heart size={26} strokeWidth={1.5} />
        </button>
        <button 
           onClick={() => {
             if (inputText.trim()) {
               onSendMessage(inputText);
               setInputText('');
             }
           }}
           className="text-gray-500 shrink-0 mb-1 p-1"
        >
           <Send size={24} strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
    <AnimatePresence>
      {showSettings && (
        <ChatSettingsScreen 
          key="chatSettings" 
          friend={friend} 
          onBack={() => setShowSettings(false)} 
          onSetRemark={(remark) => onSetRemark && onSetRemark(remark)}
          onSetWallpaper={handleSetWallpaper}
        />
      )}
    </AnimatePresence>
    <AnimatePresence>
      {actionMenuMsg && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActionMenuMsg(null)}
            className="fixed inset-0 bg-black/30 z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
            className="fixed bottom-0 left-0 right-0 z-[110] p-3 pb-8"
          >
            <div className="bg-[#f7f7f7] rounded-[14px] overflow-hidden mb-2">
              <button onClick={() => setActionMenuMsg(null)} className="w-full flex items-center justify-center gap-2 py-[15px] border-b border-gray-200/60 active:bg-gray-200/50 bg-white">
                <MessageSquare size={18} className="text-[#333333]" />
                <span className="text-[16px] text-[#333333]">引用</span>
              </button>
              <button 
                onClick={() => {
                  try { navigator.clipboard.writeText(actionMenuMsg.text); } catch(e) {}
                  setActionMenuMsg(null);
                }} 
                className="w-full flex items-center justify-center gap-2 py-[15px] border-b border-gray-200/60 active:bg-gray-200/50 bg-white"
              >
                <Copy size={18} className="text-[#333333]" />
                <span className="text-[16px] text-[#333333]">复制</span>
              </button>
              <button onClick={() => setActionMenuMsg(null)} className="w-full flex items-center justify-center gap-2 py-[15px] border-b border-gray-200/60 active:bg-gray-200/50 bg-white">
                <Edit2 size={18} className="text-[#333333]" />
                <span className="text-[16px] text-[#333333]">编辑</span>
              </button>
              <button onClick={() => setActionMenuMsg(null)} className="w-full flex items-center justify-center gap-2 py-[15px] border-b border-gray-200/60 active:bg-gray-200/50 bg-white">
                <Trash2 size={18} className="text-[#333333]" />
                <span className="text-[16px] text-[#333333]">删除</span>
              </button>
              <button onClick={() => setActionMenuMsg(null)} className="w-full flex items-center justify-center gap-2 py-[15px] active:bg-gray-200/50 bg-white">
                <LayoutGrid size={18} className="text-[#333333]" />
                <span className="text-[16px] text-[#333333]">多选</span>
              </button>
            </div>
            <button 
              onClick={() => setActionMenuMsg(null)}
              className="w-full py-[15px] bg-white rounded-[14px] text-[16px] font-medium text-[#4B79B5] active:bg-gray-100"
            >
              取消
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
};

const FriendProfileScreen = ({ friend, onBack, onSendMessage }: { friend: any; onBack: () => void; onSendMessage?: () => void }) => {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 bg-[#f7f7f7] z-[70] flex flex-col pt-4"
    >
      {/* Status Bar */}
      <div className="flex justify-between items-center px-7 text-[13px] font-medium text-gray-800 shrink-0 bg-[#ededed] pb-2">
        <div className="flex items-center">
          <CurrentTime /> <Moon size={11} className="ml-1 opacity-80" fill="currentColor" strokeWidth={1} />
        </div>
        <div className="flex items-center gap-1.5 opacity-60">
          <Signal size={14} strokeWidth={2.5} />
          <Wifi size={14} strokeWidth={2.5} />
          <Battery size={16} strokeWidth={2} />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-[#ededed] border-b border-gray-200/50">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-800 active:bg-gray-100 rounded-full transition-colors z-10">
          <ChevronLeft size={24} strokeWidth={2} />
        </button>
        <span className="text-[17px] font-medium text-gray-800 absolute left-1/2 -translate-x-1/2">
          详细资料
        </span>
        <button className="p-2 -mr-2 text-gray-800 active:bg-gray-100 rounded-full transition-colors z-10">
          <MoreHorizontal size={24} strokeWidth={2} className="text-[#576b95]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-8 pt-4 px-4 flex flex-col gap-4">
        {/* Top Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm flex items-start gap-4 border border-gray-100">
          <div className="w-[68px] h-[68px] rounded-[10px] bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
            {friend.avatar ? (
              <img src={friend.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-gray-400" />
            )}
          </div>
          <div className="flex flex-col justify-center py-1">
            <span className="text-[20px] font-medium text-gray-800 mb-1">
              {friend.wechat_remark ? `${friend.wechat_remark}（${friend.name}）` : friend.name}
            </span>
            <span className="text-[13px] text-gray-500">微信号：{friend.wechat_id || '未设置'}</span>
            <span className="text-[13px] text-gray-500 mt-0.5">地区：{friend.region || '未设置'}</span>
          </div>
        </div>

        {/* Moments Card */}
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm flex items-center justify-between border border-gray-100 active:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-3">
            <Disc size={20} className="text-gray-700" />
            <span className="text-[15px] text-gray-800">朋友圈</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>

        {/* Actions Cards */}
        <div className="flex gap-3 mt-1">
          <button 
            onClick={onSendMessage}
            className="flex-1 bg-white border border-gray-100 rounded-xl py-4 flex items-center justify-center gap-2 active:bg-gray-50 shadow-sm transition-colors text-[#576B95]"
          >
            <MessageSquare size={20} className="text-[#576B95]" />
            <span className="text-[15px] font-medium">发消息</span>
          </button>
          <button className="flex-1 bg-white border border-gray-100 rounded-xl py-4 flex items-center justify-center gap-2 active:bg-gray-50 shadow-sm transition-colors text-[#576B95]">
            <Phone size={20} className="text-[#576B95]" />
            <span className="text-[15px] font-medium">音视频通话</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const WechatScreen = ({ 
  onBack,
  requests,
  friends,
  chats,
  personas,
  myProfile,
  onSendMessage,
  onAcceptRequest,
  onAddFriend,
  onOpenMyProfile,
  onSetRemark
}: { 
  onBack: () => void;
  requests: any[];
  friends: any[];
  chats: Record<string, any[]>;
  personas: any[];
  myProfile?: any;
  onSendMessage: (friendId: string, text: string, isMe: boolean) => void;
  onAcceptRequest: (id: string) => void;
  onAddFriend: (persona: any) => void;
  onOpenMyProfile?: () => void;
  onSetRemark?: (friendId: string, remark: string) => void;
  key?: React.Key;
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'moments' | 'me'>('chats');
  const [showNewFriends, setShowNewFriends] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
  const [activeChatFriend, setActiveChatFriend] = useState<any | null>(null);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [searchWechatId, setSearchWechatId] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyMessage, setApplyMessage] = useState('我是...');

  // Default my avatar to the first persona's bound avatar, if any
  const myAvatar = personas.find(p => p.my_bound_avatar)?.my_bound_avatar;

  React.useEffect(() => {
    // Navigate to contacts tab explicitly if there are requests when screen loads
    if (requests.length > 0 && activeTab === 'chats') {
      setActiveTab('contacts');
    }
  }, [requests.length]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 15 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 bg-[#fefefe] z-[60] flex flex-col pt-4"
    >
      {/* Status Bar */}
      <div className="flex justify-between items-center px-7 text-[13px] font-medium text-gray-800 shrink-0">
        <div className="flex items-center">
          <CurrentTime /> <Moon size={11} className="ml-1 opacity-80" fill="currentColor" strokeWidth={1} />
        </div>
        <div className="flex items-center gap-1.5 opacity-60">
          <Signal size={14} strokeWidth={2.5} />
          <Wifi size={14} strokeWidth={2.5} />
          <Battery size={16} strokeWidth={2} />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 mt-2 border-b border-gray-100 bg-[#fefefe] relative z-20">
        <button onClick={() => showNewFriends ? setShowNewFriends(false) : onBack()} className="p-2 -ml-2 text-gray-800 active:bg-gray-100 rounded-full transition-colors z-10">
          <ChevronLeft size={24} strokeWidth={2} />
        </button>
        <span className="text-[17px] font-medium text-gray-800 absolute left-1/2 -translate-x-1/2">
          {showNewFriends ? '新的朋友' : activeTab === 'chats' ? '微信' : activeTab === 'contacts' ? '通讯录' : activeTab === 'moments' ? '朋友圈' : '我'}
        </span>
        <div className="flex z-10 relative">
          {!showNewFriends && activeTab === 'moments' && (
             <button className="p-2 text-gray-800 active:bg-gray-100 rounded-full transition-colors mr-1">
               <RefreshCcw size={20} strokeWidth={2} />
             </button>
          )}
          {!showNewFriends && (
            <div className="relative">
              <button onClick={() => setShowPlusMenu(!showPlusMenu)} className="p-2 -mr-2 text-gray-800 active:bg-gray-100 rounded-[10px] transition-colors relative z-20">
                <Plus size={24} strokeWidth={2} />
              </button>
              
              <AnimatePresence>
                {showPlusMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowPlusMenu(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-[44px] w-[140px] bg-[#fdfdfd] rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-100/50 py-1.5 z-50 origin-top-right backdrop-blur-md"
                    >
                      {/* Triangle pointer */}
                      <div className="absolute -top-[5px] right-[16px] w-[10px] h-[10px] bg-[#fdfdfd] border-t border-l border-gray-100/50 rotate-45"></div>
                      
                      <button className="w-full relative z-10 px-4 py-3 flex items-center gap-3 text-gray-800 active:bg-gray-100 transition-colors border-b border-gray-50/50">
                        <Layout size={20} strokeWidth={1.5} className="text-gray-800" />
                        <span className="text-[15px] font-medium">发起群聊</span>
                      </button>
                      <button onClick={() => { setShowPlusMenu(false); setShowAddFriendModal(true); setSearchWechatId(''); setShowApplyModal(false); }} className="w-full relative z-10 px-4 py-3 flex items-center gap-3 text-gray-800 active:bg-gray-100 transition-colors">
                        <UserPlus size={20} strokeWidth={1.5} className="text-gray-800" />
                        <span className="text-[15px] font-medium">添加朋友</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar w-full flex flex-col p-3 pb-8 bg-[#f3f3f3]">
        {activeTab === 'chats' && (
          <div className="flex flex-col gap-2.5">
            {Object.keys(chats).length === 0 ? (
              <div className="py-20 flex items-center justify-center text-gray-400 text-[14px]">
                暂无聊天消息
              </div>
            ) : (
              Object.keys(chats).map(friendId => {
                const friend = friends.find(f => f.id === friendId);
                if (!friend) return null;
                const msgs = chats[friendId];
                const lastMsg = msgs[msgs.length - 1];
                return (
                  <div 
                    key={friendId}
                    onClick={() => setActiveChatFriend(friend)}
                    className="bg-white border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-3 p-3 active:bg-gray-50 cursor-pointer rounded-[16px]"
                  >
                    <div className="w-[52px] h-[52px] bg-gray-100 rounded-[12px] flex items-center justify-center overflow-hidden shrink-0">
                      {friend.avatar ? (
                        <img src={friend.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center flex-1 overflow-hidden pr-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[17px] font-medium text-[#333333] text-ellipsis whitespace-nowrap overflow-hidden pr-2">{friend.wechat_remark || friend.name}</span>
                        <span className="text-[12px] text-gray-400 shrink-0 font-light">
                          {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <span className="text-[13px] text-[#999999] text-ellipsis whitespace-nowrap overflow-hidden font-light">
                        {lastMsg ? lastMsg.text : ''}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
        
        {activeTab === 'contacts' && !showNewFriends && (
          <div className="p-3 flex flex-col gap-2.5 pb-8 bg-[#f3f3f3] min-h-full">
            <div onClick={() => setShowNewFriends(true)} className="bg-white rounded-[16px] border border-gray-100 p-3.5 flex items-center gap-4 relative active:bg-gray-50 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors">
              <div className="w-[46px] h-[46px] bg-[#FA9D3B] rounded-[12px] flex items-center justify-center">
                <UserPlus size={22} className="text-white" />
              </div>
              <span className="text-[17px] text-[#333333]">新的朋友</span>
              {requests.length > 0 && (
                <div className="absolute right-5 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </div>
            <div className="bg-white rounded-[16px] border border-gray-100 p-3.5 flex items-center gap-4 active:bg-gray-50 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="w-[46px] h-[46px] bg-[#07C160] rounded-[12px] flex items-center justify-center">
                <Users size={22} className="text-white" />
              </div>
              <span className="text-[17px] text-[#333333]">群聊</span>
            </div>
            <div className="bg-white rounded-[16px] border border-gray-100 p-3.5 flex items-center gap-4 active:bg-gray-50 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="w-[46px] h-[46px] bg-[#2782D7] rounded-[12px] flex items-center justify-center">
                <Tag size={22} className="text-white" />
              </div>
              <span className="text-[17px] text-[#333333]">标签</span>
            </div>

            {/* Friends List */}
            {friends.length > 0 && (
              <div className="mt-2">
                <div className="text-[13px] text-[#999999] font-medium mb-1.5 px-2">我的好友</div>
                <div className="flex flex-col gap-2.5">
                  {friends.map(friend => (
                    <div key={friend.id} onClick={() => setSelectedFriend(friend)} className="bg-white rounded-[16px] border border-gray-100 p-3 flex items-center gap-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] active:bg-gray-50 cursor-pointer">
                      <div className="w-[48px] h-[48px] bg-gray-100 rounded-[12px] flex items-center justify-center text-gray-400 overflow-hidden">
                        {friend.avatar ? <img src={friend.avatar} alt="" className="w-full h-full object-cover" /> : <User size={24} />}
                      </div>
                      <span className="text-[17px] text-[#333333] font-medium">{friend.wechat_remark || friend.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'contacts' && showNewFriends && (
          <div className="flex-1 bg-[#fcfcfc] min-h-full">
            <div className="flex items-center px-4 py-2 bg-gray-100 border-b border-gray-200">
               <div className="flex bg-white rounded-md flex-1 items-center px-3 py-1.5 text-gray-400 text-sm justify-center">
                  <Search size={16} className="mr-1" /> 微信号/手机号
               </div>
            </div>
            
            <div className="px-4 py-1.5 text-[13px] text-gray-500 bg-gray-50">好友通知</div>

            {requests.map(req => (
              <div key={req.id} className="flex items-center justify-between p-3.5 border border-gray-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] mx-3 mt-3 rounded-[16px]">
                <div className="flex gap-4">
                  <div className="w-[48px] h-[48px] bg-gray-100 rounded-[12px] flex items-center justify-center overflow-hidden">
                    {req.avatar ? <img src={req.avatar} alt="" className="w-full h-full object-cover" /> : <User className="text-gray-400" />}
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[17px] font-medium text-[#333333]">{req.name}</span>
                    <span className="text-[13px] text-[#999999] mt-0.5">请求添加你为朋友</span>
                  </div>
                </div>
                <button onClick={() => onAcceptRequest(req.id)} className="bg-[#07C160] active:bg-[#06ae56] text-white text-[14px] font-medium px-4 py-1.5 rounded-[8px] hover:bg-[#06ae56] transition-colors">
                  接受
                </button>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-center pt-20 text-gray-400 text-sm">暂无新朋友请求</div>
            )}
          </div>
        )}

        {activeTab === 'moments' && (
          <div className="bg-[#fcfcfc] min-h-full">
            <div className="relative h-64 border-b border-dashed border-gray-300 mx-4 mt-4 rounded-xl flex items-center justify-center bg-gray-50/50">
              <Camera size={48} className="text-gray-200" strokeWidth={1} />
              
              <div className="absolute -bottom-6 right-2 flex items-end gap-3 z-10">
                <span className="text-[15px] text-gray-800 font-medium mb-2 drop-shadow-sm bg-white/50 px-1 rounded">{myProfile?.name || '未设置昵称'}</span>
                <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden">
                  {myProfile?.avatar ? <img src={myProfile.avatar} alt="My Avatar" className="w-full h-full object-cover" /> : myAvatar ? <img src={myAvatar} alt="My Avatar" className="w-full h-full object-cover" /> : <User size={32} className="text-gray-300" strokeWidth={1.5} />}
                </div>
              </div>
            </div>
            
            <div className="text-right px-6 mt-8 flex justify-end items-center gap-1">
              <Snowflake size={14} className="text-gray-300" />
              <span className="text-[12px] text-gray-400">{myProfile?.signature || '这里是个性签名'}</span>
            </div>
            
            <div className="flex flex-col items-center justify-center mt-20 opacity-50">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <Edit2 size={20} className="text-gray-400" />
              </div>
              <span className="text-[13px] text-gray-500">暂无朋友圈动态</span>
            </div>
          </div>
        )}

        {activeTab === 'me' && (
          <div className="p-3 flex flex-col gap-3 pb-8 bg-[#f3f3f3] min-h-full">
            {/* Profile Card */}
            <div onClick={() => onOpenMyProfile?.()} className="bg-white rounded-[16px] border border-gray-100 p-5 flex items-center justify-between active:bg-gray-50 cursor-pointer transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-[12px] flex items-center justify-center border border-gray-100 overflow-hidden">
                  {myProfile?.avatar ? <img src={myProfile.avatar} alt="My Avatar" className="w-full h-full object-cover" /> : myAvatar ? <img src={myAvatar} alt="My Avatar" className="w-full h-full object-cover" /> : <User size={32} className="text-gray-300" />}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[18px] font-medium text-[#333333]">{myProfile?.name || '未设置昵称'}</span>
                  <span className="text-[13px] text-gray-500">微信号: {myProfile?.wechat_id || '未设置'}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>

            {/* Options List */}
            <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
              <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100 active:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-[#333333]" />
                  <span className="text-[16px] text-[#333333]">支付</span>
                </div>
                <ChevronRight size={16} className="text-[#cccccc]" />
              </div>
              <div className="px-4 py-4 flex items-center justify-between active:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-[1.5px] border-[#333333] rounded flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-[#333333]"></div>
                  </div>
                  <span className="text-[16px] text-[#333333]">朋友圈</span>
                </div>
                <ChevronRight size={16} className="text-[#cccccc]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <div className="bg-[#fbfbfb] border-t border-gray-100 pb-8 pt-3 px-8 flex justify-between shrink-0 relative z-20">
        <div 
          onClick={() => setActiveTab('chats')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeTab === 'chats' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/>
            <path d="M14 20a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/>
          </svg>
          <span className={`text-[10px] ${activeTab === 'chats' ? 'font-medium' : ''}`}>微信</span>
        </div>
        
        <div 
          onClick={() => setActiveTab('contacts')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors relative ${activeTab === 'contacts' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
        >
          {requests.length > 0 && <div className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full border border-[0.5px] border-white"></div>}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="6" y="4" width="12" height="16" rx="1.5" />
            <line x1="6" y1="12" x2="18" y2="12" />
          </svg>
          <span className={`text-[10px] ${activeTab === 'contacts' ? 'font-medium' : ''}`}>通讯录</span>
        </div>
        
        <div 
          onClick={() => setActiveTab('moments')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeTab === 'moments' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="4" width="16" height="16" rx="2.5" />
            <circle cx="12" cy="12" r="3.5" />
          </svg>
          <span className={`text-[10px] ${activeTab === 'moments' ? 'font-medium' : ''}`}>朋友圈</span>
        </div>
        
        <div 
          onClick={() => setActiveTab('me')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeTab === 'me' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="7" r="4.5" />
            <path d="M5.5 21.5c0-4.5 2.5-7 6.5-7s6.5 2.5 6.5 7" strokeLinecap="round" />
          </svg>
          <span className={`text-[10px] ${activeTab === 'me' ? 'font-medium' : ''}`}>我</span>
        </div>
      </div>
      <AnimatePresence>
        {selectedFriend && (
          <FriendProfileScreen 
            friend={selectedFriend} 
            onBack={() => setSelectedFriend(null)} 
            onSendMessage={() => {
              setActiveChatFriend(selectedFriend);
              setSelectedFriend(null);
            }} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeChatFriend && (
          <ChatScreen 
            friend={activeChatFriend}
            messages={chats[activeChatFriend.id] || []}
            onSendMessage={(msg) => onSendMessage(activeChatFriend.id, msg, true)}
            onBack={() => setActiveChatFriend(null)}
            onSetRemark={(remark) => {
              if (onSetRemark) onSetRemark(activeChatFriend.id, remark);
              setActiveChatFriend({ ...activeChatFriend, wechat_remark: remark });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddFriendModal && !showApplyModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddFriendModal(false)}
              className="fixed inset-0 bg-black/40 z-[90]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20, x: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, y: -20, x: '-50%' }}
              className="fixed top-1/2 left-1/2 w-[85%] bg-white rounded-[16px] z-[100] flex flex-col overflow-hidden"
            >
              <div className="p-6 pb-4">
                <input 
                  type="text" 
                  value={searchWechatId}
                  onChange={e => setSearchWechatId(e.target.value)}
                  placeholder="微信号"
                  className="w-full h-11 px-3 border border-gray-200 rounded-[8px] text-[15px] focus:outline-none focus:border-gray-300"
                />
              </div>
              
              {searchWechatId && (
                <div className="px-6 pb-2">
                  {(() => {
                    const found = personas.find(p => p.wechat_id === searchWechatId);
                    if (found) {
                      return (
                        <div 
                          onClick={() => {
                            setSearchResult(found);
                            setShowApplyModal(true);
                          }}
                          className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-[12px] active:bg-gray-100 cursor-pointer"
                        >
                          <div className="w-[50px] h-[50px] rounded-[10px] bg-gradient-to-br from-[#8089e9] to-[#9966cc] overflow-hidden flex items-center justify-center text-white text-[24px] font-medium shrink-0 shadow-sm border border-black/5">
                            {found.avatar ? <img src={found.avatar} alt="Avatar" className="w-full h-full object-cover" /> : '1'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[16px] font-medium text-gray-900">{found.name}</span>
                            <span className="text-[13px] text-gray-500 mt-0.5">微信号：{found.wechat_id}</span>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="text-center text-[14px] text-gray-400 py-4">该用户不存在</div>
                    );
                  })()}
                </div>
              )}

              <div className="px-6 py-4 border-t border-gray-100/50">
                <button 
                  onClick={() => {}}
                  className="w-full py-2.5 bg-[#8b8b8b] text-white rounded-[24px] text-[15px] font-medium active:bg-[#7b7b7b] transition-colors"
                >
                  搜索
                </button>
              </div>
            </motion.div>
          </>
        )}

        {showApplyModal && searchResult && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowApplyModal(false);
                setShowAddFriendModal(false);
              }}
              className="fixed inset-0 bg-black/40 z-[90]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20, x: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, y: -20, x: '-50%' }}
              className="fixed top-1/2 left-1/2 w-[85%] bg-white rounded-[16px] z-[100] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 px-5">
                <span className="text-[17px] font-medium text-gray-900">申请添加好友</span>
                <button 
                  onClick={() => {
                    setShowApplyModal(false);
                    setShowAddFriendModal(false);
                  }}
                  className="p-1 -mr-1 text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-5">
                <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-[12px] mb-4">
                  <div className="w-[50px] h-[50px] rounded-[10px] bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                    {searchResult.avatar ? <img src={searchResult.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User size={24} className="text-gray-400" />}
                  </div>
                  <span className="text-[16px] font-medium text-gray-900">{searchResult.name}</span>
                </div>

                <div className="mb-2">
                  <label className="block text-[14px] text-gray-600 mb-2">发送添加朋友申请</label>
                  <textarea 
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    className="w-full h-[100px] p-3 border border-gray-200 rounded-[8px] text-[15px] resize-none focus:outline-none focus:border-gray-300"
                  />
                </div>
                
                <p className="text-[12px] text-gray-400 mb-6">你需要发送验证申请，等待对方通过</p>

                <div className="flex items-center justify-center gap-3 mb-6">
                  <button 
                    onClick={() => {
                      setShowApplyModal(false);
                      setShowAddFriendModal(false);
                    }}
                    className="w-[100px] py-2 bg-gray-100/80 text-gray-600 rounded-[8px] text-[15px] font-medium active:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => {
                      onAddFriend(searchResult);
                      setShowApplyModal(false);
                      setShowAddFriendModal(false);
                    }}
                    className="w-[100px] py-2 bg-[#2b2b2b] text-white rounded-[8px] text-[15px] font-medium active:bg-black transition-colors"
                  >
                    发送
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export { WechatScreen as WechatApp };
