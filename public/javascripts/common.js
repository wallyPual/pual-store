const errMsg = (msg) => _.go($.qs('.error-message'), $.text(msg), $.show);

const checkValidate = (iter) => {
  for (const a of iter) {
    if (a.value === '') return false;
  }
  return true;
};

const queryToItrer = _.pipe(
  decodeURIComponent,
  _.replace('?', ''),
  _.split('&'),
  _.map(_.split('='))
);

_.go(
  `
  <div class="loading">
    <span>loading....</span>
  </div>`,
  $.el,
  _.tap(
    $.on('open', ({ currentTarget }) => currentTarget.classList.add('is-active')),
    $.on('close', ({ currentTarget }) => currentTarget.classList.remove('is-active'))
  ),
  $.append($.qs('body'))
);

_.go(
  $.qsa('.add-cart'),
  $.on('click', async ({ currentTarget }) => {
    $.trigger('open', $.qs('.loading'));
    try {
      const { id: product_id } = $.data($.closest('[data-id]', currentTarget));
      const data = await $.post('/cart/add', { product_id });
      $.trigger('close', $.qs('.loading'));
      console.log(data);
    } catch (err) {
      $.trigger('close', $.qs('.loading'));
      console.log(err);
    }
  })
);
