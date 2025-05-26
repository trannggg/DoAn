package com.web.api;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.web.dto.request.LoginDto;
import com.web.dto.request.PasswordDto;
import com.web.dto.request.TokenDto;
import com.web.dto.request.UserRequest;
import com.web.dto.response.UserDto;
import com.web.entity.User;
import com.web.exception.MessageException;
import com.web.jwt.JwtTokenProvider;
import com.web.repository.UserRepository;
import com.web.service.UserService;
import com.web.utils.MailService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class UserApi {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserUtils userUtils;

    /*token device get from firebase*/
    @PostMapping("/login/email")
    public TokenDto authenticate(@RequestBody LoginDto loginDto) throws Exception {
        TokenDto tokenDto = userService.login(loginDto.getUsername(), loginDto.getPassword(), loginDto.getTokenFcm());
        return tokenDto;
    }

    @PostMapping("/all/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordDto passwordDto){
        userService.changePass(passwordDto.getOldPass(), passwordDto.getNewPass());
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> changePassword(@RequestParam String email){
        userService.forgotPassword(email);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    @GetMapping("/admin/get-user-by-role")
    public ResponseEntity<?> getUserByRole(@RequestParam(value = "role", required = false) String role,
                                           @RequestParam(value = "q", required = false) String search,
                                           Pageable pageable){
        if(search == null){
            search = "";
        }
        Page<User> result = userService.getUserByRole("%"+search+"%",role,pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/admin/check-role-admin")
    public void checkRoleAdmin(){
        System.out.println("admin");
    }

    @GetMapping("/user/check-role-user")
    public void checkRoleUser(){
        System.out.println("user");
    }

    @PostMapping("/admin/lockOrUnlockUser")
    public void activeOrUnactiveUser(@RequestParam("id") Long id){
        User user = userRepository.findById(id).get();
        if(user.getActived() == true){
            user.setActived(false);
            userRepository.save(user);
            return;
        }
        else{
            user.setActived(true);
            userRepository.save(user);
        }
    }

    @PostMapping("/admin/addaccount")
    public ResponseEntity<?> addaccount(@RequestBody User user) throws URISyntaxException {
        User result= userService.addAccount(user);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PostMapping("/public/init-forgotpasss")
    public ResponseEntity<?> quenMatKhau(@RequestParam String email) throws URISyntaxException {
        userService.guiYeuCauQuenMatKhau(email);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/public/finish-reset-pass")
    public ResponseEntity<?> datLaiMatKhau(@RequestParam String email, @RequestParam String key,
                                           @RequestParam String password) throws URISyntaxException {
        userService.xacNhanDatLaiMatKhau(email, password, key);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @PostMapping("/user/user-logged")
    public ResponseEntity<?> inforLogged()  {
        return new ResponseEntity<>(userUtils.getUserWithAuthority(),HttpStatus.OK);
    }


}
