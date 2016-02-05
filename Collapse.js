var Collapse = {
  view: function(ctrl, attrs) {
    var subject = attrs.value();
    return m('.list-group.collapse', {config: Collapse.config(attrs)}, [
      attrs.data.map(function(ticket) {
        return m('button.list-group-item[type=button]', [
          ticket.id + " - " + ticket.subject + " - " + ticket.created
        ]);
      })
    ]);
  },

  config: function(ctrl) {
    return function(element, isInitialized) {
      if (typeof jQuery !== 'undefined' &&
          typeof jQuery.fn.collapse !== 'undefined') {
        var el = $(element);
        if (!isInitialized) {
          el.collapse()
        }
      }
    }
  }
}
