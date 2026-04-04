import { useState } from 'react'

const STEPS = ['Write', 'Translate', 'Review', 'Publish']

const styles = {
  body: { background: '#f5faf5', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif', overflow: 'hidden' },
  wrap: { maxWidth: '800px', margin: '0 auto' },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', border: '1px solid #d1e8d1', borderRadius: '10px', marginBottom: '16px', background: '#fff' },
  steps: { display: 'flex', alignItems: 'center', gap: '6px' },
  sep: { color: '#ccc', fontSize: '12px' },
  user: { fontSize: '12px', color: '#888' },
  card: { border: '1px solid #d1e8d1', borderRadius: '10px', padding: '14px', background: '#fff', marginBottom: '14px' },
  label: { fontSize: '11px', color: '#2a7a2a', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' },
  text: { fontSize: '13px', color: '#333', lineHeight: '1.6' },
  textarea: { width: '100%', fontSize: '13px', color: '#333', border: 'none', outline: 'none', resize: 'none', lineHeight: '1.6', background: 'transparent', fontFamily: 'Arial, sans-serif' },
  cols: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' },
  actions: { display: 'flex', gap: '10px' },
  btnGreen: { flex: 1, padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', border: 'none', background: '#1a7a1a', color: '#fff' },
  btnOutline: { flex: 1, padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', border: '1px solid #2a7a2a', background: '#fff', color: '#2a7a2a' },
  toastPub: { textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', marginTop: '12px', background: '#e8f5e8', color: '#1a5c1a' },
  toastErr: { textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', marginTop: '10px', background: '#fff3f3', color: '#b00' },
  loading: { textAlign: 'center', padding: '20px', fontSize: '13px', color: '#2a7a2a' },
  publishBox: { border: '1px solid #d1e8d1', borderRadius: '10px', padding: '20px', background: '#fff' },
  loginWrap: { maxWidth: '360px', margin: '80px auto' },
  loginCard: { border: '1px solid #d1e8d1', borderRadius: '10px', padding: '28px', background: '#fff' },
  loginTitle: { fontSize: '18px', fontWeight: '500', color: '#1a5c1a', marginBottom: '20px', textAlign: 'center' },
  input: { width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #d1e8d1', borderRadius: '8px', marginBottom: '10px', outline: 'none', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' },
  hint: { fontSize: '11px', color: '#aaa', textAlign: 'center', marginTop: '12px' },
  back: { fontSize: '12px', color: '#2a7a2a', cursor: 'pointer', marginBottom: '12px', display: 'inline-block' },
  signout: { fontSize: '12px', color: '#b00', cursor: 'pointer' },
}

function stepStyle(i, active) {
  if (i < active) return { fontSize: '13px', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', color: '#2a7a2a' }
  if (i === active) return { fontSize: '13px', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', background: '#e8f5e8', color: '#1a5c1a', fontWeight: '500' }
  return { fontSize: '13px', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', color: '#aaa' }
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')

  const [active, setActive] = useState(0)
  const [english, setEnglish] = useState('')
  const [filipino, setFilipino] = useState('')
  const [toast, setToast] = useState(null)

  function login() {
    if (email.trim() && password.trim()) {
      setLoggedIn(true)
      setLoginEmail(email)
      setLoginErr(false)
    } else {
      setLoginErr(true)
    }
  }

  function signOut() {
    setLoggedIn(false)
    setEmail('')
    setPassword('')
    setLoginEmail('')
    setActive(0)
    setEnglish('')
    setFilipino('')
    setToast(null)
  }

  async function translate() {
    if (!english.trim()) return
    setActive(1)
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(english)}&langpair=en|tl`)
      const data = await res.json()
      setFilipino(data.responseData.translatedText)
    } catch (e) {
      setFilipino('Translation failed. Please type it manually.')
    }
    setActive(2)
  }

  function approve() {
    setActive(3)
    setToast('pub')
  }

  function reject() {
    setActive(0)
    setEnglish('')
    setFilipino('')
    setToast(null)
  }

  function goBack() {
    setActive(0)
    setFilipino('')
    setToast(null)
  }

  function publishAnother() {
    setActive(0)
    setEnglish('')
    setFilipino('')
    setToast(null)
  }

  if (!loggedIn) {
    return (
      <div style={styles.body}>
        <div style={styles.loginWrap}>
          <div style={styles.loginCard}>
            <div style={styles.loginTitle}>Multilingual Journalism</div>
            <input
              style={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
            />
            <button style={{ ...styles.btnGreen, marginTop: '4px' }} onClick={login}>
              Log in
            </button>
            {loginErr && <div style={styles.toastErr}>Please enter your email and password.</div>}
            <div style={styles.hint}>demo: editor@newsroom.ph / demo123</div>
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <a href="https://docs.google.com/document/d/1U9AcoAyi7o8yjsMaNizcR5kJzDlhN7XJQ1hEaRAzbFY/edit?usp=sharing" target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#2a7a2a', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#2a7a2a"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/></svg>
                View design note
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.body}>
      <div style={styles.wrap}>

        <nav style={styles.nav}>
          <div style={styles.steps}>
            {STEPS.map((s, i) => (
              <span key={s}>
                <span style={stepStyle(i, active)}>{s}</span>
                {i < STEPS.length - 1 && <span style={styles.sep}> › </span>}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={styles.user}>Hello, Reporter {loginEmail.split('@')[0]}</span>
            <span style={styles.signout} onClick={signOut}>Sign out</span>
          </div>
        </nav>

        {active === 0 && (
          <div>
            <div style={styles.card}>
              <div style={styles.label}>Write your article in English</div>
              <textarea
                style={{ ...styles.textarea, minHeight: '160px' }}
                placeholder="Start writing here..."
                value={english}
                onChange={e => setEnglish(e.target.value)}
              />
            </div>
            <div style={styles.actions}>
              <button style={styles.btnGreen} onClick={translate} disabled={!english.trim()}>
                Translate to Filipino
              </button>
            </div>
          </div>
        )}

        {active === 1 && (
          <div style={styles.loading}>Translating to Filipino...</div>
        )}

        {active === 2 && (
          <div>
            <span style={styles.back} onClick={goBack}>Back to Write</span>
            <div style={styles.cols}>
              <div style={styles.card}>
                <div style={styles.label}>English</div>
                <p style={styles.text}>{english}</p>
              </div>
              <div style={styles.card}>
                <div style={styles.label}>Filipino — edit if needed</div>
                <textarea
                  style={styles.textarea}
                  rows={8}
                  value={filipino}
                  onChange={e => setFilipino(e.target.value)}
                />
              </div>
            </div>
            <div style={styles.actions}>
              <button style={styles.btnGreen} onClick={approve}>Approve and publish</button>
              <button style={styles.btnOutline} onClick={reject}>Reject</button>
            </div>
          </div>
        )}

        {active === 3 && (
          <div>
            <div style={styles.publishBox}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a7a1a', marginBottom: '16px' }}>Published</div>
              <div style={styles.cols}>
                <div style={styles.card}>
                  <div style={styles.label}>English</div>
                  <p style={styles.text}>{english}</p>
                </div>
                <div style={styles.card}>
                  <div style={styles.label}>Filipino</div>
                  <p style={styles.text}>{filipino}</p>
                </div>
              </div>
            </div>
            {toast === 'pub' && <div style={styles.toastPub}>Published in English and Filipino.</div>}
            <div style={styles.actions}>
              <button style={{ ...styles.btnOutline, marginTop: '12px' }} onClick={publishAnother}>Publish another article</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}