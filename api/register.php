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

try {
    if(
        !empty($data->username) &&
        !empty($data->email) &&
        !empty($data->password) &&
        !empty($data->role)
    ) {
        // Validate role
        $allowed_roles = ['student', 'employee'];
        if (!in_array($data->role, $allowed_roles)) {
            throw new Exception("Invalid role specified");
        }

        $user->username = $data->username;
        $user->email = $data->email;
        $user->password = $data->password;
        $user->role = $data->role;

        // Validate password strength
        if (strlen($data->password) < 8) {
            throw new Exception("Password must be at least 8 characters long");
        }
        if (!preg_match("/[A-Z]/", $data->password)) {
            throw new Exception("Password must contain at least one uppercase letter");
        }
        if (!preg_match("/[0-9]/", $data->password)) {
            throw new Exception("Password must contain at least one number");
        }

        // Check if email already exists
        if($user->emailExists()) {
            throw new Exception("Email already exists");
        }

        // Create the user
        if($user->create()) {
            http_response_code(201);
            echo json_encode(array(
                "status" => true,
                "message" => "User was created."
            ));
        } else {
            throw new Exception("Unable to create user");
        }
    } else {
        throw new Exception("Unable to create user. Data is incomplete.");
    }
} catch(Exception $e) {
    http_response_code(400);
    echo json_encode(array(
        "status" => false,
        "message" => $e->getMessage()
    ));
}
?> 