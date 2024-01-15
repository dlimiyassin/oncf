package com.example.amigos.controllers;

import com.example.amigos.requests.QuizRequest;
import com.example.amigos.responses.QuizResponse;
import com.example.amigos.services.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.function.EntityResponse;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    QuizService quizService;

    @GetMapping()
    public List<QuizResponse> getQuiz() {
        return quizService.getQuiz();
    }

    @PostMapping()
    public QuizResponse addQuiz(@RequestBody QuizRequest quizRequest) {
        return quizService.addQuiz(quizRequest);
    }

    @PutMapping("/{id}")
    public QuizResponse editQuiz(@RequestBody QuizRequest quizRequest, @PathVariable Long id) {
        return quizService.editQuiz(quizRequest, id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizResponse> getQuizById(@PathVariable Long id) {
        QuizResponse quizResponse = quizService.getQuizById(id);
        return new ResponseEntity<>(quizResponse, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping()
    public ResponseEntity<Object> deleteAllQuiz() {
        quizService.deleteAllQuiz();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
