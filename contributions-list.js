import config from './config.js'

const isBot = ({ name, login }) => {
  return config.bots.includes(name) || config.bots.includes(login)
}

/**
 * weight priorities: commits, PRs, issues, comments
 *
 * @param {*} person - a single person object
 *
 * @returns {number} - the weight of the person's contributions
 */
function getPersonContributionWeight (person) {
  return person.counts.commitAuthors * 5 + person.counts.prCreators * 4 + person.counts.issueCreators * 3 + person.counts.prCommentators * 2 + person.counts.issueCommentators
}

/**
 * Sort people using a multi-factor weighted sort
 * weight priorities: commits, PRs, issues, comments
 *
 * @param {*} peeps - people to sort
 */
function getSortedPeople (peeps) {
  return peeps.sort((a, b) => {
    return getPersonContributionWeight(b) - getPersonContributionWeight(a)
  })
}

export default (repoContributions) => {
  const people = {}

  Object.values(repoContributions).forEach(contributions => {
    Object.keys(contributions).forEach(type => {
      contributions[type].forEach(person => {
        if (people[person.login]) {
          people[person.login].count += person.count
        } else {
          people[person.login] = person
        }

        people[person.login].counts = people[person.login].counts || {}
        people[person.login].counts[type] = (people[person.login].counts[type] || 0) + person.count
      })
    })
  })

  function plural (word, count) {
    if (count === 1) return word
    return `${word}s`
  }

  function getCounts (person) {
    const counts = []
    if (person.counts.commitAuthors) counts.push(`${person.counts.commitAuthors} ${plural('commit', person.counts.commitAuthors)}`)
    if (person.counts.prCreators) counts.push(`${person.counts.prCreators} ${plural('PR', person.counts.prCreators)}`)
    if (person.counts.issueCreators) counts.push(`${person.counts.issueCreators} ${plural('issue', person.counts.issueCreators)}`)
    // if (person.counts.reviewers) counts.push(`${person.counts.reviewers} ${plural('review', person.counts.reviewers)}`)
    const totalComments = (person.counts.prCommentators || 0) + (person.counts.issueCommentators || 0)
    if (totalComments) counts.push(`${totalComments} ${plural('comment', totalComments)}`)
    if (counts.length) return ` (${counts.join(', ')})`
    return ''
  }

  const sortedPeople = getSortedPeople(Object.values(people))

  return sortedPeople
    .filter(p => !isBot(p))
    .reduce((lines, p) => {
      const counts = getCounts(p)
      if (!counts) return lines
      return lines.concat(`* [@${p.login}](${p.url})${counts}`)
    }, [])
    .join('\n')
}
