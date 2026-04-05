import { useState, useRef, useEffect } from 'react'

const API_URL = 'https://newspublish-backend.onrender.com'

const STEPS = ['Write', 'Translate', 'Review', 'Publish']

function EditableBlock({ index, initialHtml, onUpdate, onFocus, onFormatCheck }) {
  const ref = useRef(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (ref.current && !initialized.current && initialHtml) {
      ref.current.innerHTML = initialHtml
      initialized.current = true
    }
  }, [])

  return (
    <div
      ref={ref}
      data-block={index}
      contentEditable
      suppressContentEditableWarning
      onFocus={onFocus}
      onInput={() => {
        if (ref.current) onUpdate(index, ref.current.innerHTML)
      }}
      onKeyUp={onFormatCheck}
      onMouseUp={onFormatCheck}
      onSelect={onFormatCheck}
      style={{ minHeight: '80px', fontSize: '13px', color: '#333', lineHeight: '1.6', outline: 'none', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', paddingRight: '50px', fontFamily: 'Arial, sans-serif' }}
      data-placeholder="Write a paragraph..."
    />
  )
}

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
  wordCount: { fontSize: '11px', color: '#aaa', fontFamily: 'Arial, sans-serif' },
  wordCountBlock: { fontSize: '11px', color: '#aaa', textAlign: 'right', marginTop: '12px', paddingTop: '6px', borderTop: '1px solid #f0f0f0', fontFamily: 'Arial, sans-serif' },
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

function countWordsAndChars(text) {
  const trimmed = text.trim()
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  const chars = trimmed.length
  return { words, chars }
}

function getArticleStats(title, subtitle, blocks) {
  const titleText = title || ''
  const subtitleText = subtitle || ''
  const blocksText = (blocks || [])
    .filter(b => b.type === 'text')
    .map(b => getTextFromHtml(b.html || ''))
    .join(' ')
  const combined = `${titleText} ${subtitleText} ${blocksText}`
  return countWordsAndChars(combined)
}

function getTranslatedStats(translatedTitle, translatedSubtitle, translatedHtml) {
  const combined = `${translatedTitle || ''} ${translatedSubtitle || ''} ${getTextFromHtml(translatedHtml || '')}`
  return countWordsAndChars(combined)
}

function formatStats(s) {
  return `${s.words.toLocaleString()} words · ${s.chars.toLocaleString()} characters`
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')

  const [active, setActive] = useState(0)
  const [view, setView] = useState('writer')
  const [historyList, setHistoryList] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [articleDate, setArticleDate] = useState(new Date().toISOString().split('T')[0])
  const [filipino, setFilipino] = useState('')
  const [translatedTitle, setTranslatedTitle] = useState('')
  const [translatedSubtitle, setTranslatedSubtitle] = useState('')
  const [toast, setToast] = useState(null)
  const [targetLang, setTargetLang] = useState('tl')
  const [targetLangName, setTargetLangName] = useState('Filipino')
  const [blocks, setBlocks] = useState([{ id: 1, type: 'text', html: '', url: '' }])
  const blockIdCounter = useRef(2)
  const [activeBlock, setActiveBlock] = useState(null)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isList, setIsList] = useState(false)
  const [isFilipinoBold, setIsFilipinoBold] = useState(false)
  const [isfilipinoItalic, setIsFilipinoItalic] = useState(false)
  const [activeEditor, setActiveEditor] = useState('english')
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishError, setPublishError] = useState(false)
  const [publishErrorMsg, setPublishErrorMsg] = useState('')

  useEffect(() => {
  const interval = setInterval(() => {
    const draft = {
      title,
      subtitle,
      articleDate,
      blocks,
      filipino,
      translatedTitle,
      translatedSubtitle,
      targetLang,
      targetLangName
    }

    localStorage.setItem('news_draft', JSON.stringify(draft))
  }, 2000) // every 2 seconds

  return () => clearInterval(interval)
}, [
  title,
  subtitle,
  articleDate,
  blocks,
  filipino,
  translatedTitle,
  translatedSubtitle,
  targetLang,
  targetLangName
])

function hasUnsavedChanges() {
  const hasTextBlocks = blocks.some(b =>
    b.type === 'text' && b.html && b.html.replace(/<[^>]*>/g, '').trim()
  )

  const hasMedia = blocks.some(b =>
    (b.type === 'image' || b.type === 'video') && b.url
  )

  return (
    title.trim() ||
    subtitle.trim() ||
    hasTextBlocks ||
    hasMedia
  )
}
useEffect(() => {
  const saved = localStorage.getItem('news_draft')
  if (!saved) return

  try {
    const draft = JSON.parse(saved)

    setTitle(draft.title || '')
    setSubtitle(draft.subtitle || '')
    setArticleDate(draft.articleDate || new Date().toISOString().split('T')[0])
    setBlocks(draft.blocks || [{ id: 1, type: 'text', html: '', url: '' }])
    setFilipino(draft.filipino || '')
    setTranslatedTitle(draft.translatedTitle || '')
    setTranslatedSubtitle(draft.translatedSubtitle || '')
    setTargetLang(draft.targetLang || 'tl')
    setTargetLangName(draft.targetLangName || 'Filipino')
  } catch (e) {
    console.warn('Failed to load draft')
  }
}, [])
  function checkFormat() {
    setIsBold(document.queryCommandState('bold'))
    setIsItalic(document.queryCommandState('italic'))
    setIsList(document.queryCommandState('insertUnorderedList'))
  }

  function checkFilipinoFormat() {
    setIsFilipinoBold(document.queryCommandState('bold'))
    setIsFilipinoItalic(document.queryCommandState('italic'))
  }

  function addBlock(type) {
    const id = blockIdCounter.current++
    setBlocks(prev => [...prev, { id, type, html: '', url: '' }])
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

  function moveBlock(i, dir) {
    setBlocks(prev => {
      const newIndex = i + dir
      if (newIndex < 0 || newIndex >= prev.length) return prev
      const u = [...prev]
      const temp = u[i]
      u[i] = u[newIndex]
      u[newIndex] = temp
      return u
    })
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

  function applyNoTranslate() {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return
    const range = sel.getRangeAt(0)
    const span = document.createElement('span')
    span.className = 'no-translate'
    span.setAttribute('data-nt', '1')
    try {
      span.appendChild(range.extractContents())
      range.insertNode(span)
    } catch (e) {
      return
    }
    sel.removeAllRanges()
    if (activeBlock !== null) {
      const el = document.querySelector(`[data-block="${activeBlock}"]`)
      if (el) updateBlock(activeBlock, el.innerHTML)
    }
  }

  function removeNoTranslate() {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    let node = range.commonAncestorContainer
    while (node && node.nodeType === 3) node = node.parentNode
    const existing = node && node.closest ? node.closest('span.no-translate') : null
    if (!existing) return
    const parent = existing.parentNode
    while (existing.firstChild) parent.insertBefore(existing.firstChild, existing)
    parent.removeChild(existing)
    sel.removeAllRanges()
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

  function freshBlock() {
    const id = blockIdCounter.current++
    return { id, type: 'text', html: '', url: '' }
  }

  function signOut() {
    if (hasUnsavedChanges()) {
      const ok = confirm("You have unsaved work. Signing out will discard it. Continue?")
      if (!ok) return
    }

    setLoggedIn(false)
    setEmail('')
    setPassword('')
    setLoginEmail('')
    setActive(0)
    setTitle('')
    setSubtitle('')
    setArticleDate(new Date().toISOString().split('T')[0])
    setFilipino('')
    setTranslatedTitle('')
    setTranslatedSubtitle('')
    setToast(null)
    setBlocks([freshBlock()])
    setView('writer')
    setHistoryList([])
    setSelectedArticle(null)
    setEditingId(null)
    setPublishError(false)
    setIsPublishing(false)
  }

  async function translate() {
    const textBlocks = blocks.filter(b => b.type === 'text')
    if (!textBlocks.some(b => getTextFromHtml(b.html).trim())) return
    setActive(1)

    function protect(html) {
      const protected_items = []
      const div = document.createElement('div')
      div.innerHTML = html
      const spans = div.querySelectorAll('span.no-translate')
      spans.forEach((span, idx) => {
        protected_items.push(span.innerHTML)
        const placeholder = document.createTextNode(`__NT${idx}__`)
        span.parentNode.replaceChild(placeholder, span)
      })
      return { html: div.innerHTML, items: protected_items }
    }

    function restore(translatedHtml, items) {
      let result = translatedHtml
      items.forEach((original, idx) => {
        const re = new RegExp(`_+\\s*N\\s*T\\s*${idx}\\s*_+`, 'gi')
        result = result.replace(re, `<span class="no-translate">${original}</span>`)
      })
      return result
    }

    function restoreVideos(html) {
      return html.replace(
        /<div data-video="(.*?)"><\/div>/g,
        (_, url) => {
          try {
            const u = new URL(url)

            if (u.hostname.includes("youtube.com")) {
              const id = u.searchParams.get("v")
              if (id) return `<iframe src="https://www.youtube.com/embed/${id}" style="width:100%;aspect-ratio:16/9;border-radius:6px;border:none;"></iframe>`
            }

            if (u.hostname === "youtu.be") {
              const id = u.pathname.slice(1)
              if (id) return `<iframe src="https://www.youtube.com/embed/${id}" style="width:100%;aspect-ratio:16/9;border-radius:6px;border:none;"></iframe>`
            }

            return ''
          } catch {
            return ''
          }
        }
      )
    }
    try {
      const combinedHtml = blocks.map(b => {
        if (b.type === 'text') {
          return `<div>${b.html}</div>`
        }

        if (b.type === 'image' && b.url) {
          return `<div><img src="${b.url}" /></div>`
        }

        if (b.type === 'video' && b.url) {
          return `<div data-video="${b.url}"></div>`
        }

        return ''
      }).join('')
      const protectedBody = protect(combinedHtml)
      const protectedTitle = title.trim() ? protect(title) : null
      const protectedSubtitle = subtitle.trim() ? protect(subtitle) : null

      const fetches = [
        fetch('https://translator-backend-0lo3.onrender.com/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: '', html: protectedBody.html, target: targetLang })
        })
      ]
      if (protectedTitle) {
        fetches.push(fetch('https://translator-backend-0lo3.onrender.com/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: protectedTitle.html, target: targetLang })
        }))
      }
      if (protectedSubtitle) {
        fetches.push(fetch('https://translator-backend-0lo3.onrender.com/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: protectedSubtitle.html, target: targetLang })
        }))
      }
      const results = await Promise.all(fetches)
      const dataBody = await results[0].json()

      const restored = restore(dataBody.translated, protectedBody.items)
      const finalHtml = restoreVideos(restored)

      setFilipino(finalHtml)
      if (protectedTitle && results[1]) {
        const dataTitle = await results[1].json()
        setTranslatedTitle(restore(dataTitle.translated || title, protectedTitle.items))
      } else {
        setTranslatedTitle('')
      }
      if (protectedSubtitle) {
        const idx = protectedTitle ? 2 : 1
        if (results[idx]) {
          const dataSub = await results[idx].json()
          setTranslatedSubtitle(restore(dataSub.translated || subtitle, protectedSubtitle.items))
        }
      } else {
        setTranslatedSubtitle('')
      }
    } catch (e) {
      setFilipino('Translation failed. Please type it manually.')
      setTranslatedTitle(title)
      setTranslatedSubtitle(subtitle)
    }
    setActive(2)
  }

  async function approve() {
    setIsPublishing(true)
    setPublishError(false)
    const payload = {
      title,
      subtitle,
      article_date: articleDate,
      blocks: blocks.map(b => ({ type: b.type === 'video' ? 'video' : b.type, html: b.html || '', url: b.url || '' })),
      translated_title: translatedTitle,
      translated_subtitle: translatedSubtitle,
      translated_html: filipino,
      target_lang: targetLang,
      target_lang_name: targetLangName,
      author_email: loginEmail
    }
    try {
      if (editingId) {
        const delRes = await fetch(`${API_URL}/articles/${editingId}`, { method: 'DELETE' })
        if (!delRes.ok) throw new Error(`Delete failed: ${delRes.status}`)
      }
      const res = await fetch(`${API_URL}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        let msg = 'Something went wrong.'
        try {
          const errData = await res.json()
          if (errData.error) msg = errData.error
        } catch (_) {}
        throw new Error(msg)
      }
      const saved = await res.json()
      if (!saved || (!saved.id && !saved._id)) {
        throw new Error('Save returned no article ID')
      }
      setEditingId(null)
      setIsPublishing(false)
      setActive(3)
      setToast('pub')
      localStorage.removeItem('news_draft')
    } catch (err) {
      setIsPublishing(false)
      setPublishError(true)
      setPublishErrorMsg(err.message)
    }
  }

  async function loadHistory() {
    setHistoryLoading(true)
    try {
      const res = await fetch(`${API_URL}/articles?limit=50`)
      const data = await res.json()
      setHistoryList(data.articles || [])
    } catch (err) {
      console.warn('Failed to load history:', err)
      setHistoryList([])
    }
    setHistoryLoading(false)
  }

  async function openArticle(id) {
    try {
      const res = await fetch(`${API_URL}/articles/${id}`)
      const data = await res.json()
      setSelectedArticle(data)
      setView('article')
    } catch (err) {
      console.warn('Failed to load article:', err)
    }
  }

  async function deleteArticle(id) {
    if (!confirm('Delete this article? This cannot be undone.')) return
    try {
      await fetch(`${API_URL}/articles/${id}`, { method: 'DELETE' })
      setHistoryList(prev => prev.filter(a => a.id !== id))
      if (selectedArticle && selectedArticle.id === id) {
        setSelectedArticle(null)
        setView('history')
      }
    } catch (err) {
      console.warn('Failed to delete:', err)
    }
  }

  function editArticle(article) {
    setTitle(article.title || '')
    setSubtitle(article.subtitle || '')
    setArticleDate(article.article_date || new Date().toISOString().split('T')[0])
    setTargetLang(article.target_lang || 'tl')
    setTargetLangName(article.target_lang_name || 'Filipino')
    setFilipino(article.translated_html || '')
    setTranslatedTitle(article.translated_title || '')
    setTranslatedSubtitle(article.translated_subtitle || '')
    const restoredBlocks = (article.blocks || []).map(b => ({
      id: blockIdCounter.current++,
      type: b.type,
      html: b.html || '',
      url: b.url || ''
    }))
    setBlocks(restoredBlocks.length > 0 ? restoredBlocks : [freshBlock()])
    setEditingId(article.id)
    setActive(0)
    setView('writer')
    setSelectedArticle(null)
    setToast(null)
  }

  function goToHistory() {
    setView('history')
    loadHistory()
  }

  function reject() {
    if (hasUnsavedChanges()) {
      const ok = confirm("You have unsaved changes. Discard this article?")
      if (!ok) return
    }

    setActive(0)
    setTitle('')
    setSubtitle('')
    setArticleDate(new Date().toISOString().split('T')[0])
    setFilipino('')
    setTranslatedTitle('')
    setTranslatedSubtitle('')
    setToast(null)
    setBlocks([freshBlock()])
    setEditingId(null)
    setPublishError(false)
    setPublishErrorMsg('')
  }

  function goBack() {
    setActive(0)
    setFilipino('')
    setTranslatedTitle('')
    setTranslatedSubtitle('')
    setToast(null)
    setPublishError(false)
    setPublishErrorMsg('')
  }

  function publishAnother() {
    setActive(0)
    setTitle('')
    setSubtitle('')
    setArticleDate(new Date().toISOString().split('T')[0])
    setFilipino('')
    setTranslatedTitle('')
    setTranslatedSubtitle('')
    setToast(null)
    setBlocks([freshBlock()])
    setEditingId(null)
    setPublishError(false)
    setPublishErrorMsg('')
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
              <a href="https://docs.google.com/document/d/1IqrlQRM_Y0yBpPONeIyfPn4hsTw_we_Bph4aAYRLL9k/edit?usp=sharing" target="_blank" rel="noreferrer" style={{ fontSize: '11px', color: '#2a7a2a', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#2a7a2a"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/></svg>
                View design note
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const englishStats = getArticleStats(title, subtitle, blocks)
  const translatedStats = getTranslatedStats(translatedTitle, translatedSubtitle, filipino)

  return (
    <div style={styles.body}>
      <style>{`
        ul { padding-left: 20px; margin: 4px 0; }
        li { margin: 2px 0; }
        [contenteditable]:empty:before { content: attr(data-placeholder); color: #aaa; pointer-events: none; display: block; }
        span.no-translate { background: #fff8d4; border-bottom: 1px dashed #c9a227; padding: 0 2px; border-radius: 2px; }
        #filipino-editor img, .published-filipino img { width: 100%; border-radius: 6px; margin: 6px 0; display: block; }
        @keyframes slide { 0% { transform: translateX(-100%) } 100% { transform: translateX(350%) } }
      `}</style>

      <div style={styles.wrap}>
        <nav style={styles.nav}>
          <div style={styles.steps}>
            {view === 'writer' ? (
              STEPS.map((s, i) => (
                <span key={s}>
                  <span style={stepStyle(i, active)}>
                    {i === 3 && isPublishing ? 'Publishing...' : i === 3 && active === 3 ? 'Published' : s}
                  </span>
                  {i < STEPS.length - 1 && <span style={styles.sep}> › </span>}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a5c1a' }}>
                {view === 'history' ? 'Published articles' : 'Article view'}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {view === 'writer' ? (
              <span onClick={goToHistory} style={{ fontSize: '12px', color: '#2a7a2a', cursor: 'pointer', fontWeight: '500' }}>History</span>
            ) : (
              <span onClick={() => { setView('writer'); setSelectedArticle(null) }} style={{ fontSize: '12px', color: '#2a7a2a', cursor: 'pointer', fontWeight: '500' }}>+ New article</span>
            )}
            <span style={styles.user}>Hello, Reporter {loginEmail.split('@')[0]}</span>
            <span style={styles.signout} onClick={signOut}>Sign out</span>
          </div>
        </nav>

        {view === 'writer' && <>

        {active === 0 && (
          <div>
            <div style={{ display: 'flex', gap: '4px', padding: '8px 12px', background: '#fff', border: '1px solid #d1e8d1', borderRadius: '10px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button onMouseDown={e => { e.preventDefault(); applyFormat('bold') }} style={{ fontWeight: 'bold', fontSize: '12px', padding: '2px 10px', borderRadius: '4px', border: '1px solid #d1e8d1', background: isBold ? '#d1e8d1' : '#f9fdf9', cursor: 'pointer', color: '#333' }}>B</button>
              <button onMouseDown={e => { e.preventDefault(); applyFormat('italic') }} style={{ fontStyle: 'italic', fontSize: '12px', padding: '2px 10px', borderRadius: '4px', border: '1px solid #d1e8d1', background: isItalic ? '#d1e8d1' : '#f9fdf9', cursor: 'pointer', color: '#333' }}>I</button>
              <button onMouseDown={e => { e.preventDefault(); applyBullet() }} style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '4px', border: '1px solid #d1e8d1', background: isList ? '#d1e8d1' : '#f9fdf9', cursor: 'pointer', color: '#333' }}>• List</button>
              <span style={{ width: '1px', height: '16px', background: '#d1e8d1', margin: '0 4px' }} />
              <button onMouseDown={e => { e.preventDefault(); applyNoTranslate() }} title="Highlight text and click to keep it untranslated" style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '4px', border: '1px solid #e0c867', background: '#fff8d4', cursor: 'pointer', color: '#8a6a1a' }}>Don't translate</button>
              <button onMouseDown={e => { e.preventDefault(); removeNoTranslate() }} title="Click inside a highlighted section to remove the highlight" style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '4px', border: '1px solid #d1e8d1', background: '#f9fdf9', cursor: 'pointer', color: '#666' }}>Remove highlight</button>
            </div>

            <div style={styles.card}>
              <div style={styles.label}>{editingId ? 'Editing article' : 'Write your article in English'}</div>
              <input
                type="text"
                style={{ ...styles.input, fontWeight: '700', fontSize: '20px', marginBottom: '4px', border: 'none', borderBottom: '1px solid #f0f0f0', borderRadius: '0', paddingLeft: '0' }}
                placeholder="Article headline..."
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <input
                type="text"
                style={{ ...styles.input, fontSize: '13px', color: '#666', marginBottom: '8px', border: 'none', borderBottom: '1px solid #f0f0f0', borderRadius: '0', paddingLeft: '0' }}
                placeholder="Subheadline — a short summary of the article..."
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: '#888' }}>Date:</span>
                <input
                  type="date"
                  style={{ ...styles.input, width: 'auto', marginBottom: '0', fontSize: '12px', color: '#555' }}
                  value={articleDate}
                  onChange={e => setArticleDate(e.target.value)}
                />
              </div>
              {blocks.map((block, i) => (
                <div key={block.id} style={{ marginBottom: '10px', position: 'relative', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '2px' }}>
                    <button onClick={() => moveBlock(i, -1)} disabled={i === 0} style={{ width: '22px', height: '22px', fontSize: '10px', border: '1px solid #d1e8d1', borderRadius: '4px', background: i === 0 ? '#f5f5f5' : '#fff', color: i === 0 ? '#ccc' : '#2a7a2a', cursor: i === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>▲</button>
                    <button onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1} style={{ width: '22px', height: '22px', fontSize: '10px', border: '1px solid #d1e8d1', borderRadius: '4px', background: i === blocks.length - 1 ? '#f5f5f5' : '#fff', color: i === blocks.length - 1 ? '#ccc' : '#2a7a2a', cursor: i === blocks.length - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>▼</button>
                  </div>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <span onClick={() => removeBlock(i)} style={{ position: 'absolute', right: '0', top: '0', fontSize: '11px', color: '#aaa', cursor: 'pointer', zIndex: 1 }}>remove</span>
                    {block.type === 'text' ? (
                      <EditableBlock
                        key={block.id}
                        index={i}
                        initialHtml={block.html}
                        onUpdate={updateBlock}
                        onFocus={() => { setActiveBlock(i); setActiveEditor('english'); checkFormat() }}
                        onFormatCheck={checkFormat}
                      />
                    ) : block.type === 'video' ? (
                      <div style={{ paddingRight: '50px' }}>
                        <input type="text" style={{ ...styles.input, marginBottom: '4px' }} placeholder="Paste YouTube URL..." value={block.url || ''} onChange={e => updateImageUrl(i, e.target.value)} />
                        {block.url && (
                          <iframe
                            src={(() => {
                              try {
                                const u = new URL(block.url)

                                // Handle youtube.com
                                if (u.hostname.includes("youtube.com")) {
                                  const id = u.searchParams.get("v")
                                  if (id) return `https://www.youtube.com/embed/${id}`
                                }

                                // Handle youtu.be short links
                                if (u.hostname === "youtu.be") {
                                  const id = u.pathname.slice(1)
                                  if (id) return `https://www.youtube.com/embed/${id}`
                                }

                                return ""
                              } catch {
                                return ""
                              }
                            })()}
                            style={{ width: '100%', aspectRatio: '16/9', borderRadius: '6px', marginTop: '4px', border: 'none' }}
                            allowFullScreen
                          />
                        )}
                      </div>
                    ) : (
                      <div style={{ paddingRight: '50px' }}>
                        <input type="text" style={{ ...styles.input, marginBottom: '4px' }} placeholder="Paste image URL..." value={block.url || ''} onChange={e => updateImageUrl(i, e.target.value)} />
                        {block.url && <img src={block.url} alt="" style={{ width: '100%', borderRadius: '6px', marginTop: '4px' }} />}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => addBlock('text')} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #d1e8d1', background: '#fff', cursor: 'pointer', color: '#2a7a2a' }}>+ Paragraph</button>
                  <button onClick={() => addBlock('image')} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #d1e8d1', background: '#fff', cursor: 'pointer', color: '#2a7a2a' }}>+ Image</button>
                  <button onClick={() => addBlock('video')} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #d1e8d1', background: '#fff', cursor: 'pointer', color: '#2a7a2a' }}>+ Video</button>
                </div>
                <div style={styles.wordCount}>{formatStats(englishStats)}</div>
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
              <a href="https://newspublish-backend.onrender.com" target="_blank" rel="noreferrer" style={{ color: '#2a7a2a' }}>Click here to wake it up</a>, then come back.
            </div>
          </div>
        )}

                {active === 2 && (
          <div>
            <span style={styles.back} onClick={goBack}>Back to Write</span>

            <div style={{ display: 'flex', gap: '4px', padding: '8px 12px', background: '#fff', border: '1px solid #d1e8d1', borderRadius: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#aaa', marginRight: '8px', lineHeight: '26px' }}>Filipino formatting:</span>
              <button onMouseDown={e => { e.preventDefault(); applyFilipinoFormat('bold') }} style={{ fontWeight: 'bold', fontSize: '12px', padding: '2px 10px', borderRadius: '4px', border: '1px solid #d1e8d1', background: isFilipinoBold ? '#d1e8d1' : '#f9fdf9', cursor: 'pointer', color: '#333' }}>B</button>
              <button onMouseDown={e => { e.preventDefault(); applyFilipinoFormat('italic') }} style={{ fontStyle: 'italic', fontSize: '12px', padding: '2px 10px', borderRadius: '4px', border: '1px solid #d1e8d1', background: isfilipinoItalic ? '#d1e8d1' : '#f9fdf9', cursor: 'pointer', color: '#333' }}>I</button>
            </div>

            <div style={styles.cols}>
              <div style={{ border: '1px solid #d1e8d1', borderRadius: '10px', background: '#fff', marginBottom: '14px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 14px 6px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={styles.label}>English</div>
                </div>
                <div style={{ padding: '10px 14px', maxHeight: '360px', overflowY: 'auto', flex: 1 }}>
                  {title && <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px', color: '#333', marginTop: 0 }}>{title}</h2>}
                  {subtitle && <p style={{ fontSize: '13px', color: '#666', marginBottom: '6px', lineHeight: '1.5' }}>{subtitle}</p>}
                  {articleDate && <p style={{ fontSize: '11px', color: '#999', marginBottom: '12px' }}>{new Date(articleDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                  {blocks.map((block, i) => {
                    const getYouTubeEmbed = (url) => {
                      try {
                        const u = new URL(url)

                        if (u.hostname.includes("youtube.com")) {
                          const id = u.searchParams.get("v")
                          if (id) return `https://www.youtube.com/embed/${id}`
                        }

                        if (u.hostname === "youtu.be") {
                          const id = u.pathname.slice(1)
                          if (id) return `https://www.youtube.com/embed/${id}`
                        }

                        return null
                      } catch {
                        return null
                      }
                    }

                    const embedUrl = block.type === 'video' ? getYouTubeEmbed(block.url) : null

                    return (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        
                        {block.type === 'text' && (
                          <div
                            style={{ fontSize: '13px', color: '#333', lineHeight: '1.6' }}
                            dangerouslySetInnerHTML={{ __html: block.html }}
                          />
                        )}

                        {block.type === 'image' && block.url && (
                          <img
                            src={block.url}
                            alt=""
                            style={{ width: '100%', borderRadius: '6px' }}
                          />
                        )}

                        {block.type === 'video' && embedUrl && (
                          <iframe
                            src={embedUrl}
                            style={{
                              width: '100%',
                              aspectRatio: '16/9',
                              borderRadius: '6px',
                              border: 'none'
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}

                      </div>
                    )
                  })}
                </div>
                <div style={{ fontSize: '11px', color: '#aaa', textAlign: 'right', padding: '6px 14px', borderTop: '1px solid #f0f0f0', fontFamily: 'Arial, sans-serif' }}>
                  {formatStats(englishStats)}
                </div>
              </div>

              <div style={{ border: '1px solid #d1e8d1', borderRadius: '10px', background: '#fff', marginBottom: '14px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 14px 6px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={styles.label}>{targetLangName} — edit if needed</div>
                </div>
                <div style={{ padding: '10px 14px', maxHeight: '360px', overflowY: 'auto', flex: 1 }}>
                  {translatedTitle && <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px', color: '#333', marginTop: 0 }}>{translatedTitle}</h2>}
                  {translatedSubtitle && <p style={{ fontSize: '13px', color: '#666', marginBottom: '6px', lineHeight: '1.5' }}>{translatedSubtitle}</p>}
                  {articleDate && <p style={{ fontSize: '11px', color: '#999', marginBottom: '12px' }}>{new Date(articleDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                  <div
                    id="filipino-editor"
                    contentEditable
                    suppressContentEditableWarning
                    onFocus={() => { setActiveEditor('filipino'); checkFilipinoFormat() }}
                    onInput={e => setFilipino(e.currentTarget.innerHTML)}
                    onKeyUp={checkFilipinoFormat}
                    onMouseUp={checkFilipinoFormat}
                    onSelect={checkFilipinoFormat}
                    style={{ minHeight: '200px', fontSize: '13px', color: '#333', lineHeight: '1.6', outline: 'none', fontFamily: 'Arial, sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: filipino }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: '#aaa', textAlign: 'right', padding: '6px 14px', borderTop: '1px solid #f0f0f0', fontFamily: 'Arial, sans-serif' }}>
                  {formatStats(translatedStats)}
                </div>
              </div>
            </div>

            {isPublishing ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '13px', color: '#2a7a2a', marginBottom: '16px' }}>Publishing...</div>
                <div style={{ width: '100%', height: '4px', background: '#e8f5e8', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ height: '100%', width: '40%', background: '#1a7a1a', borderRadius: '4px', animation: 'slide 1.5s infinite ease-in-out' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>
                  If it takes too long, the backend may be waking up.{' '}
                  <a href="https://newspublish-backend.onrender.com" target="_blank" rel="noreferrer" style={{ color: '#2a7a2a' }}>Click here to wake it up</a>, then come back.
                </div>
              </div>
            ) : (
              <div style={styles.actions}>
                <button style={styles.btnGreen} onClick={approve}>Approve and publish</button>
                <button style={styles.btnOutline} onClick={reject}>Reject</button>
              </div>
            )}

            {publishError && !isPublishing && (
              <div style={{ ...styles.toastErr, marginTop: '10px' }}>
                Could not publish — {publishErrorMsg || 'the backend may be offline.'}{' '}
                <a href="https://newspublish-backend.onrender.com" target="_blank" rel="noreferrer" style={{ color: '#b00', fontWeight: '600' }}>Click here to wake up the backend</a>, then try again.
              </div>
            )}
          </div>
        )}

        {active === 3 && (
          <div>
            <div style={styles.publishBox}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a7a1a', marginBottom: '16px' }}>Published</div>
              <div style={styles.cols}>
                <div style={styles.card}>
                  <div style={styles.label}>English</div>
                  {title && <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px', color: '#333', marginTop: 0 }}>{title}</h2>}
                  {subtitle && <p style={{ fontSize: '13px', color: '#666', marginBottom: '6px', lineHeight: '1.5' }}>{subtitle}</p>}
                  {articleDate && <p style={{ fontSize: '11px', color: '#999', marginBottom: '12px' }}>{new Date(articleDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                  {blocks.map((block, i) => {
                    const getYouTubeEmbed = (url) => {
                      try {
                        const u = new URL(url)

                        if (u.hostname.includes("youtube.com")) {
                          const id = u.searchParams.get("v")
                          if (id) return `https://www.youtube.com/embed/${id}`
                        }

                        if (u.hostname === "youtu.be") {
                          const id = u.pathname.slice(1)
                          if (id) return `https://www.youtube.com/embed/${id}`
                        }

                        return null
                      } catch {
                        return null
                      }
                    }

                    const embedUrl = block.type === 'video' ? getYouTubeEmbed(block.url) : null

                    return (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        {block.type === 'text' && (
                          <div
                            style={{ fontSize: '13px', color: '#333', lineHeight: '1.6' }}
                            dangerouslySetInnerHTML={{ __html: block.html }}
                          />
                        )}

                        {block.type === 'image' && block.url && (
                          <img
                            src={block.url}
                            alt=""
                            style={{ width: '100%', borderRadius: '6px' }}
                          />
                        )}

                        {block.type === 'video' && embedUrl && (
                          <iframe
                            src={embedUrl}
                            style={{
                              width: '100%',
                              aspectRatio: '16/9',
                              borderRadius: '6px',
                              border: 'none'
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </div>
                    )
                  })}
                  <div style={styles.wordCountBlock}>{formatStats(englishStats)}</div>
                </div>
                <div style={styles.card}>
                  <div style={styles.label}>{targetLangName}</div>
                  {translatedTitle && <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px', color: '#333', marginTop: 0 }}>{translatedTitle}</h2>}
                  {translatedSubtitle && <p style={{ fontSize: '13px', color: '#666', marginBottom: '6px', lineHeight: '1.5' }}>{translatedSubtitle}</p>}
                  {articleDate && <p style={{ fontSize: '11px', color: '#999', marginBottom: '12px' }}>{new Date(articleDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                  <div className="published-filipino" style={{ fontSize: '13px', color: '#333', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: filipino }} />
                  <div style={styles.wordCountBlock}>{formatStats(translatedStats)}</div>
                </div>
              </div>
            </div>
            {toast === 'pub' && <div style={styles.toastPub}>{editingId ? 'Article updated' : 'Published'} in English and {targetLangName}.</div>}
            <div style={styles.actions}>
              <button style={{ ...styles.btnOutline, marginTop: '12px' }} onClick={publishAnother}>Publish another article</button>
            </div>
          </div>
        )}

        </>}

        {view === 'history' && (
          <div>
            {historyLoading && <div style={{ textAlign: 'center', padding: '30px', color: '#2a7a2a', fontSize: '13px' }}>Loading articles...</div>}
            {!historyLoading && historyList.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888', fontSize: '13px', border: '1px solid #d1e8d1', borderRadius: '10px', background: '#fff' }}>
                No published articles yet.
              </div>
            )}
            {!historyLoading && historyList.map(a => (
              <div key={a.id} style={{ border: '1px solid #d1e8d1', borderRadius: '10px', padding: '14px', background: '#fff', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => openArticle(a.id)}>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: '#333', marginBottom: '4px' }}>{a.title || '(untitled)'}</div>
                  {a.subtitle && <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px', lineHeight: '1.4' }}>{a.subtitle}</div>}
                  <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: '#999' }}>
                    <span>{new Date(a.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span>·</span>
                    <span>{a.target_lang_name}</span>
                    {a.author_email && <><span>·</span><span>{a.author_email}</span></>}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button onClick={() => openArticle(a.id)} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', border: '1px solid #d1e8d1', background: '#fff', cursor: 'pointer', color: '#2a7a2a' }}>View</button>
                  <button onClick={() => deleteArticle(a.id)} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', border: '1px solid #f5d0d0', background: '#fff', cursor: 'pointer', color: '#b00' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'article' && selectedArticle && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <span onClick={() => { setView('history'); setSelectedArticle(null) }} style={styles.back}>← Back to History</span>
            </div>
            <div style={styles.cols}>
              <div style={styles.card}>
                <div style={styles.label}>English</div>
                {selectedArticle.title && <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px', color: '#333', marginTop: 0 }}>{selectedArticle.title}</h2>}
                {selectedArticle.subtitle && <p style={{ fontSize: '13px', color: '#666', marginBottom: '6px', lineHeight: '1.5' }}>{selectedArticle.subtitle}</p>}
                {selectedArticle.article_date && <p style={{ fontSize: '11px', color: '#999', marginBottom: '12px' }}>{new Date(selectedArticle.article_date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                {(selectedArticle.blocks || []).map((block, i) => {
                    const getYouTubeEmbed = (url) => {
                      try {
                        const u = new URL(url)

                        if (u.hostname.includes("youtube.com")) {
                          const id = u.searchParams.get("v")
                          if (id) return `https://www.youtube.com/embed/${id}`
                        }

                        if (u.hostname === "youtu.be") {
                          const id = u.pathname.slice(1)
                          if (id) return `https://www.youtube.com/embed/${id}`
                        }

                        return null
                      } catch {
                        return null
                      }
                    }

                    const embedUrl = block.type === 'video' ? getYouTubeEmbed(block.url) : null

                    return (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        
                        {block.type === 'text' && (
                          <div
                            style={{ fontSize: '13px', color: '#333', lineHeight: '1.6' }}
                            dangerouslySetInnerHTML={{ __html: block.html }}
                          />
                        )}

                        {block.type === 'image' && block.url && (
                          <img
                            src={block.url}
                            alt=""
                            style={{ width: '100%', borderRadius: '6px' }}
                          />
                        )}

                        {block.type === 'video' && embedUrl && (
                          <iframe
                            src={embedUrl}
                            style={{
                              width: '100%',
                              aspectRatio: '16/9',
                              borderRadius: '6px',
                              border: 'none'
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}

                      </div>
                    )
                  })}
                <div style={styles.wordCountBlock}>{formatStats(getArticleStats(selectedArticle.title, selectedArticle.subtitle, selectedArticle.blocks || []))}</div>
              </div>
              <div style={styles.card}>
                <div style={styles.label}>{selectedArticle.target_lang_name}</div>
                {selectedArticle.translated_title && <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '4px', color: '#333', marginTop: 0 }}>{selectedArticle.translated_title}</h2>}
                {selectedArticle.translated_subtitle && <p style={{ fontSize: '13px', color: '#666', marginBottom: '6px', lineHeight: '1.5' }}>{selectedArticle.translated_subtitle}</p>}
                {selectedArticle.article_date && <p style={{ fontSize: '11px', color: '#999', marginBottom: '12px' }}>{new Date(selectedArticle.article_date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                <div className="published-filipino" style={{ fontSize: '13px', color: '#333', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: selectedArticle.translated_html || '' }} />
                <div style={styles.wordCountBlock}>{formatStats(getTranslatedStats(selectedArticle.translated_title, selectedArticle.translated_subtitle, selectedArticle.translated_html))}</div>
              </div>
            </div>
            <div style={styles.actions}>
              <button style={styles.btnGreen} onClick={() => editArticle(selectedArticle)}>Edit article</button>
              <button style={{ ...styles.btnOutline, borderColor: '#b00', color: '#b00' }} onClick={() => deleteArticle(selectedArticle.id)}>Delete article</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}