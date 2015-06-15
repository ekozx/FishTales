$(document).ready(function() {
  $('#options').click(function() {
    $('.stats-container').hide();
    $('.options-container').fadeIn();
  });
  $('#stats').click(function() {
    $('.options-container').hide();
    $('.stats-container').fadeIn();
  });
  $('.container').click(function() {
    $('.options-container').hide();
    $('.stats-container').hide();
  });
});
