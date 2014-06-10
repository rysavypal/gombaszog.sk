if ($("#sajto-hirek").length > 0) {
  var data = {};
  $.getJSON("https://spreadsheets.google.com/feeds/cells/1PVopI292rFYQppL-LeMRec8RkAKuJBDBtWMxViIu5T0/od6/public/basic?alt=json").done(function (data) {
    data.feed.entry.forEach(function(e) {
        if (typeof(data[parseInt(e.title.$t.replace(/[A-Z]+/, ''))]) == 'undefined')
          data[parseInt(e.title.$t.replace(/[A-Z]+/, ''))] = {};
        data[parseInt(e.title.$t.replace(/[A-Z]+/, ''))][e.title.$t.replace(/[0-9]+/, '')] = e.content.$t;
    });
    for(var i=21; i > 1; i--)
        $("#sajto-hirek").append('<li><strong>'+data[i]['B']+'</strong>: <a href="'+data[i]['E']+'" target="_blank">'+data[i]['D']+'</a></li>');
  });
}
