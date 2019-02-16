'use strict';

const app = new Vue({
  el: '#app',
  data: {
    stats: window.stats,
    loadingData: true,
  },
  methods: {
    putData: function () {
      this.loadingData = false;
      this.stats = stats;
    },
    fullName: function (member) {
      return `${member.first_name} ${member.middle_name || ''} ${member.last_name}`;
    },
    votesWithParty: function (member) {
      return Math.round(member.total_votes * (member.votes_with_party_pct / 100));
    },
    roundIfNecessary: function (num) {
      return Math.round(num * 100) / 100;
    },
    average: function (...numbers) {
      let sum = 0;
      for (const number of numbers) {
        sum += number;
      }
      return sum / numbers.length;
    },
  },
  computed: {
    totalMembers: function () {
      return this.stats.democrats.total + this.stats.republicans.total + this.stats.independents.total;
    },
    averagePercentage: function () {
      return this.average(this.stats.democrats.partyPct,
        this.stats.republicans.partyPct,
        this.stats.independents.partyPct)
    },
  },
});

genStats().then(function () {
  app.putData();
}).catch(function (error) {
  throw new Error(error);
});
