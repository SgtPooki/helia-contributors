export default {
  repos: [
    // helia-named repos in ipfs org
    'ipfs/helia',
    'ipfs/helia-car',
    'ipfs/helia-cli',
    'ipfs/helia-dag-cbor',
    'ipfs/helia-dag-json',
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
  bots: [
    'dependabot',
    'dependabot-preview',
    'dependabot-preview[bot]',
    'greenkeeper[bot]',
    'dependabot[bot]',
    'greenkeeper',
    'azure-pipelines',
    'codecov',
    'welcome',
    'github-actions'
  ]
}
