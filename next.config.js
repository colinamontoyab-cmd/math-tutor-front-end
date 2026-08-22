const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root so an unrelated lockfile in the home directory
  // doesn't get picked up for output file tracing.
  outputFileTracingRoot: path.join(__dirname),
}

module.exports = nextConfig
