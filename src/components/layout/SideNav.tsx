import { Settings, Rocket, GaugeCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useCallback } from 'react';
import { Page } from '../../types/navigation';
import { RobotIcon } from '../icons/RobotIcon';

interface FlyingRocket {
  id: number;
  x: number;
  y: number;
}

interface SideNavProps {
  page: Page;
  setPage: (page: Page) => void;
}

import { CodexIcon } from '../icons/CodexIcon';

interface FlyingRocket {
  id: number;
  x: number;
  y: number;
}

// 彩蛋标语列表
const EASTER_EGG_SLOGANS = [
  '多使用Gemini 3 Flash更省token哦',
  'ChatGPT5.3不适合前端设计哦',
  'Claude Opus是最贵的模型哦',
  '使用Gemini 3 Pro写规划很不错哦',
  '使用Gemini 3 Pro写UI很不错哦',
  '使用Claude Opus4.6写代码是最好的选择',
  'Sonnet 4.5代码能力超强哦',
  'Llama 3开源模型也很能打哦',
  '记得定期备份你的API Key哦',
  'Claude Haiku也非常适合聊天哦',
];

export function SideNav({ page, setPage }: SideNavProps) {
  const { t } = useTranslation();
  const isOverviewGroup = page === 'overview' || page === 'fingerprints' || page === 'wakeup' || page === 'instances';
  const [clickCount, setClickCount] = useState(0);
  const [flyingRockets, setFlyingRockets] = useState<FlyingRocket[]>([]);
  const [easterEggSlogan, setEasterEggSlogan] = useState<string | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rocketIdRef = useRef(0);
  const logoRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = useCallback(() => {
    // 清除之前的重置计时器
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    // 增加点击计数
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // 每10次点击显示彩蛋标语
    if (newCount > 0 && newCount % 10 === 0) {
      const randomSlogan = EASTER_EGG_SLOGANS[Math.floor(Math.random() * EASTER_EGG_SLOGANS.length)];
      setEasterEggSlogan(randomSlogan);
      // 3秒后隐藏标语
      setTimeout(() => {
        setEasterEggSlogan(null);
      }, 3000);
    }

    // 创建新的飞行火箭
    const newRocket: FlyingRocket = {
      id: rocketIdRef.current++,
      x: (Math.random() - 0.5) * 40, // 随机水平偏移
      y: 0,
    };

    setFlyingRockets(prev => [...prev, newRocket]);

    // 动画完成后移除火箭 (1.5秒)
    setTimeout(() => {
      setFlyingRockets(prev => prev.filter(r => r.id !== newRocket.id));
    }, 1500);

    // 设置新的重置计时器 (2秒不点击后重置)
    resetTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 2000);
  }, [clickCount]);

  return (
    <nav className="side-nav">
      <div className="nav-brand" style={{ position: 'relative', zIndex: 10 }}>
        <div
          ref={logoRef}
          className="brand-logo rocket-easter-egg"
          onClick={handleLogoClick}
        >
          <Rocket size={20} />
          {/* 点击计数器保持在里面，跟随缩放 */}
          {clickCount > 0 && (
            <span className="rocket-click-count">{clickCount}</span>
          )}
        </div>

        {/* 把火箭层移到外面，放在后面以自然层叠在上方，使用 pointer-events-none 防止遮挡点击 */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {flyingRockets.map(rocket => (
            <span
              key={rocket.id}
              className="flying-rocket"
              style={{ '--rocket-x': `${rocket.x}px` } as React.CSSProperties}
            >
              🚀
            </span>
          ))}
        </div>

        {/* 彩蛋标语显示 */}
        {easterEggSlogan && (
          <div className="easter-egg-slogan">
            {easterEggSlogan}
          </div>
        )}
      </div>

      <div className="nav-items">

        <button
          className={`nav-item ${page === 'dashboard' ? 'active' : ''}`}
          onClick={() => setPage('dashboard')}
          title={t('nav.dashboard')}
        >
          <GaugeCircle size={20} />
          <span className="tooltip">{t('nav.dashboard')}</span>
        </button>

        <button
          className={`nav-item ${isOverviewGroup ? 'active' : ''}`}
          onClick={() => setPage('overview')}
          title={t('nav.overview')}
        >
          <RobotIcon />
          <span className="tooltip">{t('nav.overview')}</span>
        </button>

        <button
          className={`nav-item ${page === 'codex' ? 'active' : ''}`}
          onClick={() => setPage('codex')}
          title={t('nav.codex')}
        >
          <CodexIcon />
          <span className="tooltip">{t('nav.codex')}</span>
        </button>

        <button
          className={`nav-item ${page === 'settings' ? 'active' : ''}`}
          onClick={() => setPage('settings')}
          title={t('nav.settings')}
        >
          <Settings size={20} />
          <span className="tooltip">{t('nav.settings')}</span>
        </button>
      </div>

    </nav>
  );
}
