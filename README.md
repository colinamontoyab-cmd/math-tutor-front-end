# Math Tutor Chat — Frontend (macOS)

Next.js chat UI for the polynomial-factorization math tutor. It talks to the
Python backend, which in turn calls **NVIDIA NIM**. The NVIDIA API key lives on
the backend only — this app never handles it.

## 1. Prerequisites (macOS)

Install [Homebrew](https://brew.sh) if you don't have it, then:

```bash
brew install node   # Node 20+ (18.18+ minimum)
```

The Python backend must be running first — see
`../../net-developer-resources/back/README.md`.

## 2. Install

From this folder (`front-develop-in-depth/front`):

```bash
npm install
```

## 3. Configure

```bash
cp .env.example .env
```

`.env` only needs the backend URL (already the default):

```
LCC_ENDPOINT_URL=http://127.0.0.1:9000/chat
```

## 4. Run

```bash
# development (hot reload)
npm run dev

# or a production build
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration (`.env`)

| Variable           | Default                      | Description                                         |
| ------------------ | ---------------------------- | --------------------------------------------------- |
| `LCC_ENDPOINT_URL` | `http://127.0.0.1:9000/chat` | Python backend `/chat` endpoint (server-side only). |

## How it works

Browser → `pages/api/chat.js` (Next.js server route) → Python backend `/chat` →
NVIDIA NIM. Conversation memory is kept per `session_id`, which the backend
returns and the UI reuses on each message.

## Notes

- The NVIDIA API key is **not** used here; it stays in the backend.
- Voice recording (OpenAI Whisper) and image generation were removed — the app
  is now a text chat running fully on NVIDIA.
