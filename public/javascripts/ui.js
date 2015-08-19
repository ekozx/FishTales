$(document).ready(function() {
  $('#options').click(function() {
    $('.stats-container').fadeOut();
    $('.options-container').fadeToggle();
  });
  $('#stats').click(function() {
    $('.options-container').fadeOut();
    $('.stats-container').fadeToggle();
  });
  $('.container').click(function() {
    $('.options-container').fadeOut();
    $('.stats-container').fadeOut();
  });
});
