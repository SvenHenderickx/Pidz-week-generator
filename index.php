<html>
    <head>
        <title>Week genereren</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400&display=swap" rel="stylesheet">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <link rel="stylesheet" type="text/css" href="style/style.css">
        <script src="script/script.js"></script>
    </head>
    <body>
        <div class="popupcontainer">

        </div>
        <main>
            <div class="calendarwrap">
                <div class="hourtitle">
                    <p style="height: 6px;">

                    </p>
                    <?php
                        for($i = 0; $i < 24; $i++){
                            echo '<p>' . $i . '</p>';
                        }
                    ?>
                </div>
                <div class="daywrap">
                    <div class="daytitle">
                        maandag
                    </div>
                    <div class="daypartswrap">

                    <?php
                        for($i = 0; $i < 24; $i++){
                            ?>

                            <span id="monday<?php echo $i?>" data-day="monday" data-hour="<?php echo $i?>" data-hasdate="false" class="daypart">

                            </span>

                            <?php
                        }
                    ?>
                    </div>
                </div>

                <div class="daywrap">
                    <div class="daytitle">
                        dinsdag
                    </div>
                    <div class="daypartswrap">


                    <?php
                        for($i = 0; $i < 24; $i++){
                            ?>

                            <span id="tuesday<?php echo $i?>" data-day="tuesday" data-hour="<?php echo $i?>" data-hasdate="false" class="daypart">

                            </span>

                            <?php
                        }
                    ?>
                    </div>
                </div>

                <div class="daywrap">
                    <div class="daytitle">
                        woensdag
                    </div>
                    <div class="daypartswrap">

                    <?php
                        for($i = 0; $i < 24; $i++){
                            ?>

                            <span id="wednesday<?php echo $i?>" data-day="wednesday" data-hour="<?php echo $i?>" data-hasdate="false" class="daypart">

                            </span>

                            <?php
                        }
                    ?>
                    </div>

                </div>

                <div class="daywrap">
                    <div class="daytitle">
                        donderdag
                    </div>
                    <div class="daypartswrap">

                    <?php
                        for($i = 0; $i < 24; $i++){
                            ?>

                            <span id="thursday<?php echo $i?>" data-day="thursday" data-hour="<?php echo $i?>" data-hasdate="false" class="daypart">

                            </span>

                            <?php
                        }
                    ?>
                </div>

                </div>

                <div class="daywrap">
                    <div class="daytitle">
                        vrijdag
                    </div>
                    <div class="daypartswrap">

                    <?php
                        for($i = 0; $i < 24; $i++){
                            ?>

                            <span id="friday<?php echo $i?>" data-day="friday" data-hour="<?php echo $i?>" data-hasdate="false" class="daypart">

                            </span>

                            <?php
                        }
                    ?>
                </div>

                </div>

                <div class="daywrap">
                    <div class="daytitle">
                        zaterdag
                    </div>
                    <div class="daypartswrap">

                    <?php
                        for($i = 0; $i < 24; $i++){
                            ?>

                            <span id="saturday<?php echo $i?>" data-day="saturday" data-hour="<?php echo $i?>" data-hasdate="false" class="daypart">

                            </span>

                            <?php
                        }
                    ?>
                </div>

                </div>

                <div class="daywrap">
                    <div class="daytitle">
                        zondag
                    </div>
                    <div class="daypartswrap">

                    <?php
                        for($i = 0; $i < 24; $i++){
                            ?>

                            <span id="sunday<?php echo $i?>" data-day="sunday" data-hour="<?php echo $i?>" data-hasdate="false" class="daypart">

                            </span>

                            <?php
                        }
                    ?>
                </div>

                </div>

            </div>
        </main>
    </body>
</html>
