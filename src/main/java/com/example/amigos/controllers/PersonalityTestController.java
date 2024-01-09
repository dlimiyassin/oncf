package com.example.amigos.controllers;

import com.example.amigos.requests.EmployeResponse;
import com.example.amigos.responses.QuizResponse;
import com.example.amigos.responses.TestResult;
import com.example.amigos.services.QuizService;
import com.example.amigos.services.TestPersonalityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
public class PersonalityTestController {

    @Autowired
    TestPersonalityService test;

    @GetMapping()
    public List<QuizResponse> getQuiz(){
        return test.getQuiz();
    }
    @PostMapping()
    public ResponseEntity<TestResult> getResult(@RequestBody List<EmployeResponse> employeResponses){
        TestResult testResult = test.calculateTestResult(employeResponses);
        return new ResponseEntity<>(testResult, HttpStatus.CREATED);
    }

    @GetMapping("/get-status")
    public ResponseEntity<Boolean> getQuizStatus(){
        Boolean status = test.getQuizStatus();
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    @GetMapping("/change-status")
    public ResponseEntity<Boolean> changeQuizStatus(){
        test.changeQuizStatus();
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

}
