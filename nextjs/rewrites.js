async function rewrites() {
  return [
    { source: '/node-api/proxy/:slug*', destination: '/api/proxy' },
    { source: '/node-api/:slug*', destination: '/api/:slug*' },

    // Add the new rewrite rule for CORS bypassing
    {
      source: '/api/authenticate',
      destination: 'http://adminportal.wirich-ventures.com/Core/Authenticate',
    },
  ].filter(Boolean);
}

module.exports = rewrites;
