(function () {
    document.onkeydown = key_handler;
    function key_handler(event) {
        if (event.type == "keydown")
            switch (event.keyCode) {
                case (37): send("Left"); break;
                case (38): send("Up"); break;
                case (39): send("Right"); break;
                case (40): send("Down"); break;
            }
    }
})();
