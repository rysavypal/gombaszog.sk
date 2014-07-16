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

if ($("#stream1").length > 0) {
  var stream_data = {};
  var stream_data_rows = 0;
  var stream_page_size = 4;

  function stream_page(page_active) {
    $("#stream1").empty();
    for(var i=(page_active-1)*stream_page_size+2; i < (page_active)*stream_page_size+2 && i<=stream_data_rows; i++) {
        if(typeof(stream_data[i]['A']) != "undefined") sa = stream_data[i]['A']; else sa = '';
        if(typeof(stream_data[i]['B']) != "undefined") sb = stream_data[i]['B']; else sb = '';
        if(typeof(stream_data[i]['C']) != "undefined") sc = stream_data[i]['C']; else sc = '';
        if(typeof(stream_data[i]['D']) != "undefined") sd = stream_data[i]['D']; else sd = '';
        $("#stream1").append('<li><div class="streamhead"><div class="time pull-left">'+sa+'</div><div class="title">'+sb+'</div></div><div class="placc">'+sc+'</div><div class="desc">'+sd+'</div></li>');
    }
    $("#stream1").append('<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>');

    /*
    $("#stream1-pages").empty();
    for(var i=1; i < stream_data_rows/stream_page_size+1; i++)
        $("#stream1-pages").append('<li' + (i==page_active ? ' class="active"':'') + '><a href="javascript:stream_page(' + i + ');">' + i + '</a></li>');
    */
  }

  function set_video(name) {
    if(name == 'live') {
        $('#videostream').empty();
        $('#videostream').append('<iframe width="480" height="392" src="//www.ustream.tv/embed/18506424?v=3&amp;wmode=direct" scrolling="no" frameborder="0" style="border: 0px none transparent;"></iframe>');
    }else{
        $('#videostream').empty();
        $('#videostream').append('<iframe width="560" height="315" src="//www.youtube.com/embed/videoseries?list=PLpc7uPls78G_PRivR3l-wowsMbNPMfbFK" frameborder="0" allowfullscreen></iframe>');
    }
  }

  $.getJSON("https://spreadsheets.google.com/feeds/cells/1rEaQIXhk-pejGW1yxQdoy_J42Pbtn2a853GyRaTsqd8/od6/public/basic?alt=json").done(function (data) {
    data.feed.entry.forEach(function(e) {
        if (typeof(stream_data[parseInt(e.title.$t.replace(/[A-Z]+/, ''))]) == 'undefined') {
          stream_data[parseInt(e.title.$t.replace(/[A-Z]+/, ''))] = {};
          stream_data_rows += 1;
        }
        stream_data[parseInt(e.title.$t.replace(/[A-Z]+/, ''))][e.title.$t.replace(/[0-9]+/, '')] = e.content.$t;
    });

    stream_page(1);
    set_video(stream_data[1]['E']);
  });

}
