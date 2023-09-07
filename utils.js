// import getDeps from 'get-dependencies'

const getNpmRegistryUrl = (pkgName) => {
  return `https://registry.npmjs.org/${pkgName}`
}

const ourOrgs = [
  'ipfs',
  'ipfs-shipyard'
]

function githubRepoFromNpmRepositoryUrl (npmRepositoryUrl) {
  const regexResult = /github.com\/([^/.]*)\/([^/.]*)/.exec(npmRepositoryUrl)
  return {
    org: regexResult[1],
    repo: regexResult[2]
  }
}

/**
 *
 * @param {Record<string, string>} versionTime - a record of version: timeString
 * @returns {string} - the latest version key
 */
function getLatestVersionFromVersionTime (versionTime) {
  // delete created and modified keys
  delete versionTime.created
  delete versionTime.modified

  // sort keys by time
  const sortedKeys = Object.keys(versionTime).sort((a, b) => {
    const aTime = new Date(versionTime[a])
    const bTime = new Date(versionTime[b])
    return aTime - bTime
  })

  // return the latest version
  return sortedKeys[sortedKeys.length - 1]
}

async function getOwnedDependencies (dependenciesArray) {
  const ownedDependencies = []
  for (const dependency of dependenciesArray) {
    try {
      const depDetails = await gitHubDetailsFromNpmPackageName(dependency, true)
      if (ourOrgs.includes(depDetails.org)) {
        ownedDependencies.push(depDetails)
      }
    } catch (e) {
      // console.error(e)
    }
  }
  return ownedDependencies
}

async function gitHubDetailsFromNpmPackageName (npmPackageName, ignoreDeps = false) {
  const url = getNpmRegistryUrl(npmPackageName)
  const result = await fetch(url)
  const body = await result.json()

  const latestVersion = getLatestVersionFromVersionTime(body.time)

  const dependencies = body.versions[latestVersion].dependencies
  const devDependencies = body.versions[latestVersion].devDependencies
  const dependencyNames = []
  if (dependencies != null && Object.keys(dependencies).length > 0) {
    dependencyNames.push(...Object.keys(dependencies))
  }

  if (devDependencies != null && Object.keys(devDependencies).length > 0) {
    dependencyNames.push(...Object.keys(devDependencies))
  }

  let org = null
  let repo = null
  try {
    const githubName = githubRepoFromNpmRepositoryUrl(body.repository.url)
    org = githubName.org
    repo = githubName.repo
  } catch (e) {
    console.error(`Could not find github repo for ${npmPackageName}`)
  }

  return {
    npmPackageName,
    repo,
    org,
    latestVersion,
    dependencies: ignoreDeps ? [] : await getOwnedDependencies(dependencyNames),
  }
}

/**
 * Convert a string array of npm package names to their respective github repo names
 *
 * @param {string[]} npmPackages A list of npm package names
 *
 * @returns {Promise<string[]>} A list of github repo names
 */
export async function getGithubRepoNamesForNpmPackages (npmPackages) {
  // loop through all root packages
  const rootPackageDetails = []
  for (const rootPackage of npmPackages) {
    rootPackageDetails.push(await gitHubDetailsFromNpmPackageName(rootPackage))
  }
  // convert all root packages into an array of github "org/repo" strings
  const githubRepoNames = new Set()
  for (const rootPackage of rootPackageDetails) {
    githubRepoNames.add(`${rootPackage.org}/${rootPackage.repo}`)
    // loop through all rootPackage dependencies
    for (const dependency of rootPackage.dependencies) {
      if (dependency.org == null || dependency.repo == null) {
        continue
      }
      githubRepoNames.add(`${dependency.org}/${dependency.repo}`)
    }
  }

  console.log(githubRepoNames)
  return [...githubRepoNames]
}

// await getGithubRepoNamesForNpmPackages()

