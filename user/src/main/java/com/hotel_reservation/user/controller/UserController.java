package com.hotel_reservation.user.controller;


import com.hotel_reservation.user.data.User;
import com.hotel_reservation.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/user")
public class UserController {


    @Autowired
    private UserService userService;


    // ADD USER
    @PostMapping("/add")
    public User addUser(@RequestBody User user) {
        return userService.addUser(user);
    }


    // UPDATE USER
    @PutMapping("/update/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser
    ) {
        return userService.updateUser(id, updatedUser);
    }


    // DELETE USER
    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        return deleted ? "User deleted" : "User not found";
    }


    // GET USER BY ID
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }


    // GET ALL USERS
    @GetMapping("/all")
    public List<User> getAll() {
        return userService.getAllUsers();
    }


    // REGISTER
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        User saved = userService.register(user);
        if (saved == null) {
            return "Username already exists!";
        }
        return "Registration successful!";
    }


    // LOGIN
    @PostMapping("/login")
    public Object login(@RequestBody User user) {
        User loggedUser = userService.login(user.getUsername(), user.getPassword());


        if (loggedUser == null) {
            return "Invalid username or password!";
        }


        return loggedUser; // returns user object including role
    }
}

