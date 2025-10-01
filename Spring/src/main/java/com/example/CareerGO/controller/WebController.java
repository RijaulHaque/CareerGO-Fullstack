// filepath: d:\7th Sem\JAVA\Mini Project\CareerGO\Spring\CareerGO\src\main\java\com\example\CareerGO\controller\WebController.java
package com.example.CareerGO.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("message", "Welcome to CareerGO!");
        return "home";
    }
}