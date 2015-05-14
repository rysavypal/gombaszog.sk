if ($("#sajto-hirek").length > 0) {
  var sajto_data = {};
  var sajto_data_rows = 0;
  var sajto_page_size = 20;

  function sajto_page(page_active) {
    $("#sajto-hirek").empty();
    for(var i=(page_active-1)*sajto_page_size+2; i < (page_active)*sajto_page_size+2 && i<=sajto_data_rows; i++)
        $("#sajto-hirek").append('<li><strong>'+sajto_data[i]['B']+'</strong>: <a href="'+sajto_data[i]['E']+'" target="_blank">'+sajto_data[i]['D']+'</a></li>');

    $("#sajto-pages").empty();
    for(var i=1; i < sajto_data_rows/sajto_page_size+1; i++)
        $("#sajto-pages").append('<li' + (i==page_active ? ' class="active"':'') + '><a href="javascript:sajto_page(' + i + ');">' + i + '</a></li>');
  }

  $.getJSON("https://spreadsheets.google.com/feeds/cells/1PVopI292rFYQppL-LeMRec8RkAKuJBDBtWMxViIu5T0/od6/public/basic?alt=json").done(function (data) {
    data.feed.entry.forEach(function(e) {
        if (typeof(sajto_data[parseInt(e.title.$t.replace(/[A-Z]+/, ''))]) == 'undefined') {
          sajto_data[parseInt(e.title.$t.replace(/[A-Z]+/, ''))] = {};
          sajto_data_rows += 1;
        }
        sajto_data[parseInt(e.title.$t.replace(/[A-Z]+/, ''))][e.title.$t.replace(/[0-9]+/, '')] = e.content.$t;
    });

    sajto_page(1);
  });

}
