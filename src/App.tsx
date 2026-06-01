import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatDB } from './db';
import { MyProfileApp } from './apps/MyProfileApp';
import { SettingsApp } from './apps/SettingsApp';
import { WechatApp as WechatScreen } from './apps/WechatApp';
import { HuajiApp as HuajiScreen } from './apps/HuajiApp';
import { CreatePersonaApp as CreatePersonaScreen } from './apps/CreatePersonaApp';
import { WorldbookApp as WorldbookScreen } from './apps/WorldbookApp';
import { BackgroundLines, IconChat, AppIcon, CurrentTime } from './components';
import {
  Camera,
  User,
  MapPin,
  Crosshair,
  PanelTop,
  Focus,
  Columns,
  Smartphone,
  Target,
  Disc,
  Snowflake,
  Signal,
  Wifi,
  Battery,
  Moon,
  ChevronLeft,
  Plus,
  Globe,
  RefreshCcw,
  Users,
  Layout,
  Tag,
  Edit2,
  ChevronRight,
  CreditCard,
  UserPlus,
  Search,
  MoreHorizontal,
  MoreVertical,
  MessageSquare,
  Phone,
  PlusCircle,
  Heart,
  Send,
  X
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'settings' | 'wechat' | 'huaji' | 'create_persona' | 'my_profile' | 'worldbook'>('home');
  const [myProfile, setMyProfile] = useState<any>({});
  const [wechatRequests, setWechatRequests] = useState<any[]>([]);
  const [wechatFriends, setWechatFriends] = useState<any[]>([]);
  const [wechatChats, setWechatChats] = useState<Record<string, any[]>>({});
  const [personas, setPersonas] = useState<any[]>([{
    id: 'ws_test_1',
    name: '飞花集',
    wechat_id: '1',
    real_name: '谢回',
    age: '20',
    identity: '测试员',
    nickname: '小回',
    personality: '温和',
    appearance: '温柔帅哥',
    communication_style: '说话很温和',
    background: '正常教育',
    nsfw: '尊重对方',
    region: '未知',
    avatar: null,
    my_bound_avatar: null,
    enableMask: false
  }]);
  const [editingPersona, setEditingPersona] = useState<any | null>(null);
  const [globalToast, setGlobalToast] = useState('');

  React.useEffect(() => {
    ChatDB.messages.toArray().then(messages => {
      const chats: Record<string, any[]> = {};
      messages.forEach(msg => {
        if (!chats[msg.contactId]) {
          chats[msg.contactId] = [];
        }
        chats[msg.contactId].push({
          text: msg.text,
          isMe: msg.isMe,
          timestamp: msg.fullTimestamp
        });
      });
      // Sort messages within each chat by timestamp
      Object.keys(chats).forEach(contactId => {
        chats[contactId].sort((a, b) => a.timestamp - b.timestamp);
      });
      setWechatChats(chats);
    }).catch(err => console.error("Failed to load messages", err));
  }, []);

  const showGlobalToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(''), 2500);
  };

  const handleCreatePersonaSave = (persona: any, sendReq: boolean) => {
    setPersonas(prev => {
      const existing = prev.find(p => p.id === persona.id);
      if (existing) {
        return prev.map(p => p.id === persona.id ? persona : p);
      }
      return [persona, ...prev];
    });
    if (sendReq) {
      setWechatRequests(prev => {
        const existing = prev.find(p => p.id === persona.id);
        if (existing) {
          return prev.map(p => p.id === persona.id ? persona : p);
        }
        return [persona, ...prev];
      });
      setWechatFriends(prev => {
        const existing = prev.find(p => p.id === persona.id);
        if (existing) {
          return prev.map(p => p.id === persona.id ? persona : p);
        }
        return prev;
      });
      showGlobalToast('保存成功，已发送好友申请');
    } else {
      setWechatFriends(prev => {
        const existing = prev.find(p => p.id === persona.id);
        if (existing) {
          return prev.map(p => p.id === persona.id ? persona : p);
        }
        return prev;
      });
      showGlobalToast('保存成功');
    }
    setEditingPersona(null);
    setCurrentScreen('huaji');
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 flex justify-center">
      {/* Global Toast */}
      {globalToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-gray-800/95 backdrop-blur text-white px-5 py-3 rounded-full text-[14px] font-medium shadow-xl z-[100] transition-opacity duration-300">
          {globalToast}
        </div>
      )}

      {/* OS Container */}
      <div className="relative w-full max-w-[420px] min-h-screen bg-gradient-to-b from-[#fdfcfc] via-[#FFF0F5] to-[#f8f9fa] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.05)] sm:border-x sm:border-white">
        
        <AnimatePresence>
          {currentScreen === 'settings' && (
            <SettingsApp key="settings" onBack={() => setCurrentScreen('home')} />
          )}
          {currentScreen === 'wechat' && (
            <WechatScreen 
              key="wechat" 
              onBack={() => setCurrentScreen('home')} 
              requests={wechatRequests}
              friends={wechatFriends}
              chats={wechatChats}
              personas={personas}
              myProfile={myProfile}
              onOpenMyProfile={() => setCurrentScreen('my_profile')}
              onSendMessage={(friendId, text, isMe) => {
                const ts = Date.now();
                ChatDB.messages.add({
                  contactId: friendId,
                  fullTimestamp: ts,
                  text: text,
                  isMe: isMe
                }).then(() => {
                  setWechatChats(prev => {
                    const msgs = prev[friendId] || [];
                    return { ...prev, [friendId]: [...msgs, { text, isMe, timestamp: ts }] };
                  });
                }).catch(err => console.error("Failed to save message", err));
              }}
              onAcceptRequest={(id) => {
                const req = wechatRequests.find(r => r.id === id);
                if (req) {
                  setWechatFriends([...wechatFriends, req]);
                  setWechatRequests(wechatRequests.filter(r => r.id !== id));
                  showGlobalToast('已添加为好友');
                }
              }}
              onAddFriend={(persona) => {
                if (!wechatFriends.find(f => f.id === persona.id)) {
                  setWechatFriends([persona, ...wechatFriends]);
                  showGlobalToast('已添加为好友');
                } else {
                  showGlobalToast('已是好友');
                }
              }}
              onSetRemark={(friendId, remark) => {
                setWechatFriends(prev => prev.map(f => f.id === friendId ? { ...f, wechat_remark: remark } : f));
              }}
            />
          )}
          {currentScreen === 'huaji' && (
            <HuajiScreen key="huaji" onBack={() => setCurrentScreen('home')} onCreatePersona={() => { setEditingPersona(null); setCurrentScreen('create_persona'); }} onEditPersona={(p) => { setEditingPersona(p); setCurrentScreen('create_persona'); }} personas={personas} />
          )}
          {currentScreen === 'create_persona' && (
            <CreatePersonaScreen 
              key="create_persona" 
              onBack={() => { setEditingPersona(null); setCurrentScreen('huaji'); }} 
              onSave={handleCreatePersonaSave}
              initialData={editingPersona}
            />
          )}
          {currentScreen === 'my_profile' && (
            <MyProfileApp 
              key="my_profile"
              onBack={() => setCurrentScreen('wechat')} 
              myProfile={myProfile} 
              onSave={(profile) => {
                setMyProfile(profile);
                setCurrentScreen('wechat');
              }} 
            />
          )}
          {currentScreen === 'worldbook' && (
            <WorldbookScreen key="worldbook" onBack={() => setCurrentScreen('home')} />
          )}
        </AnimatePresence>

        <BackgroundLines />

        {/* Scrollable Screen Content */}
        <div className="h-full w-full overflow-y-auto no-scrollbar relative z-10 flex flex-col min-h-screen">
          
          {/* Status Bar */}
          <div className="flex justify-between items-center px-7 pt-4 text-[13px] font-medium text-gray-800">
            <div className="flex items-center">
              <CurrentTime /> <Moon size={11} className="ml-1 opacity-80" fill="currentColor" strokeWidth={1} />
            </div>
            <div className="flex items-center gap-1.5 opacity-60">
              <Signal size={14} strokeWidth={2.5} />
              <Wifi size={14} strokeWidth={2.5} />
              <Battery size={16} strokeWidth={2} />
            </div>
          </div>

          {/* Quick Access Top Box */}
          <div className="mx-6 mt-6 opacity-80 flex-shrink-0">
            <div className="relative border-[1px] border-dashed border-gray-300 rounded-[32px] h-48 flex flex-col items-center justify-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[1px] bg-gray-400"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-[1px] bg-gray-400"></div>
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[1px] h-4 bg-gray-400"></div>
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-[1px] h-4 bg-gray-400"></div>
              
              <div className="w-[66px] h-[46px] bg-black/5 rounded-md flex items-center justify-center backdrop-blur-sm -mt-2">
                <Camera size={26} strokeWidth={1} className="text-gray-400" />
              </div>
              
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-white/80 backdrop-blur rounded-full border border-gray-200 shadow-sm flex items-center justify-center">
                <User size={26} strokeWidth={1} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Central Dashboard */}
          <div className="mt-8 px-8 pb-1 flex-shrink-0">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <CurrentTime className="text-[44px] leading-none font-normal text-gray-700 tracking-tight" />
                <span className="text-[11px] text-gray-400 mt-1.5 font-light tracking-wide uppercase"><CurrentTime format="date" /> 四月十五</span>
              </div>
              
              <div className="flex flex-col items-center pb-0.5">
                <span className="text-[17px] text-gray-800 tracking-widest font-medium">你的名字</span>
                <span className="text-[11px] text-gray-400 mt-1 font-light tracking-wider">@yourID</span>
              </div>
              
              <div className="flex flex-col items-end pb-1.5">
                <span className="text-[15px] text-gray-600 font-light tracking-widest">小雨 19°</span>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-[13px] text-gray-500 font-light tracking-widest">
                淅淅沥沥的潮湿水汽，落在指尖是雨。
              </p>
            </div>
            
            <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
              <MapPin size={11} strokeWidth={2} />
              <span className="tracking-widest">林</span>
            </div>
          </div>

          {/* App Grid Layer */}
          <div className="mt-8 px-6 flex-1 flex flex-col justify-start">
            <div className="grid grid-cols-4 gap-y-7 gap-x-2">
              {/* Row 1 & 2: Main Widget & Small Apps */}
              <div className="col-span-2 row-span-2 mr-3">
                <div className="h-full min-h-[174px] bg-white/50 backdrop-blur-md rounded-[32px] p-5 border border-white/80 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.04)] flex flex-col relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFF0F5]/50 to-transparent"></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full border border-gray-100 bg-white/80 flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                        <User size={16} strokeWidth={1.5} className="text-gray-400" />
                      </div>
                      <span className="font-light text-gray-700 text-[13px] tracking-widest italic">Snow</span>
                    </div>
                    <div className="flex flex-col gap-3.5 flex-1 justify-end pb-2">
                      <div className="text-[11px] font-light text-gray-500 border-b border-dashed border-gray-200 pb-[6px] italic truncate">Not yesterday I learne...</div>
                      <div className="text-[11px] font-light text-gray-500 border-b border-dashed border-gray-200 pb-[6px] italic truncate">The love of bare Nove...</div>
                      <div className="text-[11px] font-light text-gray-500 italic truncate pt-[2px]">Before the coming of t...</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-1 flex justify-center"><AppIcon icon={<Crosshair size={24} strokeWidth={1.2} />} label="天气" /></div>
              <div className="col-span-1 flex justify-center"><AppIcon icon={<PanelTop size={24} strokeWidth={1.2} />} label="日历" /></div>
              
              <div className="col-span-1 flex justify-center"><AppIcon onClick={() => setCurrentScreen('wechat')} icon={<IconChat />} label="微信" /></div>
              <div className="col-span-1 flex justify-center"><AppIcon onClick={() => setCurrentScreen('huaji')} icon={<Focus size={24} strokeWidth={1.2} />} label="花集" /></div>

              {/* Row 3 */}
              <div className="col-span-1 flex justify-center"><AppIcon onClick={() => setCurrentScreen('worldbook')} icon={<Columns size={24} strokeWidth={1.2} />} label="世界书" /></div>
              <div className="col-span-1 flex justify-center"><AppIcon icon={<Smartphone size={24} strokeWidth={1.2} />} label="查手机" /></div>
              
              {/* Decorative Section */}
              <div className="col-span-2 flex items-center justify-end px-2">
                <div className="relative w-full h-full opacity-60 mt-4 pr-3">
                  <div className="absolute right-12 top-0 flex gap-6 text-gray-400">
                    <Snowflake size={12} strokeWidth={1.2} className="origin-center rotate-45" />
                    <Snowflake size={16} strokeWidth={1.2} className="mt-7 origin-center rotate-[30deg]" />
                    <Snowflake size={10} strokeWidth={1.2} className="mt-2 -ml-3" />
                  </div>
                  
                  <div className="absolute right-4 bottom-3 h-[42px] w-6 border-l border-b border-r border-gray-400 rounded-b-md rotate-[12deg] bg-white/10 flex flex-col justify-end pb-1 items-center">
                    <div className="w-[10px] h-2 absolute -top-2 border-l border-r border-t border-gray-400 rounded-t-sm"></div>
                    <div className="w-4 h-2 border-t border-b border-gray-400/50 rounded-sm opacity-60 mt-2"></div>
                  </div>
                  
                  <div className="absolute -bottom-1 right-0 w-36 h-px bg-gray-300">
                    <div className="absolute -top-1.5 left-5 w-14 h-px bg-gray-300"></div>
                    <div className="absolute -top-3 right-6 w-8 h-px bg-gray-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Dock */}
          <div className="mt-12 flex-shrink-0">
            <div className="flex justify-center gap-2 mb-6">
              <div className="w-[22px] h-[5px] bg-gray-600 rounded-full"></div>
              <div className="w-[6px] h-[5px] bg-gray-300 rounded-full"></div>
            </div>

            <div className="px-7 grid grid-cols-3 gap-4 pb-12 sm:pb-8">
              <div className="flex justify-center"><AppIcon onClick={() => setCurrentScreen('settings')} icon={<Target size={24} strokeWidth={1.2} />} label="设置" /></div>
              <div className="flex justify-center"><AppIcon icon={<span className="text-[24px] leading-none font-medium text-gray-700 block pt-0.5 -ml-[1px]">A</span>} label="字体" /></div>
              <div className="flex justify-center"><AppIcon icon={<Disc size={24} strokeWidth={1.2} />} label="主题" /></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
