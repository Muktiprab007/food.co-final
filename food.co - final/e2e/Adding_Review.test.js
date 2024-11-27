const assert = require('assert');

Feature('Customer Reviews');

Before(({ I }) => {
  I.amOnPage('/');
});

Scenario('Add a valid review to a restaurant', async ({ I }) => {
  I.seeElement('.restaurant-item');
  const firstRestaurant = locate('.restaurant-name a').first();
  I.click(firstRestaurant);

  I.seeElement('#reviewForm');
  const initialReviewCount = await I.grabNumberOfVisibleElements('.review-card');

  const reviewerName = 'Mukti';
  const reviewText = 'Test e2e';
  I.fillField('#reviewName', reviewerName);
  I.fillField('#reviewText', reviewText);
  I.click('button[type="submit"]');

  I.waitForResponse((res) => res.status() === 200, 10);
  I.wait(2);

  const newReviewCount = await I.grabNumberOfVisibleElements('.review-card');
  assert.strictEqual(newReviewCount, initialReviewCount + 1);

  const lastReviewName = await I.grabTextFrom(locate('.review-card .review-name').last());
  const lastReviewText = await I.grabTextFrom(locate('.review-card .review-text').last());

  assert.strictEqual(lastReviewName, reviewerName);
  assert.strictEqual(lastReviewText, reviewText);
});
