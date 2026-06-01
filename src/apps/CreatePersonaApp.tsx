import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Moon, Signal, Wifi, Battery, ChevronLeft, User, ChevronRight } from 'lucide-react';
import { ToggleSwitch, CurrentTime } from '../components';

export const CreatePersonaApp = ({ 
  onBack,
  onSave,
  initialData,
  key
}: { 
  onBack: () => void;
  onSave: (persona: any, sendReq: boolean) => void;
  initialData?: any;
  key?: React.Key;
}) => {
  const [sendRequest, setSendRequest] = useState(false);
  const [detailedTemplate, setDetailedTemplate] = useState(initialData?.mode !== 'normal');
  const [enableMask, setEnableMask] = useState(initialData?.enableMask || false);
  const [wechatName, setWechatName] = useState(initialData?.wechatName || initialData?.name || '');
  const [wechatId, setWechatId] = useState(initialData?.wechatId || initialData?.wechat_id || '');
  const [region, setRegion] = useState(initialData?.region || '');
  
  const [signature, setSignature] = useState(initialData?.signature || '');
  const [realName, setRealName] = useState(initialData?.name || initialData?.real_name || '');
  const [gender, setGender] = useState(initialData?.gender || '');
  const [age, setAge] = useState(initialData?.age || '');
  const [birthday, setBirthday] = useState(initialData?.birthday || '');
  const [identity, setIdentity] = useState(initialData?.identity || '');
  const [nickname, setNickname] = useState(initialData?.nickname || '');
  const [personality, setPersonality] = useState(initialData?.personality || '');
  const [appearance, setAppearance] = useState(initialData?.appearance || '');
  const [relationship, setRelationship] = useState(initialData?.relationship || '');
  const [communicationStyle, setCommunicationStyle] = useState(initialData?.communication_style || '');
  const [lifestyle, setLifestyle] = useState(initialData?.lifestyle || '');
  const [background, setBackground] = useState(initialData?.background || '');
  const [nsfwInfo, setNsfwInfo] = useState(initialData?.nsfw_info || '');
  const [bio, setBio] = useState(initialData?.bio || '');

  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatar || null);
  const [myAvatarPreview, setMyAvatarPreview] = useState<string | null>(initialData?.my_bound_avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const myFileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMyAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMyAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 15 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 bg-[#FAFAFA] z-[70] flex flex-col pt-4"
    >
      {/* Status Bar */}
      <div className="flex justify-between items-center px-7 text-[13px] font-medium text-gray-800 shrink-0 bg-white pb-2">
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
      <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-gray-100 bg-white">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-800 active:bg-gray-100 rounded-full transition-colors z-10">
          <ChevronLeft size={24} strokeWidth={2} />
        </button>
        <span className="text-[17px] font-medium text-gray-800 absolute left-1/2 -translate-x-1/2">
          对方人设
        </span>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-[100px] px-4">
        
        {/* Wechat Section */}
        <div className="flex items-center justify-center mt-6 mb-4 relative">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <span className="bg-[#FAFAFA] px-3 text-gray-500 text-[13px] tracking-widest z-10 font-light">微信信息</span>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-gray-100/60 mb-4 flex flex-col gap-6">
          {/* Avatar */}
          <div>
            <label className="block text-[14px] text-gray-700 font-medium mb-3">头像 (avatar)</label>
            <div className="flex items-center gap-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-[72px] h-[72px] rounded-[18px] bg-[#f8f9fa] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 cursor-pointer overflow-hidden relative"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={36} strokeWidth={1.5} className="mb-0.5" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-gray-700 font-medium">点击头像上传</span>
                <span className="text-[12px] text-gray-400 mt-1">此头像将作为该人设的微信头像</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarSelect} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

          {/* Wechat Name */}
          <div>
            <label className="block text-[14px] text-gray-700 font-medium mb-2">微信昵称 (wechat_name)</label>
            <input 
              type="text" 
              value={wechatName}
              onChange={e => setWechatName(e.target.value)}
              placeholder="设置微信显示的昵称" 
              className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white" 
            />
            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
              此昵称为该人设在微信中的显示名称，将在通讯录、聊天列表、聊天窗口、朋友圈等所有微信功能中显示
            </p>
          </div>

          {/* Wechat ID */}
          <div>
            <label className="block text-[14px] text-gray-700 font-medium mb-2">微信号 (wechat_id)</label>
            <input type="text" value={wechatId} onChange={e => setWechatId(e.target.value)} placeholder="设置此人设的微信号，可在微信搜索添加" className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white" />
          </div>

          {/* Region */}
          <div>
            <label className="block text-[14px] text-gray-700 font-medium mb-2">地区 (region)</label>
            <input type="text" value={region} onChange={e => setRegion(e.target.value)} placeholder="留空则使用天气设置的城市" className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white" />
            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">填写该角色所在城市，留空表示与你同城</p>
          </div>

          {/* Signature */}
          <div>
            <label className="block text-[14px] text-gray-700 font-medium mb-2">个性签名 (signature)</label>
            <input type="text" value={signature} onChange={e => setSignature(e.target.value)} placeholder="例如：热爱生活，享受当下" className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white" />
            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">此签名将显示在微信资料中，可选填</p>
          </div>
        </div>

        {/* Save Toggle */}
        <div className="bg-[#F8FBFF] rounded-[24px] p-5 border border-[#E8F0FE] mb-8 flex items-center justify-between">
          <div className="flex flex-col pr-4">
             <span className="text-[15px] text-gray-800 font-medium mb-1.5 ml-1">保存后主动发送好友申请</span>
             <span className="text-[12px] text-gray-500 leading-relaxed ml-1">开启后，AI将扮演此人设主动向你发送好友申请</span>
          </div>
          <ToggleSwitch checked={sendRequest} onChange={setSendRequest} />
        </div>

        {/* Persona Section */}
        <div className="flex items-center justify-center mb-4 relative">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <span className="bg-[#FAFAFA] px-3 text-gray-500 text-[13px] tracking-widest z-10 font-light">人设信息</span>
        </div>

        <div className="bg-white rounded-[24px] px-5 py-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-gray-100/60 mb-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-5">
             <span className="text-[15px] text-gray-800 font-medium ml-1">详细模板</span>
             <ToggleSwitch checked={detailedTemplate} onChange={setDetailedTemplate} />
          </div>

          {detailedTemplate ? (
            <div className="flex flex-col gap-6 pt-2">
              <div>
                <label className="block text-[14px] text-gray-700 font-medium mb-2">姓名 (name)</label>
                <input type="text" value={realName} onChange={e => setRealName(e.target.value)} placeholder="例如：李思思" className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white" />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[14px] text-gray-700 font-medium mb-2">性别 (gender)</label>
                  <input type="text" value={gender} onChange={e => setGender(e.target.value)} placeholder="例如：女、男" className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white" />
                </div>
                <div className="flex-1">
                  <label className="block text-[14px] text-gray-700 font-medium mb-2">年龄 (age)</label>
                  <input type="text" value={age} onChange={e => setAge(e.target.value)} placeholder="例如：24" className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-gray-700 font-medium mb-2">生日 (birthday)</label>
                <input type="text" value={birthday} onChange={e => setBirthday(e.target.value)} placeholder="例如：1998年5月20日" className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white" />
              </div>

              <div>
                <label className="block text-[14px] text-gray-700 font-medium mb-2">身份 (identity)</label>
                <input type="text" value={identity} onChange={e => setIdentity(e.target.value)} placeholder="例如：大学生、职场白领、艺术家..." className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white" />
              </div>

              <div>
                <label className="block text-[14px] text-gray-700 font-medium mb-2">昵称 (nickname)</label>
                <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="例如：小思、思思..." className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white" />
              </div>

              <div>
                <label className="block text-[14px] text-gray-700 font-medium mb-2">性格 (personality)</label>
                <textarea rows={3} value={personality} onChange={e => setPersonality(e.target.value)} placeholder="描述性格特点，例如：开朗活泼、温柔体贴、内向文静..." className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white resize-none"></textarea>
              </div>

              <div>
                <label className="block text-[14px] text-gray-700 font-medium mb-2">外观 (appearance)</label>
                <textarea rows={3} value={appearance} onChange={e => setAppearance(e.target.value)} placeholder="描述外貌特征，例如：身高、发型、穿着风格..." className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white resize-none"></textarea>
              </div>

              <div>
                <label className="block text-[14px] text-gray-700 font-medium mb-2">与{'{'}{'{'}user{'}'}{'}'}关系 (relationship)</label>
                <input type="text" value={relationship} onChange={e => setRelationship(e.target.value)} placeholder="例如：同学、朋友、恋人、陌生人..." className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white" />
              </div>

              <div>
                <label className="block text-[14px] text-gray-700 font-medium mb-2">沟通风格 (communication_style)</label>
                <textarea rows={3} value={communicationStyle} onChange={e => setCommunicationStyle(e.target.value)} placeholder="描述说话方式，例如：喜欢用语气词、经常开玩笑、表达直接..." className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white resize-none"></textarea>
              </div>

              <div>
                <label className="block text-[14px] text-gray-700 font-medium mb-2">生活习惯 (lifestyle)</label>
                <textarea rows={3} value={lifestyle} onChange={e => setLifestyle(e.target.value)} placeholder="描述日常生活习惯，例如：早起、喜欢运动、爱猫咪、夜猫子..." className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white resize-none"></textarea>
              </div>

              <div>
                <label className="block text-[14px] text-gray-700 font-medium mb-2">成长经历 (background)</label>
                <textarea rows={3} value={background} onChange={e => setBackground(e.target.value)} placeholder="描述成长背景、重要经历..." className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white resize-none"></textarea>
              </div>

              <div>
                <label className="block text-[14px] text-gray-700 font-medium mb-2">NSFW相关 (nsfw_info)</label>
                <textarea rows={3} value={nsfwInfo} onChange={e => setNsfwInfo(e.target.value)} placeholder="选填，描述NSFW相关偏好和特征..." className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white resize-none"></textarea>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 pt-2">
              <div>
                <label className="block text-[14px] text-gray-700 font-medium mb-2">姓名 (name)</label>
                <input type="text" value={realName} onChange={e => setRealName(e.target.value)} placeholder="例如：李思思" className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white" />
              </div>
              <div>
                <label className="block text-[14px] text-gray-700 font-medium mb-2">人设描述 (bio)</label>
                <textarea rows={6} value={bio} onChange={e => setBio(e.target.value)} placeholder="请提供精简版人设描述..." className="w-full text-[15px] px-4 py-3.5 rounded-[12px] border border-gray-200 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-shadow bg-white resize-none"></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Linked Worldbook */}
        <div className="flex items-center justify-center mb-4 relative">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <span className="bg-[#FAFAFA] px-3 text-gray-500 text-[13px] tracking-widest z-10 font-light">关联世界书</span>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-gray-100/60 mb-8 flex flex-col gap-4">
          <p className="text-[12px] text-gray-500 leading-relaxed mx-1">
            世界书用于为AI提供背景信息、系统提示词、规则设定等，让角色扮演更丰富自然
          </p>
          <div>
            <label className="block text-[14px] text-gray-700 font-medium mb-2 mx-1">选择世界书</label>
            <div className="flex items-center justify-between w-full px-4 py-3.5 rounded-[12px] border border-gray-200 cursor-pointer active:bg-gray-50 bg-white">
              <span className="text-[15px] text-gray-800">点击选择世界书</span>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* My Chat Avatar */}
        <div className="flex items-center justify-center mb-4 relative">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <span className="bg-[#FAFAFA] px-3 text-gray-500 text-[13px] tracking-widest z-10 font-light">我的聊天头像</span>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-gray-100/60 mb-8 flex flex-col gap-4">
          <div>
            <label className="block text-[14px] text-gray-700 font-medium mb-3">绑定头像 (my_bound_avatar)</label>
            <div className="flex items-center gap-4">
              <div 
                onClick={() => myFileInputRef.current?.click()}
                className="w-[72px] h-[72px] rounded-[18px] bg-[#f8f9fa] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 cursor-pointer overflow-hidden relative"
              >
                {myAvatarPreview ? (
                  <img src={myAvatarPreview} alt="My Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={36} strokeWidth={1.5} className="mb-0.5" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-gray-700 font-medium cursor-pointer" onClick={() => myFileInputRef.current?.click()}>点击上传专属头像 (可选)</span>
                <span className="text-[12px] text-gray-400 mt-1 leading-relaxed">为这张人设卡单独设置"我"的聊天头像；不上传则默认。</span>
              </div>
              <input 
                type="file" 
                ref={myFileInputRef} 
                onChange={handleMyAvatarSelect} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>
        </div>

        {/* My Mask Persona */}
        <div className="flex items-center justify-center mb-4 relative">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <span className="bg-[#FAFAFA] px-3 text-gray-500 text-[13px] tracking-widest z-10 font-light">我的面具人设</span>
        </div>

        <div className="bg-[#FFF8EE] rounded-[24px] p-5 border border-[#FFE8CB] mb-6 flex items-center justify-between">
          <div className="flex flex-col pr-4">
             <span className="text-[15px] text-gray-800 font-medium mb-1.5 ml-1">启用面具人设</span>
             <span className="text-[12px] text-gray-500 leading-relaxed ml-1">关闭时使用你的真实人设，开启后TA会认为你是面具人设中的角色</span>
          </div>
          <ToggleSwitch checked={enableMask} onChange={setEnableMask} />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-5 pt-3 pb-8 flex gap-4 z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        <button onClick={onBack} className="flex-1 bg-[#F4F4F5] active:bg-[#E5E5EA] text-gray-700 text-[15px] font-medium py-3.5 rounded-[14px] transition-colors">
          取消
        </button>
        <button 
          onClick={() => {
            onSave({ 
              id: initialData?.id || 'ws_' + Date.now(), 
              name: realName.trim() || '未命名人设',
              mode: detailedTemplate ? 'detailed' : 'normal',
              wechatName: wechatName.trim() || realName.trim() || '未命名人设', 
              wechatId: wechatId,
              wechat_id: wechatId,
              region,
              signature,
              gender,
              age,
              birthday,
              identity,
              nickname,
              personality,
              appearance,
              relationship,
              communication_style: communicationStyle,
              lifestyle,
              background,
              nsfw_info: nsfwInfo,
              bio,
              avatar: avatarPreview, 
              my_bound_avatar: myAvatarPreview,
              enableMask
            }, sendRequest);
          }}
          className="flex-1 bg-[#2C2C2E] active:bg-[#1A1A1C] text-white text-[15px] font-medium py-3.5 rounded-[14px] transition-colors shadow-sm"
        >
          保存
        </button>
      </div>

    </motion.div>
  );
};
