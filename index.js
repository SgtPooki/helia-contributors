#!/usr/bin/env node

import pkg from './package.json' assert { type: "json" }
import ora from 'ora'
import debug from 'debug'
import Chalk from 'chalk'
import Inquirer from 'inquirer'
import nyc from 'name-your-contributors'
import getList from './contributions-list.js'
import Config from './config.js'
import prettyMs from 'pretty-ms'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const log = debug(pkg.name)

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0')
  .usage('Usage: $0 --start [Date] --end [Date]')
  .option('start', {
    description: 'Earliest date to consider changes from',
    coerce: (val) => {
      if (!val) {
        return undefined
      }

      return new Date(val)
    }
  })
  .option('end', {
    description: 'Latest date to consider changes from',
    coerce: (val) => {
      if (!val) {
        return undefined
      }

      return new Date(val)
    }
  })
  .help('h')
  .alias('h', 'help')
  .argv

const releaseFilter = (release) => {
  return release.tag_name.startsWith('ipfs@') && release.tag_name.endsWith('.0') && !release.tag_name.includes('-')
}

async function main ({ env }) {
  console.log(`${Chalk.cyan('⬢')} ${Chalk.bold(Chalk.whiteBright('Helia Contributors'))}`)
  const spinner = ora()

  try {
    let githubToken

    if (env.IPFS_CONTRIBUTORS_GITHUB_TOKEN) {
      console.log(Chalk.white('Welcome to the Helia contributors list generator!'))
      githubToken = env.IPFS_CONTRIBUTORS_GITHUB_TOKEN
    } else {
      console.log(Chalk.white('Welcome to the Helia contributors list generator! All you need is a Github token. Learn how to get one at https://github.com/mntnr/name-your-contributors#api-limits-and-setting-up-a-github-token'))

      const { token } = await Inquirer.prompt([{
        type: 'password',
        name: 'token',
        message: 'Enter your Github personal access token:',
        validate: Boolean
      }])

      githubToken = token
    }

    const repos = Array.from(Config.repos)

    while (true) {
      console.log(Chalk.white('The following repos will be used:'))

      repos.forEach((r, i) => {
        console.log(Chalk.white((i + 1) + '. ') + Chalk.gray('github.com/') + r)
      })

      const { another, repo } = await Inquirer.prompt([{
        type: 'confirm',
        name: 'another',
        message: 'Add another repo?',
        default: false
      }, {
        type: 'input',
        name: 'repo',
        message: 'Enter repo (org/repo):',
        when: ({ another }) => another
      }])

      if (!another) break
      repos.push(repo)
    }

    let lastRelease

    // work out the last `x.x.0` release
    for (let page = 1; page < 10; page++) {
      const result = await fetch(`https://api.github.com/repos/ipfs/helia/releases?page=${page}`)
      const releases = await result.json()

      lastRelease = releases
        .filter(releaseFilter)
        .shift()

      if (lastRelease) {
        break
      }
    }

    if (!lastRelease) {
      throw new Error('Could not find ipfs release in 10 pages of releases')
    }

    const contributions = {}

    // not sure this is right - it'll fetch between the date of the last release and now, but other stuff
    // could have gone into master after the release branch was cut but before the release was done.
    // Should probably look at the commits of deps that resolve to different versions between releases.
    for (const orgRepo of repos) {
      const start = Date.now()
      spinner.start(`${Chalk.white('Getting contributors to')} ${Chalk.grey('github.com/') + orgRepo}`)

      const [user, repo] = orgRepo.split('/')

      contributions[orgRepo] = await nyc.repoContributors({
        token: githubToken,
        user,
        repo,
        before: argv.end || new Date(),
        after: argv.start || new Date(lastRelease.published_at),
        commits: true
      })

      spinner.stopAndPersist({
        symbol: '❤️ ',
        text: `${Chalk.white('Successfully got contributors for')} ${Chalk.grey('github.com/') + orgRepo} in ${prettyMs(Date.now() - start)}`
      })
    }

    console.log(getList(contributions))
    process.exit()
  } catch (err) {
    log(err)
    spinner.fail(err.message || err.statusMessage)
    console.error(err)
    process.exit(1)
  }
}

main(process)
