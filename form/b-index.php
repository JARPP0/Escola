<?php
    session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>
        let transferList = {
            username: "<?php echo $_SESSION["username"]?>",
            password: "<?php echo $_SESSION["password"]?>"
        }
    </script>
    <script src="\Marcos 1B - Fábrica de Sites\projeto\b-script.js"></script>
</body>
</html>