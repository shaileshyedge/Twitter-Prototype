/**
 * Created by Chinmay on 07-03-2016.
 */
$(function() {
    $(document).ready(function() {

        $('#wrapper').dialog({

            autoOpen: false,
            title: 'Log in to Twitter',
            modal : true,
            height : 370,
            width : 540
        }).prev(".ui-dialog .ui-dialog-titlebar").hide();

        $('#button1').click(function() {
            $('#wrapper').dialog('open');
            $('.overlay').css({
                'position':'fixed',
                'z-index':'999',
                'width':'100%',
                'height':'100%',
                'background-color': 'black',
                'background-color':'rgba(0,0,0,.75)'
            })
        });

        $('.close').click(function() {
            $('#wrapper').dialog('close');
            $('.popup').hide();
            location.reload();
        });
    });
});
