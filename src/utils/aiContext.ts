import { AppDB } from '../db';

/**
 * 构建完整的 AI 对话上下文（供微信消息和视频通话共用）
 * 统一构建完整 AI 对话上下文，包含微信聊天、视频通话功能共用的外壳、内核及天气信息等。
 * 
 * @param persona AI人设配置对象
 * @param contactId 联系人唯一标识
 * @param recentMessages 可选，最近的对话消息数组，用于世界书条目模式的关键词匹配
 * @returns 返回包含多字段的结构化上下文集合，如果未传入 persona 均直接返回 null
 */
export async function buildFullAIContext(persona: any, contactId: string, recentMessages: any[] = []) {
    if (!persona) return null;
    
    // 初始化上下文集合对象
    const result = {
        aiPersonaInfo: '',
        userPersonaInfo: '',
        relationshipInfo: '',
        worldbookContent: '',
        memoryContent: '',
        timeContext: '',
        relationshipContext: '',
        socialNetworkContent: ''
    };
    
    // === 1. 构建 AI 人设信息 ===
    const ai = persona;
    
    // 拼接【微信外壳信息】：读取昵称、微信号、个性签名
    const aiWechatInfo = `\n【你的微信外壳信息】
微信昵称：${ai.wechatName || ai.name}
微信号：${ai.wechatId || '未设置'}
个性签名：${ai.signature || '未设置'}`;

    // 区分人设模式，输出AI内核信息
    let aiCoreInfo = '';
    if (ai.mode === 'detailed') {
        // 模式为 detailed：输出完整内核信息（姓名、性别、年龄、性格、经历、关系等全套字段）
        aiCoreInfo = `\n【你的真实内核信息】
真实姓名：${ai.name}
性别：${ai.gender || '未知'}
年龄：${ai.age || '未知'}
生日：${ai.birthday || '未知'}
身份：${ai.identity || '未知'}
性格：${ai.personality || '未知'}
外观：${ai.appearance || '未知'}
沟通风格：${ai.communication_style || '未知'}
生活习惯：${ai.lifestyle || '未知'}
成长经历：${ai.background || '未知'}
与对方的关系：${ai.relationship || '未设定'}
${ai.nsfw_info ? 'NSFW相关：' + ai.nsfw_info : ''}`;
    } else {
        // 普通模式：仅输出姓名+精简人设描述
        aiCoreInfo = `\n【你的真实内核信息】
真实姓名：${ai.name}
人设描述：${ai.bio || ''}`;
    }
    
    // 位置&天气分支逻辑：读取本地数据库 AppDB.appSettings，获取用户城市、AI天气预报数据
    let aiLocationInfo = '';
    let aiWeatherInfo = '';
    const userCityRecord = await AppDB.appSettings.get('my_city');
    const userCity = userCityRecord?.value || '';
    const aiRegion = (ai.region || '').trim();
    const aiDistance = ai.distance || '';
    
    // 判断用户城市是否有效配置
    if (userCity && userCity !== '---' && userCity !== '未设置' && userCity.trim() !== '') {
        // 同城：共用同一套天气数据，解析天气JSON并拼接今日/明日天气
        if (!aiRegion || aiRegion === '' || aiRegion === userCity) {
            aiLocationInfo = `\n【你的位置信息】\n你当前所在城市：${userCity}（与对方同城）`;
            const weatherForecastRecord = await AppDB.appSettings.get('weather_ai_forecast');
            const weatherForecastStr = weatherForecastRecord?.value || null;
            if (weatherForecastStr) {
                try {
                    // 天气解析增加 try/catch 异常捕获
                    const weatherForecast = JSON.parse(weatherForecastStr);
                    if (weatherForecast && weatherForecast.length > 0) {
                        const today = weatherForecast[0];
                        aiWeatherInfo = `\n【当地天气】（你和对方看到的天气一样）\n今日天气：${today.weather} ${today.icon}\n温度：${today.high}°/${today.low}°`;
                        if (weatherForecast.length > 1) {
                            const tomorrow = weatherForecast[1];
                            aiWeatherInfo += `\n明日天气：${tomorrow.weather} ${tomorrow.icon}，温度${tomorrow.high}°/${tomorrow.low}°`;
                        }
                    }
                } catch (e) {
                    // 解析失败打印警告日志
                    console.warn('解析天气数据失败:', e);
                }
            }
        } else {
            // 异地：分别描述双方城市，提示AI区分两地气候，不共用天气
            aiLocationInfo = `\n【你的位置信息】\n你当前所在城市：${aiRegion}`;
            if (aiDistance) {
                aiLocationInfo += `\n你的位置关系：${aiDistance}（这里的"我"指的是对方，也就是说这是你相对于对方所在的${userCity}的位置关系）`;
            } else {
                aiLocationInfo += `\n你与对方不在同一城市（对方在${userCity}）`;
            }
            aiWeatherInfo = `\n【当地天气】\n你所在的${aiRegion}的天气需要你根据该城市的地理位置、气候特点和当前季节自行合理感知。\n对方所在的${userCity}的天气与你看到的可能不同，不要把对方的天气当成自己的天气。`;
        }
    }

    result.aiPersonaInfo = aiWechatInfo + aiCoreInfo + aiLocationInfo + aiWeatherInfo;

    return result;
}
