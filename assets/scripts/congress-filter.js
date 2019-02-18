'use strict';

const vm = new Vue({
  el: '#app',
  data: {
    members: [],
    loadingData: true,
    partiesSelected: [],
    stateSelected: 'all',
    searchText: '',
    sortAsc: null,
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
    sortByName: function () {
      if (this.sortAsc === null) this.sortAsc = true;
      else this.sortAsc = !this.sortAsc;

      this.updateTableData();
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
  const searchText = vm.searchText.trim().toLowerCase();
  const sortMode = vm.sortAsc;

  const partiesChanged = checkedParties.length;
  const statesChanged = checkedState !== 'all';
  const searchChanged = searchText !== '';
  const sortChanged = sortMode !== null;

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

  if (sortChanged) {
    filteredMembers.sort(function(a, b) {
      const fullNameA = vm.fullName(a).toLowerCase();
      const fullNameB = vm.fullName(b).toLowerCase();
      const multiplier = sortMode ? 1 : -1;

      let comparison = 0;
      if (fullNameA > fullNameB) comparison = 1 * multiplier;
      if (fullNameA < fullNameB) comparison = -1 * multiplier;
      return comparison;
    });
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
