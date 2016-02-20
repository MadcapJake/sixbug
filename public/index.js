$(document).ready(function() {
  var PosTicketCollapse = (function() {
    var urlBase = "/tickets?subject=",
        collapser = $("#collapser"),
        subjList = $("#collapser ul.list-group")
        subject = $("#bug-subj");

    var init = function() {
      subject.on('input', function(e) {
        var search = subject.val()
        if (search.length > 3) {
          $.get({
            url: urlBase + encodeURIComponent(search),
            dataType: 'json',
            error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            },
            success: function(data) {
              console.log(data);
              subjList.empty();
              data.map(function(ticket) {
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
