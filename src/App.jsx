import { useState } from 'react'

const STEPS = ['Write', 'Translate', 'Review', 'Publish']

const styles = {
  body: { background: '#f5faf5', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif', overflowX: 'hidden' },
  wrap: { maxWidth: '800px', margin: '0 auto' },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', border: '1px solid #d1e8d1', borderRadius: '10px', marginBottom: '16px', background: '#fff' },
  steps: { display: 'flex', alignItems: 'center', gap: '6px' },
  sep: { color: '#ccc', fontSize: '12px' },
  user: { fontSize: '12px', color: '#888' },
  card: { border: '1px solid #d1e8d1', borderRadius: '10px', padding: '14px', background: '#fff', marginBottom: '14px', maxHeight: '400px', overflowY: 'auto' },
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

function getTextFromHtml(html) {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.innerText || div.textContent || ''
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')

  const [active, setActive] = useState(0)
  const [title, setTitle] = useState('')
  const [filipino, setFilipino] = useState('')
  const [toast, setToast] = useState(null)
  const [targetLang, setTargetLang] = useState('tl')
  const [targetLangName, setTargetLangName] = useState('Filipino')
  const [blocks, setBlocks] = useState([{ type: 'text', html: '', url: '' }])
  const [activeBlock, setActiveBlock] = useState(null)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isList, setIsList] = useState(false)
  const [isFilipinoBold, setIsFilipinoBold] = useState(false)
  const [isfilipinoItalic, setIsFilipanoItalic] = useState(false)
  const [activeEditor, setActiveEditor] = useState('english')

  function checkFormat() {
    setIsBold(document.queryCommandState('bold'))
    setIsItalic(document.queryCommandState('italic'))
    setIsList(document.queryCommandState('insertUnorderedList'))
  }

  function checkFilipinoFormat() {
    setIsFilipinoBold(document.queryCommandState('bold'))
    setIsFilipanoItalic(document.queryCommandState('italic'))
  }

  function addBlock(type) {
    setBlocks(prev => [...prev, { type, html: '', url: '' }])
  }

  function updateBlock(i, html) {
    setBlocks(prev => { const u = [...prev]; u[i] = { ...u[i], html }; return u })
  }

  function updateImageUrl(i, url) {
    setBlocks(prev => { const u = [...prev]; u[i] = { ...u[i], url }; return u })
  }

  function removeBlock(i) {
    setBlocks(prev => prev.filter((_, j) => j !== i))
  }

  function applyFormat(cmd) {
    document.execCommand(cmd, false, null)
    checkFormat()
    if (activeBlock !== null) {
      const el = document.querySelector(`[data-block="${activeBlock}"]`)
      if (el) updateBlock(activeBlock, el.innerHTML)
    }
  }

  function applyBullet() {
    document.execCommand('insertUnorderedList', false, null)
    checkFormat()
    if (activeBlock !== null) {
      const el = document.querySelector(`[data-block="${activeBlock}"]`)
      if (el) updateBlock(activeBlock, el.innerHTML)
    }
  }

  function applyFilipinoFormat(cmd) {
    document.execCommand(cmd, false, null)
    checkFilipinoFormat()
    const el = document.getElementById('filipino-editor')
    if (el) setFilipino(el.innerHTML)
  }

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
    setTitle('')
    setFilipino('')
    setToast(null)
    setBlocks([{ type: 'text', html: '', url: '' }])
  }

  async function translate() {
    const textBlocks = blocks.filter(b => b.type === 'text')
    if (!textBlocks.some(b => getTextFromHtml(b.html).trim())) return
    setActive(1)
    try {
      const combinedHtml = textBlocks.map(b => `<div>${b.html}</div>`).join('')
      const res = await fetch('https://translator-backend-0lo3.onrender.com/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: '', html: combinedHtml, target: targetLang })
      })
      const data = await res.json()
      setFilipino(data.translated)
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
    setTitle('')
    setFilipino('')
    setToast(null)
    setBlocks([{ type: 'text', html: '', url: '' }])
  }

  function goBack() {
    setActive(0)
    setFilipino('')
    setToast(null)
  }

  function publishAnother() {
    setActive(0)
    setTitle('')
    setFilipino('')
    setToast(null)
    setBlocks([{ type: 'text', html: '', url: '' }])
  }

  if (!loggedIn) {
    return (
      <div style={styles.body}>
        <div style={styles.loginWrap}>
          <div style={styles.loginCard}>
            <div style={styles.loginTitle}>Multilingual Journalism</div>
            <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
            <button style={{ ...styles.btnGreen, marginTop: '4px' }} onClick={login}>Log in</button>
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
            <div style={{ display: 'flex', gap: '4px', padding: '8px 12px', background: '#fff', border: '1px solid #d1e8d1', borderRadius: '10px', marginBottom: '8px' }}>
              <button onMouseDown={e => { e.preventDefault(); applyFormat('bold') }} style={{ fontWeight: 'bold', fontSize: '12px', padding: '2px 10px', borderRadius: '4px', border: '1px solid #d1e8d1', background: isBold ? '#d1e8d1' : '#f9fdf9', cursor: 'pointer', color: '#333' }}>B</button>
              <button onMouseDown={e => { e.preventDefault(); applyFormat('italic') }} style={{ fontStyle: 'italic', fontSize: '12px', padding: '2px 10px', borderRadius: '4px', border: '1px solid #d1e8d1', background: isItalic ? '#d1e8d1' : '#f9fdf9', cursor: 'pointer', color: '#333' }}>I</button>
              <button onMouseDown={e => { e.preventDefault(); applyBullet() }} style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '4px', border: '1px solid #d1e8d1', background: isList ? '#d1e8d1' : '#f9fdf9', cursor: 'pointer', color: '#333' }}>• List</button>
            </div>

            <div style={styles.card}>
              <div style={styles.label}>Write your article in English</div>
              <input
                type="text"
                style={{ ...styles.input, fontWeight: '500', fontSize: '15px', marginBottom: '12px' }}
                placeholder="Article title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              {blocks.map((block, i) => (
                <div key={i} style={{ marginBottom: '10px', position: 'relative' }}>
                  <span onClick={() => removeBlock(i)} style={{ position: 'absolute', right: '0', top: '0', fontSize: '11px', color: '#aaa', cursor: 'pointer', zIndex: 1 }}>remove</span>
                  {block.type === 'text' ? (
                    <div
                      data-block={i}
                      contentEditable
                      suppressContentEditableWarning
                      onFocus={() => { setActiveBlock(i); setActiveEditor('english'); checkFormat() }}
                      onInput={e => updateBlock(i, e.currentTarget.innerHTML)}
                      onKeyUp={checkFormat}
                      onMouseUp={checkFormat}
                      onSelect={checkFormat}
                      style={{ minHeight: '80px', fontSize: '13px', color: '#333', lineHeight: '1.6', outline: 'none', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', paddingRight: '50px', fontFamily: 'Arial, sans-serif' }}
                      data-placeholder="Write a paragraph..."
                    />
                  ) : (
                    <div style={{ paddingRight: '50px' }}>
                      <input type="text" style={{ ...styles.input, marginBottom: '4px' }} placeholder="Paste image URL..." value={block.url || ''} onChange={e => updateImageUrl(i, e.target.value)} />
                      {block.url && <img src={block.url} alt="" style={{ width: '100%', borderRadius: '6px', marginTop: '4px' }} />}
                    </div>
                  )}
                </div>
              ))}
              <style>{`
                [contenteditable]:empty:before { content: attr(data-placeholder); color: #aaa; pointer-events: none; display: block; }
                [contenteditable] ul { padding-left: 20px; margin: 0; }
                [contenteditable] li { margin: 2px 0; }
              `}</style>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={() => addBlock('text')} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #d1e8d1', background: '#fff', cursor: 'pointer', color: '#2a7a2a' }}>+ Paragraph</button>
                <button onClick={() => addBlock('image')} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #d1e8d1', background: '#fff', cursor: 'pointer', color: '#2a7a2a' }}>+ Image</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              <select style={{ ...styles.input, width: '50%', cursor: 'pointer', marginBottom: '0' }} value={targetLang} onChange={e => { setTargetLang(e.target.value); setTargetLangName(e.target.options[e.target.selectedIndex].text) }}>
                <option value="tl">Filipino</option>
                <option value="ceb">Cebuano</option>
                <option value="ilo">Ilocano</option>
                <option value="hil">Hiligaynon</option>
              </select>
              <button style={{ ...styles.btnGreen, width: '50%' }} onClick={translate} disabled={!blocks.some(b => b.type === 'text' && getTextFromHtml(b.html).trim())}>
                Translate to {targetLangName}
              </button>
            </div>
          </div>
        )}

        {active === 1 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '13px', color: '#2a7a2a', marginBottom: '16px' }}>Translating to {targetLangName}...</div>
            <div style={{ width: '100%', height: '4px', background: '#e8f5e8', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ height: '100%', width: '40%', background: '#1a7a1a', borderRadius: '4px', animation: 'slide 1.5s infinite ease-in-out' }} />
            </div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>
              If it takes too long, the backend may be waking up.{' '}
              <a href="https://translator-backend-0lo3.onrender.com" target="_blank" rel="noreferrer" style={{ color: '#2a7a2a' }}>Click here to wake it up</a>, then come back.
            </div>
            <style>{`@keyframes slide { 0% { transform: translateX(-100%) } 100% { transform: translateX(350%) } }`}</style>
          </div>
        )}

        {active === 2 && (
          <div>
            <span style={styles.back} onClick={goBack}>Back to Write</span>

            <div style={{ display: 'flex', gap: '4px', padding: '8px 12px', background: '#fff', border: '1px solid #d1e8d1', borderRadius: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#aaa', marginRight: '8px', lineHeight: '26px' }}>Filipino formatting:</span>
              <button onMouseDown={e => { e.preventDefault(); applyFilipinoFormat('bold') }} style={{ fontWeight: 'bold', fontSize: '12px', padding: '2px 10px', borderRadius: '4px', border: '1px solid #d1e8d1', background: isFilipinoBold ? '#d1e8d1' : '#f9fdf9', cursor: 'pointer', color: '#333' }}>B</button>
              <button onMouseDown={e => { e.preventDefault(); applyFilipinoFormat('italic') }} style={{ fontStyle: 'italic', fontSize: '12px', padding: '2px 10px', borderRadius: '4px', border: '1px solid #d1e8d1', background: isfilipanoItalic ? '#d1e8d1' : '#f9fdf9', cursor: 'pointer', color: '#333' }}>I</button>
            </div>

            <div style={styles.cols}>
              <div style={{ border: '1px solid #d1e8d1', borderRadius: '10px', background: '#fff', marginBottom: '14px' }}>
                <div style={{ padding: '10px 14px 6px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={styles.label}>English</div>
                </div>
                <div style={{ padding: '10px 14px', maxHeight: '360px', overflowY: 'auto' }}>
                  {title && <p style={{ fontWeight: '500', fontSize: '14px', marginBottom: '8px', color: '#333' }}>{title}</p>}
                  {blocks.map((block, i) => (
                    <div key={i} style={{ marginBottom: '10px' }}>
                      {block.type === 'text'
                        ? <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: block.html }} />
                        : block.url && <img src={block.url} alt="" style={{ width: '100%', borderRadius: '6px' }} />
                      }
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ border: '1px solid #d1e8d1', borderRadius: '10px', background: '#fff', marginBottom: '14px' }}>
                <div style={{ padding: '10px 14px 6px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={styles.label}>{targetLangName} — edit if needed</div>
                </div>
                <div style={{ padding: '10px 14px', maxHeight: '360px', overflowY: 'auto' }}>
                  <div
                    id="filipino-editor"
                    contentEditable
                    suppressContentEditableWarning
                    onFocus={() => { setActiveEditor('filipino'); checkFilipinoFormat() }}
                    onInput={e => setFilipino(e.currentTarget.innerHTML)}
                    onKeyUp={checkFilipinoFormat}
                    onMouseUp={checkFilipinoFormat}
                    onSelect={checkFilipinoFormat}
                    style={{ minHeight: '340px', fontSize: '13px', color: '#333', lineHeight: '1.6', outline: 'none', fontFamily: 'Arial, sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: filipino }}
                  />
                </div>
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
                  {title && <p style={{ fontWeight: '500', fontSize: '14px', marginBottom: '8px', color: '#333' }}>{title}</p>}
                  {blocks.map((block, i) => (
                    <div key={i} style={{ marginBottom: '10px' }}>
                      {block.type === 'text'
                        ? <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: block.html }} />
                        : block.url && <img src={block.url} alt="" style={{ width: '100%', borderRadius: '6px' }} />
                      }
                    </div>
                  ))}
                </div>
                <div style={styles.card}>
                  <div style={styles.label}>{targetLangName}</div>
                  <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: filipino }} />
                </div>
              </div>
            </div>
            {toast === 'pub' && <div style={styles.toastPub}>Published in English and {targetLangName}.</div>}
            <div style={styles.actions}>
              <button style={{ ...styles.btnOutline, marginTop: '12px' }} onClick={publishAnother}>Publish another article</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}