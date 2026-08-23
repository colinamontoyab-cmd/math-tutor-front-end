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
  console.log('=================================')
  console.log('CHAT FUNCTION START')
  console.log('Endpoint:', endpoint)
  console.log('Question:', req.body?.question)
  console.log('Session:', req.body?.session_id)
  console.log('=================================')

  try {

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: req.body.question,
        session_id: req.body.session_id ?? null,
      }),
    })
    
    console.log('Backend status:', response.status)
    const data = await response.json()

    console.log('Backend data:', JSON.stringify(data))

    if (!response.ok) {
      console.error('Backend returned error:', data)
      return res.status(response.status).json({
        message: data.message ?? 'Backend error',
      })
    }

    console.log('Returning successful response to browser')
    return res.status(200).json({
      message: data.message,
      session_id: data.session_id,
    })

  } catch (err) {
    console.error('ERROR CALLING BACKEND:', err)

    return res.status(502).json({
      message: 'Could not reach the backend',
    })
  }
}
