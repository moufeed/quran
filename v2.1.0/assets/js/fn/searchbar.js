//---------------------- Init Searchbar --------------------------
//----------------------------------------------------------------
var searchbar = app.searchbar('.searchbar', {
    searchList: '#sour_list',
    searchIn: '.name'
});
//--------------------Show/Hide Searchbar-------------------------
//----------------------------------------------------------------
$$(document).on('click', '.toolbar-gold a', function () {
    var href = $$(this).attr('href').replace('#', '');
    if (href == 'souarlist') {
        app.showToolbar('.search-bar');
    } else {
        app.hideToolbar('.search-bar');
    }
})