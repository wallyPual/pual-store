const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../../middlewares');
const { ASSOCIATE, SQL, COLUMN, FxSQL_DEBUG } = require('../../database');
const { renderMain } = require('../../template/mypage');

// FxSQL_DEBUG.LOG=true;

router.get('/', isLoggedIn, async function (req, res, next) {
  try {
    const { user: { id: user_id } } = req;

    const orders = await ASSOCIATE`
      orders ${{
        column: COLUMN('id', SQL`to_char(orders.created_at, 'YYYY-MM-DD HH:MM') as order_date`),
        query: SQL`WHERE user_id = ${user_id} ORDER BY created_at DESC`,
      }}
        x products` || [];

    res.render('index', {
      title: '마이페이지',
      body: renderMain(orders),
    });
  } catch(err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
