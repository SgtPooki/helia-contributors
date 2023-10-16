export default {
  repos: [
    // helia-named repos in ipfs org
    'ipfs/helia',
    'ipfs/helia-car',
    'ipfs/helia-cli',
    'ipfs/helia-dag-cbor',
    'ipfs/helia-dag-json',
    'ipfs/helia-docker',
    'ipfs/helia-ipns',
    'ipfs/helia-json',
    'ipfs/helia-mfs',
    'ipfs/helia-remote-pinning',
    'ipfs/helia-routing-v1-http-api',
    'ipfs/helia-strings',
    'ipfs/helia-unixfs',
    'ipfs/js-stores',

    // non helia-specific repos in ipfs org
    'ipfs/js-ipfs-bitswap',
    'ipfs/js-ipns',

    // no need to check individual repos since this repo contains the source of truth for all helia-examples
    'ipfs-examples/helia-examples',

    // ipfs-shipyard repos
    'ipfs-shipyard/helia-contributors',
    'ipfs-shipyard/helia-css',
    'ipfs-shipyard/helia-service-worker-gateway',
    'ipfs-shipyard/www-helia-identify',

    // partner deps
    'ChainSafe/gossipsub-js'
  ],
  // list the root npm packages that we own that we want to check for contributors
  // merged with the list of github repos listed above and deduplicated
  npmPackages: [
    'helia',
    '@helia/unixfs',
    '@helia/json',
    '@helia/strings',
    '@helia/car',
    '@helia/remote-pinning',
    '@helia/dag-cbor',
    '@helia/ipns',
    '@helia/dag-json',
    '@helia/routing-v1-http-api-server',
    '@helia/interface',
    '@helia/rpc-protocol',
    '@helia/css',
    '@helia/routing-v1-http-api-client',
    '@helia/ipns-cli',
    '@helia/interop',
    '@helia/cli-utils',
    '@helia/rpc-client',
    '@helia/rpc-server',
    '@helia/cli',
    '@helia/unixfs-cli',
    '@helia/mfs'
  ],
  bots: [
    // we don't list web3-bot because seeing it's contributions is useful
    'dependabot',
    'dependabot-preview',
    'dependabot-preview[bot]',
    'greenkeeper[bot]',
    'dependabot[bot]',
    'greenkeeper',
    'azure-pipelines',
    'codecov',
    'welcome',
    'github-actions',
    'semantic-release-bot',
    'github-actions%5Bbot%5D',
    'codecov-commenter'
  ]
}
