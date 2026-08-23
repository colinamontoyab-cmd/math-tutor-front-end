// Server-side proxy: forwards chat requests to the Python backend (which talks
// to NVIDIA). Keeps the NVIDIA API key on the backend, never in the browser.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const endpoint = process.env.LCC_ENDPOINT_URL
  if (!endpoint) {
    return res.status(500).json({ message: 'LCC_ENDPOINT_URL is not configured' })
  }

  try {
    console.log(`usando endpoint: ${endpoint}`)
    const response = await fetch("https://backend-math-tutor.onrender.com/chat", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: req.body.question,
        session_id: req.body.session_id ?? null,s
      }),
    })

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Backend error' })
    }

    const data = await response.json()
    return res.status(200).json({ message: data.message, session_id: data.session_id })
  } catch (err) {
    return res.status(502).json({ message: 'Could not reach the backend' })
  }
}
