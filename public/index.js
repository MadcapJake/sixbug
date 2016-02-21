$(document).ready(function() {
  var PosTicketCollapse = (function() {
    var url = "/tickets",
        collapser = $("#collapser"),
        subjList = $("#collapser ul.list-group")
        subject = $("#bug-subj"),
        tickets = {};

    var init = function() {
      subject.on('input', function(e) {
        var input = subject.val();
        if (input.length > 3) {
          $.get({
            url: url,
            dataType: 'json',
            error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            },
            success: function(data) {
              var fuse = new Fuse(data, { keys: ['subject'] });
              tickets = fuse.search(input);
              // console.log(data);
              subjList.empty();
              tickets.map(function(ticket) {
                var rightCreated =
                  '<span class="label label-default label-pill pull-right">' +
                  ticket.created + '</span>'
                var item = $("<li>")
                  .addClass('list-group-item')
                  .html(rightCreated + ticket.id + " - " + ticket.subject);
                subjList.append(item);
              });
              collapser.collapse('show');
            }
          });
        } else { collapser.collapse('hide') }
      });
    }

    return {
      init: init
    }
  })();

  PosTicketCollapse.init();
})
