angular.module('BetterBetting.pundit')

.filter('marketFilter', function() {

  return function(item) {
    item = item.split('_').join(' ');
    return item;
  }
})



.filter('publishedEvenFilter', function() {

  return function(item) {
    var output = [];
    item.forEach(function(entry) {
      var filteredItem = {};
      if(entry.adjustment) {
        filteredItem.adjustment = entry.adjustment;
      }
      filteredItem.unseen = entry.unseen;
      filteredItem.pundit = entry.pundit;
      for (var key in entry.meta_data) {

        if (entry.meta_data[key]['Event']) {
          filteredItem.event = entry.meta_data[key]['Event']
        }
        if  (entry.meta_data[key]['Start Time']) {
          filteredItem.startTime = entry.meta_data[key]['Start Time']
        }
        if  (entry.meta_data[key]['Market']) {
          filteredItem.market = entry.meta_data[key]['Market']
        }
        if  (entry.meta_data[key]['Selection']) {
          filteredItem.selection = entry.meta_data[key]['Selection']
        }
      }
      filteredItem.id = entry.id;
      filteredItem.state = entry.state;
      output.push(filteredItem);

    })


    return output;
  }
})

.filter('range', function() {
  return function(input, min, max) {
    min = parseFloat(min); //Make string input int
    max = parseFloat(max);
    for (var i=min; i<max; i++){
      input.push(i.toString());
      if(  i !== (max - 1)){
        input.push((i + 0.5).toString())
      }
    }
    return input;
  };
});
