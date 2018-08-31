
let textareaHeight = 0;

$('textarea').on('keydown', function () {
    $(this).height(1).height($(this).prop('scrollHeight') + 24);
    textareaHeight = $('textarea').css('height').split('p')[0] * 1;
});
