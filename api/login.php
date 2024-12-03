<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'config/database.php';
include_once 'models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    $user->email = $data->email;
    
    $login_result = $user->login($data->email, $data->password);
    
    if($login_result) {
        // Generate JWT or session token here if needed
        http_response_code(200);
        echo json_encode(array(
            "status" => true,
            "message" => "Login successful",
            "id" => $login_result['id'],
            "username" => $login_result['username']
        ));
    } else {
        http_response_code(401);
        echo json_encode(array(
            "status" => false,
            "message" => "Invalid credentials"
        ));
    }
} else {
    http_response_code(400);
    echo json_encode(array(
        "status" => false,
        "message" => "Unable to login. Data is incomplete."
    ));
}
?> 