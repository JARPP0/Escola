<?php
    session_start();
    include("z-database.php");  
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="\Marcos 1B - Fábrica de Sites\projeto\a-form.css">
</head>
<body>
    <div id="forms">
        <form action="a-form.php" method="POST" class="form" id="sign">
            <h1>Sign in</h1>
            <div>Username: <input name="username" type="text"><br></div>
            <div>Password: <input name="password" type="text"><br></div>
            <input type="submit" name="submit1" class="submit-button">
        </form>
        <form action="a-form.php" method="POST" class="form" id="log">
            <h1>Log in</h1>
            <div>Username: <input name="username" type="text"><br></div>
            <div>Password: <input name="password" type="text"><br></div>
            <input type="submit" name="submit2" class="submit-button">
        </form>
    </div>
    <script src="\Marcos 1B - Fábrica de Sites\projeto\form.js"></script>
</body>
</html>
<?php
    if(isset($_POST["submit1"])){
        $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_SPECIAL_CHARS);
        $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_SPECIAL_CHARS);
        $saveurl = 0;
        if(empty($username)){
            echo "<script> document.title = `Por favor, coloque um nome`</script>";
        }
        elseif(empty($password)){
            echo "<script> document.title = `Por favor, coloque uma senha`</script>";
        }
        else{
            $hash = password_hash($password, PASSWORD_DEFAULT);
            try{
                $stmt = $conn->prepare("INSERT INTO users (username, password, saveurl) VALUES (?, ?, ?)");
                $stmt->bind_param('ssi', $username, $hash, $saveurl);
                $stmt->execute();
                $_SESSION["username"] = $username;
                $_SESSION["password"] = $password;
                header("Location: b-index.php");
                exit();
            }
            catch (mysqli_sql_exception $e){
                echo "<script> document.title = `Este nome já está selecionado, tente outro`</script>";
            }
        }
    }
    if(isset($_POST["submit2"])){
        $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_SPECIAL_CHARS);
        $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_SPECIAL_CHARS);
        if(empty($username)){
            echo "<script> document.title = `Por favor, coloque um nome`</script>";
        }
        elseif(empty($password)){
            echo "<script> document.title = `Por favor, coloque uma senha`</script>";
        }
        else{
            $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->bind_param('s', $username);
            $stmt->execute();
            $result = $stmt->get_result();
            while($result->num_rows > 0){
                while($row = $result->fetch_assoc()){
                    $password = $row["password"];
                    echo "<script> console.log($password)</script>";
                }
            }
        }
    }
?>