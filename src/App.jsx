import { useState, useEffect } from 'react'
/* 为什么改成 HashRouter？
这会在你的网址里加一个 # 号（变成 [https://sougetsu.art/#/portal](https://sougetsu.art/#/portal)）。有了这个 #，不管你怎么刷新，GitHub 都会乖乖地把请求先交给 index.html，然后 React 就能完美接管路由了！完美解决 404 问题！ */
import { HashRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'

// ==========================================
// 🎨 苹果风全局样式注入 (前端黑科技)
// ==========================================
const AppleStyles = () => (
  <style>{`
    body {
      background-color: #000000;
      color: #f5f5f7;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    
    /* 导航栏：毛玻璃特效 */
    .glass-nav {
      position: sticky;
      top: 0;
      background: rgba(29, 29, 31, 0.72);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 1000;
      display: flex;
      justify-content: center;
      gap: 30px;
      padding: 16px 20px;
    }
    .nav-link {
      color: #f5f5f7;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    .nav-link:hover { opacity: 1; }

    /* Bento 卡片风格 (苹果最爱的圆角卡片) */
    .bento-card {
      background: #1c1c1e;
      border-radius: 24px;
      padding: 32px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s;
    }
    .bento-card.clickable:hover {
      transform: scale(1.02) translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      cursor: pointer;
      border-color: rgba(255, 255, 255, 0.15);
    }

    /* 优雅的输入框 */
    .apple-input {
      background: #1c1c1e;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      border-radius: 14px;
      padding: 16px 20px;
      font-size: 16px;
      width: 100%;
      box-sizing: border-box;
      transition: all 0.3s ease;
    }
    .apple-input:focus {
      outline: none;
      border-color: #2997ff;
      box-shadow: 0 0 0 4px rgba(41, 151, 255, 0.2);
    }

    /* 苹果标准按钮 */
    .apple-btn {
      background: #f5f5f7;
      color: #1d1d1f;
      border-radius: 980px;
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
    }
    .apple-btn:hover { background: #ffffff; transform: scale(1.02); }
    .apple-btn.blue { background: #0071e3; color: white; }
    .apple-btn.blue:hover { background: #0077ed; }

    /* 丝滑的进场动画 */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in {
      animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; text-align: center; }
    h1 { font-size: 48px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 10px; }
    h2 { font-size: 32px; font-weight: 600; letter-spacing: -0.01em; }
    p.subtitle { font-size: 20px; color: #86868b; margin-top: 0; }
  `}</style>
)

// ==========================================
// 🛡️ 路由守卫 (未登录拦截)
// ==========================================
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('my_token')
  return token ? children : <Navigate to="/login" replace />
}

// ==========================================
// 🚪 登录页 & 注册页
// ==========================================
function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    fetch('https://goflashsale.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Username: username, Password: password }) 
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('my_token', data.token)
        navigate('/portal') 
      } else {
        alert('登录失败：' + (data.error || '账号或密码错误'))
      }
    })
  }

  return (
    <div className="container fade-in" style={{ maxWidth: '400px', marginTop: '10vh' }}>
      <h2>登录您的账户</h2>
      <p className="subtitle">进入全栈云端宇宙。</p>
      <form onSubmit={handleLogin} className="bento-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
        <input className="apple-input" type="text" placeholder="Apple ID / 用户名" required onChange={e => setUsername(e.target.value)} />
        <input className="apple-input" type="password" placeholder="密码" required onChange={e => setPassword(e.target.value)} />
        <button className="apple-btn blue" type="submit">继续 ➔</button>
      </form>
      <p style={{ marginTop: '20px', color: '#86868b' }}>还没有账户？ <Link to="/register" style={{ color: '#2997ff', textDecoration: 'none' }}>立即创建</Link></p>
    </div>
  )
}

function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = (e) => {
    e.preventDefault()
    fetch('https://goflashsale.onrender.com/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Username: username, Password: password }) 
    })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        alert('🎉 注册成功！欢迎加入。')
        navigate('/login') 
      } else {
        alert('注册失败：' + (data.error || '用户名可能被占用了'))
      }
    })
  }

  return (
    <div className="container fade-in" style={{ maxWidth: '400px', marginTop: '10vh' }}>
      <h2>创建新账户</h2>
      <p className="subtitle">只需几秒钟。</p>
      <form onSubmit={handleRegister} className="bento-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
        <input className="apple-input" type="text" placeholder="设置您的用户名" required onChange={e => setUsername(e.target.value)} />
        <input className="apple-input" type="password" placeholder="设置您的密码" required onChange={e => setPassword(e.target.value)} />
        <button className="apple-btn" type="submit">完成注册</button>
      </form>
      <p style={{ marginTop: '20px', color: '#86868b' }}>已有账户？ <Link to="/login" style={{ color: '#2997ff', textDecoration: 'none' }}>返回登录</Link></p>
    </div>
  )
}

// ==========================================
// 🏢 迎宾大厅 (Portal)
// ==========================================
function PortalPage() {
  const navigate = useNavigate()
  return (
    <div className="container fade-in">
      <h1>选你所爱。</h1>
      <p className="subtitle" style={{ marginBottom: '50px' }}>两个截然不同的数字空间，一键切换。</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <div className="bento-card clickable" onClick={() => navigate('/shop')} style={{ padding: '50px 30px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🧋</div>
          <h2 style={{ margin: '0 0 10px 0' }}>Boba Store</h2>
          <p style={{ color: '#86868b', margin: 0 }}>探索最新发售的云端饮品。<br/>选购、下单，快人一步。</p>
        </div>

        <div className="bento-card clickable" onClick={() => navigate('/tools')} style={{ padding: '50px 30px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛠️</div>
          <h2 style={{ margin: '0 0 10px 0' }}>Pro Workspace</h2>
          <p style={{ color: '#86868b', margin: 0 }}>你的私人生产力中心。<br/>搭载强悍的大模型 AI 引擎。</p>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 🛍️ A区：奶茶店主页
// ==========================================
function BobaShop() {
  const [products, setProducts] = useState([])

  const fetchProducts = () => {
    fetch('https://goflashsale.onrender.com/products')
      .then(res => res.json())
      .then(data => setProducts(data))
  }

  useEffect(() => fetchProducts(), [])

  const handleBuy = (productId) => {
    const token = localStorage.getItem('my_token')
    fetch('https://goflashsale.onrender.com/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ product_id: productId }) 
    })
    .then(res => res.json())
    .then(data => {
      if (data.order_id) {
        alert("🎉 抢购成功！订单号: " + data.order_id)
        fetchProducts() // 无感刷新库存
      } else alert("❌ 抢购失败: " + data.error)
    })
  }

  return (
    <div className="container fade-in">
      <h1>Store. <span style={{ color: '#86868b' }}>选购您心仪的商品。</span></h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '40px' }}>
        {products.map(p => (
          <div key={p.ID} className="bento-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
            <h3 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>{p.Name}</h3>
            <p style={{ fontSize: '16px', color: '#86868b', margin: '0 0 20px 0' }}>仅剩 {p.Stock} 件库存</p>
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>¥ {p.Price}</span>
              <button className="apple-btn blue" style={{ width: 'auto', padding: '8px 20px', fontSize: '14px' }} onClick={() => handleBuy(p.ID)}>
                购买
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// 🛒 我的订单
// ==========================================
function OrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('my_token')
    fetch('https://goflashsale.onrender.com/api/orders', { headers: { 'Authorization': token } })
    .then(res => res.json())
    .then(data => { if (data.my_orders) setOrders(data.my_orders) })
  }, [])

  return (
    <div className="container fade-in">
      <h1>你的历史订单。</h1>
      <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {orders.length === 0 ? <p style={{ color: '#86868b' }}>暂无订单记录。</p> : null}
        {orders.slice().reverse().map(order => (
          <div key={order.ID} className="bento-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px' }}>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>🧋 {order.Product ? order.Product.Name : '未知商品'}</h3>
              <p style={{ margin: 0, color: '#86868b', fontSize: '14px' }}>订单编号: {order.ID} | {new Date(order.CreatedAt).toLocaleString()}</p>
            </div>
            <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>交易成功</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// 🤖 B区：工具工作台 (微前端应用入口 + AI配置)
// ==========================================
function ToolsDashboard() {
  const [aiMode, setAiMode] = useState(localStorage.getItem('ai_mode') || 'official') 
  const [webToken, setWebToken] = useState(localStorage.getItem('gpt_access_token') || '')
  const [apiProvider, setApiProvider] = useState(localStorage.getItem('api_provider') || 'deepseek')
  const [apiKey, setApiKey] = useState(localStorage.getItem('api_key') || '')

  const handleSaveAIConfig = () => {
    localStorage.setItem('ai_mode', aiMode)
    if (aiMode === 'web2api') localStorage.setItem('gpt_access_token', webToken)
    else {
      localStorage.setItem('api_provider', apiProvider)
      localStorage.setItem('api_key', apiKey)
    }
    alert("⚙️ 全局引擎设置已成功保存并应用！")
  }

  return (
    <div className="container fade-in" style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '40px' }}>Workspace.</h1>
      <p className="subtitle">你的私人生产力中心。</p>
      
      {/* 🚀 微前端：工具矩阵入口 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '40px', marginBottom: '40px' }}>
        
        <div className="bento-card clickable" onClick={() => window.open('/suanming.html', '_blank')} style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🧭</div>
          <h3 style={{ margin: '0 0 8px 0' }}>赛博算命 Pro</h3>
          <p style={{ color: '#86868b', fontSize: '14px', margin: 0 }}>AI 深度命理决策系统</p>
        </div>

        <div className="bento-card clickable" onClick={() => window.open('/xiaohongshu.html', '_blank')} style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📝</div>
          <h3 style={{ margin: '0 0 8px 0' }}>小红书生成器</h3>
          <p style={{ color: '#86868b', fontSize: '14px', margin: 0 }}>一键生成爆款图文卡片</p>
        </div>

      </div>

      {/* ⚙️ AI 全局引擎配置 */}
      <div className="bento-card" style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ marginTop: 0 }}>全局 AI 驱动引擎配置</h3>
        <p style={{ fontSize: '14px', color: '#86868b', marginBottom: '24px' }}>设置一次，上方所有工具即可自动挂载该模型引擎。</p>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <button className={`apple-btn ${aiMode === 'official' ? 'blue' : ''}`} onClick={() => setAiMode('official')}>官方 API 模式</button>
          <button className={`apple-btn ${aiMode === 'web2api' ? 'blue' : ''}`} onClick={() => setAiMode('web2api')}>代理模式 (Web2API)</button>
        </div>

        <div style={{ minHeight: '150px' }}>
          {aiMode === 'official' ? (
            <div className="fade-in">
              <label style={{ color: '#86868b', fontSize: '14px', marginBottom: '8px', display: 'block' }}>选择大模型服务商</label>
              <select className="apple-input" value={apiProvider} onChange={e => setApiProvider(e.target.value)} style={{ marginBottom: '20px' }}>
                <option value="deepseek">DeepSeek V2 (推荐)</option>
                <option value="minimax">MiniMax (海螺 AI)</option>
                <option value="openai">OpenAI (GPT-4o)</option>
              </select>
              <label style={{ color: '#86868b', fontSize: '14px', marginBottom: '8px', display: 'block' }}>API Key</label>
              <input className="apple-input" type="password" placeholder="sk-..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
            </div>
          ) : (
            <div className="fade-in">
              <label style={{ color: '#86868b', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Access Token (F12 提取)</label>
              <input className="apple-input" type="password" placeholder="eyJhbGciOi..." value={webToken} onChange={e => setWebToken(e.target.value)} />
              <p style={{ fontSize: '12px', color: '#86868b', marginTop: '12px' }}>* 需要配合本地的 openai-oauth 代理运行。</p>
            </div>
          )}
        </div>

        <button className="apple-btn" style={{ marginTop: '30px' }} onClick={handleSaveAIConfig}>
          保存并激活配置
        </button>
      </div>
    </div>
  )
}

// ==========================================
// 👑 平台总路由配置
// ==========================================
function App() {
  return (
    <Router>
      <AppleStyles /> {/* 注入全局苹果级 CSS */}
      
      {/* 顶部全局毛玻璃导航栏 */}
      <nav className="glass-nav">
        <Link to="/portal" className="nav-link">工作台</Link>
        <Link to="/shop" className="nav-link">商店</Link>
        <Link to="/orders" className="nav-link">订单</Link>
        <Link to="/tools" className="nav-link">生产力引擎</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 守卫保护的私密房间 */}
        <Route path="/portal" element={<ProtectedRoute><PortalPage /></ProtectedRoute>} />
        <Route path="/shop" element={<ProtectedRoute><BobaShop /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/tools" element={<ProtectedRoute><ToolsDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App