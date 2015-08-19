$(document).ready(function() {
  $('#options').click(function() {
    $('.stats-container').fadeOut();
    $('.about-container').fadeOut
    $('.options-container').fadeIn();
  });
  $('#stats').click(function() {
    $('.options-container').fadeOut();
    $('.about-container').fadeOut();
    $('.stats-container').fadeIn();
  });
  $('#about').click(function() {
    $('.stats-container').fadeOut();
    $('.options-container').fadeOut();
    $('.about-container').fadeIn();
  });
  $('.container').click(function() {
    $('.nav-container').fadeOut();
  });
  $('#pause').click(function() {
    createjs.Ticker.paused = !createjs.Ticket.paused;
  });
});
