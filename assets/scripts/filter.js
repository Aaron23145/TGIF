'use strict';

const app = new Vue({
  el: '#app',
  data: {
    members: [],
    loadingData: true,
    partiesSelected: [],
    stateSelected: 'all',
  },
  methods: {
    putData: function () {
      this.loadingData = false;
      this.updateTableData();
    },
    fullName: function (member) {
      return `${member.first_name} ${member.middle_name || ''} ${member.last_name}`;
    },
    updateTableData: function () {
      this.members = updateMembersList();
    },
  },
});

genData().then(function () {
  app.putData();
}).catch(function (error) {
  throw new Error(error);
});

function updateMembersList() {
  const checkedParties = app.partiesSelected;
  const checkedState = app.stateSelected;

  const partiesChanged = Boolean(checkedParties.length);
  const statesChanged = checkedState !== 'all';

  let filteredMembers = window.data.results[0].members;

  if (partiesChanged) {
    filteredMembers = filterParties(filteredMembers, checkedParties);
  }

  if (statesChanged) {
    const stateToFilter = checkedState.toUpperCase();
    filteredMembers = filterStates(filteredMembers, stateToFilter);
  }

  return filteredMembers;
}

function filterParties(membersToFilter, parties) {
  return membersToFilter.filter(function (member) {
    return parties.includes(member.party);
  });
}

function filterStates(membersToFilter, state) {
  return membersToFilter.filter(function (member) {
    return member.state === state;
  });
}
