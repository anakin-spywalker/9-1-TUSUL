const searchBar = document.getElementById('searchBar');
const filterBtns = document.querySelectorAll('.filter-btn');
const videoCards = document.querySelectorAll('.video-card');

// Search function
searchBar.addEventListener('input', () => {
  const term = searchBar.value.toLowerCase();
  videoCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = title.includes(term) ? 'block' : 'none';
  });
});

// Filter function
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    const category = btn.dataset.category;

    videoCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
// Change header background when a video is clicked
const header = document.querySelector('header');

videoCards.forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img').src;
    header.style.background = `url(${img}) center/cover no-repeat`;
  });
});
