var csrf = $('input[name="csrfmiddlewaretoken"]').val(),// request middlevare secure
    secret = $('input[name="secret"]').val(),           // request authenticate

    addressUpdateSession = '/ajax/session/update/';

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    } else {
        var expires = "";
    }

    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i=0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

function updateSession(values) {
    if (Object.prototype.toString.call(values) !== '[object Object]'
        && jQuery.isEmptyObject(values) === true
    ) {
        return false;
    }

    $.each(values, function(key, value) {
        eraseCookie(key);
        document.cookie = key + '=' + value;
    });

    values.secret = secret
    $.ajax({
        "url": addressUpdateSession,
        "type": "POST",
        "dataType": "json",
        "headers": {
            'X-CSRFToken': csrf
        },
        "cache": false,
        "data": values,
        "success": function(data) {
            return true;
        },
        "error": function(data, textStatus, errorThrown) {
            console.log("error: " + textStatus);
            console.log("error: " + errorThrown);
        }
    });
}

function setSidebarCollapse()
{
    var $sidebar = $('.sidebar');
    if ($sidebar.length > 0) {
        var isMinified = $sidebar.hasClass('minified');
        updateSession({'sidebar':isMinified});
    }
}

function loadSidebarCollapse() {
    var $inputSidebar = $('input[name="sidebar"]'),
        sidebarValue = $inputSidebar.val();
    $inputSidebar.remove();

    if (sidebarValue == 'false') {
        updateSession({'sidebar':false});
        return false;
    }

    if (sidebarValue == 'true') {
        var $sidebar = $('.sidebar');
        if ($sidebar.length > 0) {
            $('body').addClass('sidebar-minified');
            $('#main').addClass('sidebar-minified');

            $sidebar.addClass('minified');

            var $mainMenu = $('#main-menu-min');
            $mainMenu.removeClass('full');
            $mainMenu.addClass('minified');

            var $i = $mainMenu.find('i');
            $i.removeClass('fa-angle-double-left');
            $i.addClass('fa-angle-double-right');
        }
    }
}

$(document).ready(function() {
    var elementPosition = $('#second-menu').offset();

    loadSidebarCollapse();
    $('#main-menu-min').on('click', function() {
        setSidebarCollapse();
    });

    $(window).scroll(function() {
        if ($(window).scrollTop() > (elementPosition.top - 60)) {
            var newWidth = $('#main').width();
            $('#second-menu').removeClass('container-fluid');
            $('#second-menu')
                .css('position', 'fixed')
                .css('top', '60px')
                .css('width', newWidth);
        } else {
            $('#second-menu').addClass('container-fluid');
            $('#second-menu').css('position','static');
        }
    });

    vmsRequest.initAction();
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});
