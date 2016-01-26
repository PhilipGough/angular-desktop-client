angular.module('BetterBetting.pundit')

.filter('marketFilter', function() {

  return function(item) {
    item = item.split('_').join(' ');
    return item;
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
