'use strict';

async function genStats() {
  await genData();
  const members = window.data.results[0].members;
  window.stats = generateStats();

  function generateStats() {
    const partiesMembers = calculatePartiesMembers();

    return {
      democrats: {
        total: partiesMembers.democrats.length,
        partyPct: calculateAverage(partiesMembers.democrats),
      },
      republicans: {
        total: partiesMembers.republicans.length,
        partyPct: calculateAverage(partiesMembers.republicans),
      },
      independents: {
        total: partiesMembers.independents.length,
        partyPct: calculateAverage(partiesMembers.independents),
      },
      mostLoyal: calculateMaxAndMinimum('votes_with_party_pct'),
      leastLoyal: calculateMaxAndMinimum('votes_with_party_pct', false),
      mostEngaged: calculateMaxAndMinimum('missed_votes_pct', false),
      leastEngaged: calculateMaxAndMinimum('missed_votes_pct'),
    };
  }

  function calculatePartiesMembers() {
    const partiesMembers = {
      democrats: [],
      republicans: [],
      independents: [],
    };

    for (const member of members) {
      if (member.party === 'D') partiesMembers.democrats.push(member);
      else if (member.party === 'R') partiesMembers.republicans.push(member);
      else partiesMembers.independents.push(member);
    }

    return partiesMembers;
  }

  function calculateAverage(partyMembers) {
    if (!partyMembers.length) return 0;

    let total = 0;
    for (const member of partyMembers) {
      total += member.votes_with_party_pct;
    }
    const average = total / partyMembers.length;
    return average;
  }

  function calculateMaxAndMinimum(dataKey, maximum = true) {
    const percentages = [];
    for (const member of members) {
      percentages.push(member[dataKey]);
    }

    let percentage;
    if (maximum) {
      percentage = Math.max(...percentages);
    } else {
      percentage = Math.min(...percentages);
    }
    const filteredMembers = [];

    do {
      for (const member of members) {
        if (member[dataKey] === percentage) {
          filteredMembers.push(member);
        }
      }

      for (let i = 0; i < percentages.length; i++) {
        if (percentages[i] === percentage) {
          percentages.splice(i, 1);
        }
      }

      if (maximum) {
        percentage = Math.max(...percentages);
      } else {
        percentage = Math.min(...percentages);
      }
    } while (filteredMembers.length / members.length < 0.1);

    return filteredMembers;
  }
}
