$(document).ready(function() {
  $('#options').click(function() {
    $('.stats-container').fadeOut();
    $('.options-container').fadeIn();
  });
  $('#stats').click(function() {
    $('.options-container').fadeOut();
    $('.stats-container').fadeIn();
  });
  $('.container').click(function() {
    $('.options-container').fadeOut();
    $('.stats-container').fadeOut();
  });
});
