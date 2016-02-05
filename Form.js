var Form = {
  controller: function() {
    var ctrl = this,
        data = [
          {
            id: 127454,
            subject: 'parameter bug',
            created: '41 hours ago'
          },
          {
            id: 127440,
            subject: 'Segmentation Fault with Crust',
            created: '4 days ago'
          }];
    ctrl.data = data;

    ctrl.search = m.prop("");
    ctrl.isCollapsed = m.prop(true);

    ctrl.changeSearch = function(search) {
      if (search.length > 3) {
        ctrl.isCollapsed(false);
      }
      ctrl.search(search);
    }
  },
  view: function() {
    return [
      m('fieldset.form-inline', {
        style: { 'margin-bottom': '1em' }
      }, [
        m('.form-group', [
          m('label[for=bug-subj]',
            { style: { 'margin-right': '.5em' } }, 'Subject'),
          m('input#bug-subj.form-control[type=text][name=subject]', {
            style: { 'margin-right': '.5em', width: '35em' },
            placeholder: "A one-line summary of your issue",
            oninput: m.withAttr("value", form.vm.query),
            value: form.vm.subject()
          })
        ]),
        m('.form-group', [
          m('label[for=bug-category]',
            { style: { 'margin-right': '.5em' } }, 'Category'),
          m('select#bug-category.form-control[name=category]',
            { style: { 'margin-right': '.5em' } }, [
            m('option[selected]', { value: "" }),
            m('option[value=website]', 'Website'),
            m('option[value=outside-resource]', 'Outside Resource'),
            m('option[value=unexpected-result]', 'Unexpected Result')
          ])
        ]),
        m('.form-group', [
          m('label[for=bug-lang-ver]',
            { style: { 'margin-right': '.5em' } }, 'Language'),
          m('select#bug-lang-ver.form-control[name=language]',
            { style: { 'margin-right': '.5em' } }, [
            m('option[value=v6.c][selected]', 'v6.c'),
            m('option[value=v6.c.1][disabled]', 'v6.c.1'),
            m('option[value=v6.d][disabled]', 'v6.d')
          ])
        ]),
        m('.form-group', [
          m('label[for=bug-comp-ver]',
            { style: { 'margin-right': '.5em' } }, 'Compiler'),
          m('select#bug-comp-ver.form-control[name=compiler]',
            { style: { 'margin-right': '.5em' } }, [
            m('option[value=2015.11]', '2015.11'),
            m('option[value=2015.12]', '2015.12'),
            m('option[value=2016.01]', '2016.01'),
            m('option[value=2016.01.1][selected]', '2016.01.1')
          ])
        ])
      ]),
      m('fieldset.form-group', [
        m('textarea#bug-body.form-control[name=body][rows=20]')
      ]),
      m.component(Collapse, {
        data: ctrl.data,
        search: ctrl.search,
        value: ctrl.isCollapsed
      })
    ]
  }
}
