'use strict';

class CongressRequest {
  constructor(number, chamber) {
    this.number = number;
    this.chamber = chamber;
  }

  requestData() {
    this.request = new Promise((resolve, reject) => {
      fetch(`https://api.propublica.org/congress/v1/${this.number}/${this.chamber}/members.json`, {
        method: 'GET',
        headers: new Headers({
          'X-API-Key': 'lzTpp2Tp0OljdhcRJyXqEp3Bj9zMmHNnwRWtiovc',
        }),
        mode: 'cors',
      }).then(response => {
        if (response.status !== 200) {
          throw new Error('An error has ocurred while trying to fetch data from propublica');
        }
        return response.json();
      }).then(responseData => {
        this.data = responseData;
        resolve(responseData);
      }).catch(error => {
        throw new Error(error);
      });
    });
    return this.request;
  }

  genStats() {
    if (!this.request) this.request = this.requestData();
    this.statsPromise = new Promise((resolve, reject) => {
      this.request.then(() => {
        resolve(new CongressStats(this.data));
      });
    });
    return this.statsPromise;
  }
}

class CongressStats {
  constructor(data) {
    this.data = data;
    this.members = data.results[0].members;

    this.calculatePartiesMembers();
    
    this.democrats = {
      total: this.partiesMembers.democrats.length,
      average: this.calculateAverage(this.partiesMembers.democrats),
    };
    this.republicans = {
      total: this.partiesMembers.republicans.length,
      average: this.calculateAverage(this.partiesMembers.republicans),
    };
    this.independents = {
      total: this.partiesMembers.independents.length,
      average: this.calculateAverage(this.partiesMembers.independents),
    };
    this.mostLoyal = this.calculateMaxAndMinimum('votes_with_party_pct');
    this.leastLoyal = this.calculateMaxAndMinimum('votes_with_party_pct', false);
    this.mostEngaged = this.calculateMaxAndMinimum('missed_votes_pct', false);
    this.leastEngaged = this.calculateMaxAndMinimum('missed_votes_pct');
  }

  calculatePartiesMembers() {
    this.partiesMembers = {
      democrats: [],
      republicans: [],
      independents: [],
    };

    for (const member of this.members) {
      if (member.party === 'D') this.partiesMembers.democrats.push(member);
      else if (member.party === 'R') this.partiesMembers.republicans.push(member);
      else this.partiesMembers.independents.push(member);
    }
  }

  calculateAverage(partyMembers) {
    if (!partyMembers.length) return 0;

    let total = 0;
    for (const member of partyMembers) {
      total += member.votes_with_party_pct;
    }
    const average = total / partyMembers.length;
    const roundedAverage = this.roundTwoDecimals(average);
    return roundedAverage;
  }

  roundTwoDecimals(percentage) {
    return Math.round(percentage * 100) / 100;
  }

  calculateMaxAndMinimum(dataKey, maximum = true) {
    const percentages = [];
    for (const member of this.members) {
      percentages.push(member[dataKey]);
    }

    let percentage;
    percentage = maximum ? Math.max(...percentages) : Math.min(...percentages);
    const filteredMembers = [];

    do {
      for (const member of this.members) {
        if (member[dataKey] === percentage) {
          filteredMembers.push(member);
        }
      }

      for (let i = 0; i < percentages.length; i++) {
        if (percentages[i] === percentage) {
          percentages.splice(i, 1);
        }
      }

      percentage = maximum ? Math.max(...percentages) : Math.min(...percentages);
    } while (filteredMembers.length / this.members.length < 0.1);

    return filteredMembers;
  }
}
