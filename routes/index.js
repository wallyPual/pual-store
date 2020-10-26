const express = require('express');
const router = express.Router();
const _ = require('fxjs/Strict');

const { isLoggedIn } = require('../middlewares');
const { QUERY } = require('../database');

router.get('/', isLoggedIn, async function (req, res, next) {
  const {
    passport: { user: user_id },
  } = req.session;

  const products = await QUERY`
    SELECT id, name, price::numeric, image, created_at
    FROM products ORDER BY updated_at DESC
  `;

  const [user] = await QUERY`SELECT full_name FROM users WHERE id = ${user_id}`;

  const body = `<div>
      <h1>안녕하세요! ${user.full_name} 님</h1>
      <a href="/cart">장바구니</a>
      <a href="/auth/signout">로그아웃</a>

      <h2 class="h2">신제품</h2>
      <ul class="product-list">
        ${
          products.length
            ? _.map(
                ({ id, image, name, price }) => `
                <li class="product-item" data-id="${id}">
                  <div class="product-image">
                    <img src="${image}" alt="">
                  </div>
                  <div class="product-name">${name}</div>
                  <div class="product-price">${price}</div>
                  <button type="button" class="button cart">장바구니 담기</button>
                </li>
                `,
                products
              )
            : `<div>제품이 없습니다.</div>`
        }
      </ul>
    </div>

    <script>
    if (document.querySelector('.button')) {
      document.querySelector('.button')
        .addEventListener('click', ({ currentTarget }) => {
          fetch('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ user_id: ${user_id}, product_id: currentTarget.closest('.product-item').dataset.id }),
            headers:{
              'Content-Type': 'application/json'
            }
          })
          .then(res => res.json())
          .then(data => console.log(data))
      })
    }
    </script>
    `;

  res.render('index', { body });
});

module.exports = router;
