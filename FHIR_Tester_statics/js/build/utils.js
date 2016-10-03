var app = app || {};

(function(){
    app.isUrl = function(test_str){
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return pattern.test(test_str);
    }
    app.showMsg = function(msg){
        $('div.msg span').html(msg);
        $('div.msg').removeClass('hide');
        $('div.msg').show(200).delay(1000).hide(200);
    }
})();