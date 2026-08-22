import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import styles from '../styles/Home.module.css'

const GREETING = {
  message:
    "Hi! I'm your polynomial factorization tutor. Tell me the algebraic expression you're working on and I'll walk you through it step by step.",
  type: 'apiMessage',
}

// Open markdown links in a new tab (replaces react-markdown v8's linkTarget prop).
const markdownComponents = {
  a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
}

export default function Home() {
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [sessionId, setSessionId] = useState(null)

  const messageListRef = useRef(null)
  const textAreaRef = useRef(null)

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current
    if (messageList) messageList.scrollTop = messageList.scrollHeight
  }, [messages])

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current?.focus()
  }, [])

  const handleError = () => {
    setMessages((prev) => [
      ...prev,
      { message: 'Oops! There seems to be an error. Please try again.', type: 'apiMessage' },
    ])
    setLoading(false)
    setUserInput('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (userInput.trim() === '') {
      return
    }

    setLoading(true)
    const question = userInput
    setMessages((prev) => [...prev, { message: question, type: 'userMessage' }])
    setUserInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, session_id: sessionId }),
      })

      if (!response.ok) {
        handleError()
        return
      }

      const data = await response.json()
      if (data.session_id) setSessionId(data.session_id)

      setMessages((prev) => [...prev, { message: data.message, type: 'apiMessage' }])
      setLoading(false)
    } catch (err) {
      handleError()
    }
  }

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e) => {
    if (e.key === 'Enter' && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  return (
    <>
      <Head>
        <title>Math Tutor</title>
        <meta name="description" content="Polynomial factorization tutor chatbot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.topnav}>
        <div className={styles.navlogo}>
          <img src="/logo.png" alt="logo" />
        </div>
        <div className={styles.navlinks}></div>
      </div>
      <main className={styles.main}>
        <div className={styles.cloud}>
          <div ref={messageListRef} className={styles.messagelist}>
            {messages.map((message, index) => {
              const className =
                message.type === 'userMessage' && loading && index === messages.length - 1
                  ? styles.usermessagewaiting
                  : message.type === 'apiMessage'
                  ? styles.apimessage
                  : styles.usermessage

              return (
                <div key={index} className={className}>
                  {message.type === 'apiMessage' ? (
                    <Image src="/parroticon.png" alt="AI" width="30" height="30" className={styles.boticon} priority />
                  ) : (
                    <Image src="/usericon.png" alt="Me" width="30" height="30" className={styles.usericon} priority />
                  )}
                  <div className={styles.markdownanswer}>
                    <ReactMarkdown components={markdownComponents}>{message.message}</ReactMarkdown>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.cloudform}>
            <form onSubmit={handleSubmit}>
              <textarea
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                maxLength={512}
                id="userInput"
                name="userInput"
                placeholder={loading ? 'Waiting for response...' : 'Type your question...'}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className={styles.textarea}
              />
              <button type="submit" disabled={loading} className={styles.generatebutton}>
                {loading ? (
                  <div className={styles.loadingwheel}>
                    <span className={styles.spinner} />
                  </div>
                ) : (
                  <svg viewBox="0 0 20 20" className={styles.svgicon} xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                )}
              </button>
            </form>
          </div>
          <div className={styles.footer}>
            <p>Powered by NVIDIA NIM</p>
          </div>
        </div>
      </main>
    </>
  )
}
