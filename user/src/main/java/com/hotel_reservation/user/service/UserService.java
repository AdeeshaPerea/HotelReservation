package com.hotel_reservation.user.service;


import com.hotel_reservation.user.data.User;
import com.hotel_reservation.user.data.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;


@Service
public class UserService {


    @Autowired
    private UserRepository userRepository;


    // ADD USER
    public User addUser(User user) {
        System.out.println("Adding user: " + user.getUsername());
        return userRepository.save(user);
    }


    // UPDATE USER
    public User updateUser(Long id, User updateData) {
        Optional<User> optionalUser = userRepository.findById(id);


        if (optionalUser.isPresent()) {
            User user = optionalUser.get();


            user.setUsername(updateData.getUsername());
            user.setPassword(updateData.getPassword());
            user.setFirstName(updateData.getFirstName());
            user.setLastName(updateData.getLastName());
            user.setEmail(updateData.getEmail());
            user.setAddress(updateData.getAddress());
            user.setTelephone(updateData.getTelephone());
            user.setBirthday(updateData.getBirthday());
            user.setRole(updateData.getRole());


            System.out.println("Updating user ID: " + id);
            return userRepository.save(user);
        }


        System.out.println("User not found!");
        return null;
    }


    // DELETE USER
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            System.out.println("Deleting user ID: " + id);
            userRepository.deleteById(id);
            return true;
        }
        System.out.println("Delete failed. User not found.");
        return false;
    }


    // GET USER BY ID
    public User getUserById(Long id) {
        System.out.println("Fetching user ID: " + id);
        return userRepository.findById(id).orElse(null);
    }


    // GET ALL USERS
    public List<User> getAllUsers() {
        System.out.println("Fetching all users");
        return userRepository.findAll();
    }


    // REGISTER USER
    public User register(User user) {
        System.out.println("Registering user: " + user.getUsername());


        // check if username already exists
        User existing = userRepository.findByUsername(user.getUsername());
        if (existing != null) {
            System.out.println("Username already exists!");
            return null;
        }


        // Always set role to "user"
        user.setRole("user");


        // Save new user
        return userRepository.save(user);
    }






    // LOGIN USER
    public User login(String username, String password) {
        System.out.println("Login attempt: " + username);


        User user = userRepository.findByUsername(username);


        if (user == null) {
            System.out.println("User not found!");
            return null;
        }


        if (!user.getPassword().equals(password)) {
            System.out.println("Wrong password!");
            return null;
        }


        System.out.println("Login successful! Role = " + user.getRole());
        return user;
    }


}

