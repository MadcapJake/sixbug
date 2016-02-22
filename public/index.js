const perPage = 10;

$(document).ready(function() {
  var PosTicketCollapse = (function() {
    var collapser = $("#collapser"),
        subjList = $("#collapser ul.list-group")
        subject = $("#bug-subj"),
        tickets = { updatedAt: 0, data: {}, result: [] },
        pager = $("#pager"),
        pagedTickets = function() {
          subjList.children().slice(perPage).hide();
          pager.pagination({
            items: tickets.result.length,
            itemsOnPage: perPage,
            cssStyle: 'light-theme',
            hrefTextPrefix: '#',
            onPageClick: function(pageNum) {
              var showFrom = perPage * (pageNum - 1),
                  showTo = showFrom + perPage;
              subjList.children()
                      .hide()
                      .slice(showFrom, showTo).show();
            }
          });
        },
        render = function() {
          subjList.empty();
          tickets.result.map(function(ticket) {
            var rightCreated =
              '<a class="pull-right" target="_blank" ' +
                 'href="https://rt.perl.org/Ticket/Display.html?id=' +
                  ticket.id + '" ' +
                 'style="margin-left: 1em; target-new: tab;">' +
              '<span class="glyphicon glyphicon-new-window" ' +
              'title="external-link" aria-hidden="true">' +
              '</span></a>' +
              '<span class="label label-default label-pill pull-right">' +
              ticket.created + '</span>'
            var item = $("<li>")
              .addClass('list-group-item')
              .html(rightCreated + ticket.id + " - " + ticket.subject);
            subjList.append(item);
          });
          collapser.collapse('show');
          pagedTickets();
        },
        init = function() {
          subject.on('input', function(e) {
            var input = subject.val()
            if (input.length > 3) {
              if (Math.abs(tickets.updatedAt - new Date()) > 90000) {
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
                    tickets.result = tickets.data.search(input)
                    render();
                  }
                });
              } else {
                tickets.result = tickets.data.search(input);
                render();
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
