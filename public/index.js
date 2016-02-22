$(document).ready(function() {
  var PosTicketCollapse = (function() {
    var collapser = $("#collapser"),
        subjList = $("#collapser ul.list-group")
        subject = $("#bug-subj"),
        tickets = { updatedAt: 0, data: {} },
        render = function(tickets) {
          subjList.empty();
          tickets.slice(0,10).map(function(ticket) {
            var rightCreated =
              '<span class="label label-default label-pill pull-right">' +
              ticket.created + '</span>'
            var item = $("<li>")
              .addClass('list-group-item')
              .html(rightCreated + ticket.id + " - " + ticket.subject);
            subjList.append(item);
            collapser.collapse('show');
          })
        },
        init = function() {
          subject.on('input', function(e) {
            var input = subject.val()
            if (input.length > 3) {
              console.log('length exceeded');
              if (Math.abs(tickets.updatedAt - new Date()) > 90000) {
                console.log('data expired');
                $.get({
                  url: "/tickets",
                  dataType: 'json',
                  error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                  },
                  success: function(data) {
                    tickets.updatedAt = new Date();
                    tickets.data = new Fuse(data, {
                      keys: ['subject'],
                      threshold: 0.3
                    });
                    render(tickets.data.search(input));
                  }
                });
              } else {
                console.log('data fresh');
                render(tickets.data.search(input))
              }
            } else { collapser.collapse('hide') }
          });
        };

    return {
      init: init
    }
  })();

  PosTicketCollapse.init();
})
