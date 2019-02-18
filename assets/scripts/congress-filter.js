'use strict';

const vm = new Vue({
  el: '#app',
  data: {
    members: [],
    loadingData: true,
    partiesSelected: [],
    stateSelected: 'all',
    searchText: '',
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
      this.members = [];
    },
  },
});

congressRequest.requestData().then(function (data) {
  vm.updateTableData = function() {
    vm.members = updateMembersList(data);
  };
  vm.putData();
});

function updateMembersList(data) {
  const checkedParties = vm.partiesSelected;
  const checkedState = vm.stateSelected;
  const searchText = vm.searchText.trim();

  const partiesChanged = checkedParties.length;
  const statesChanged = checkedState !== 'all';
  const searchChanged = searchText !== '';

  let filteredMembers = data.results[0].members;

  if (partiesChanged) {
    filteredMembers = filterParties(filteredMembers, checkedParties);
  }

  if (statesChanged) {
    const stateToFilter = checkedState.toUpperCase();
    filteredMembers = filterStates(filteredMembers, stateToFilter);
  }

  if (searchChanged) {
    filteredMembers = filterText(filteredMembers, searchText);
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

function filterText(membersToFilter, text) {
  return membersToFilter.filter(function (member) {
    return vm.fullName(member).toLowerCase().includes(text);
  });
}
