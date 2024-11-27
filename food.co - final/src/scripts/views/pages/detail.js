import TheRestaurantDbSource from '../../data/restaurant-source';
import { createRestaurantDetailTemplate } from '../templates/template-creator';
import UrlParser from '../../routes/url-parser';
import LikeButtonInitiator from '../../utils/like-button-initiator';

const Detail = {
  async render() {
    return `
      <div class="content" id="content">
        <div id="restaurant" class="restaurant"></div>
        <div id="likeButtonContainer"></div>
      </div>
    `;
  },

  async afterRender() {
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const restaurantContainer = document.querySelector('#restaurant');

    try {
      const cachedData = localStorage.getItem(`restaurant-${url.id}`);
      let restaurant;

      if (cachedData) {
        restaurant = JSON.parse(cachedData);
        console.log('Data diambil dari localStorage.');
      } else {
        restaurant = await TheRestaurantDbSource.detailRestaurant(url.id);

        if (restaurant) {
          localStorage.setItem(`restaurant-${url.id}`, JSON.stringify(restaurant));
          console.log('Data diambil dari API dan disimpan ke localStorage.');
        } else {
          throw new Error('Restaurant data is not found in the response.');
        }
      }

      restaurantContainer.innerHTML = createRestaurantDetailTemplate(restaurant);
      LikeButtonInitiator.init({
        likeButtonContainer: document.querySelector('#likeButtonContainer'),
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          description: restaurant.description,
          pictureId: restaurant.pictureId,
          rating: restaurant.rating,
          city: restaurant.city,
        },
      });

      const reviewForm = document.querySelector('#reviewForm');
      reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const reviewName = document.querySelector('#reviewName').value;
        const reviewText = document.querySelector('#reviewText').value;

        if (reviewName && reviewText) {
          const newReview = {
            id: url.id,
            name: reviewName,
            review: reviewText,
          };

          try {
            await TheRestaurantDbSource.addReview(newReview);

            const reviewGrid = document.querySelector('#reviewGrid');
            const newReviewElement = `
              <div class="review-card">
                <p class="review-name"><strong>${reviewName}</strong></p>
                <p class="review-date">${new Date().toLocaleDateString()}</p>
                <p class="review-text">${reviewText}</p>
              </div>
            `;

            reviewGrid.insertAdjacentHTML('afterbegin', newReviewElement);
            reviewForm.reset();
          } catch (error) {
            console.error('Failed to submit review:', error);
            alert('Gagal mengirim ulasan. Silakan coba lagi nanti.');
          }
        } else {
          alert('Harap isi kedua kolom ulasan.');
        }
      });
    } catch (error) {
      console.error('Error fetching restaurant details:', error);

      alert('Oops! Kami tidak dapat menampilkan detail restoran ini. Pastikan Anda terhubung ke internet, lalu coba lagi.');
      restaurantContainer.innerHTML = '';
    }
  },
};

export default Detail;
