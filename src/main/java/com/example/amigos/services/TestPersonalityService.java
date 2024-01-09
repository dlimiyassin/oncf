package com.example.amigos.services;

import com.example.amigos.entities.Quiz;
import com.example.amigos.entities.QuizStatus;
import com.example.amigos.repositories.QuizRepository;
import com.example.amigos.repositories.QuizStatusRepository;
import com.example.amigos.requests.EmployeResponse;
import com.example.amigos.responses.QuizResponse;
import com.example.amigos.responses.TestResult;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TestPersonalityService {
    @Autowired
    QuizRepository quizRepository;

    @Autowired
    QuizStatusRepository quizStatusRepository;

    public TestResult calculateTestResult(List<EmployeResponse> employeResponses) {
        int totalScore = 0;

        for (EmployeResponse response : employeResponses) {
            // Retrieve the question based on questionId
            Quiz question = quizRepository.findById(response.getQuestionId()).orElse(null);

            if (question != null) {
                // Assign points based on the selected option
                if (question.getOption1().equals(response.getSelectedOption())) {
                    totalScore += 1;
                } else if (question.getOption2().equals(response.getSelectedOption())) {
                    totalScore += 2;
                } else if (question.getOption3().equals(response.getSelectedOption())) {
                    totalScore += 3;
                } else if (question.getOption4().equals(response.getSelectedOption())) {
                    totalScore += 4;
                }
            }
        }

        return new TestResult(totalScore);
    }

    public List<QuizResponse> getQuiz() {
        List<Quiz> quizResponses = quizRepository.findAll();
        List<QuizResponse> quizResponsesList = new ArrayList<>();
        for (Quiz entity: quizResponses){
            ModelMapper modelMapper = new ModelMapper();
            QuizResponse quizResponse = modelMapper.map(entity,QuizResponse.class);
            quizResponsesList.add(quizResponse);
        }
        return quizResponsesList;
    }

    public boolean getQuizStatus() {
        // Check if the table is empty
        long count = quizStatusRepository.count();

        if (count == 0) {
            // If the table is empty, insert a new QuizStatus with id = 1
            QuizStatus newQuizStatus = new QuizStatus();
            newQuizStatus.setId(1);
            newQuizStatus.setStatus(false); // Set the default status, or modify as needed
            quizStatusRepository.save(newQuizStatus);

            // Return the status of the newly inserted QuizStatus
            return newQuizStatus.getStatus();
        } else {
            // If the table is not empty, retrieve the existing QuizStatus with id = 1
            QuizStatus existingQuizStatus = quizStatusRepository.findById(1).orElse(null);

            // Return the status of the existing QuizStatus if found, or a default value if not found
            return (existingQuizStatus != null) ? existingQuizStatus.getStatus() : false;
        }
    }

    public void changeQuizStatus() {
        Optional<QuizStatus> quizStatus = quizStatusRepository.findById(1);
        Boolean status = quizStatus.get().getStatus();
        if (status){
            quizStatus.get().setStatus(false);
            quizStatusRepository.save(quizStatus.get());
        }else{
            quizStatus.get().setStatus(true);
            quizStatusRepository.save(quizStatus.get());
        }
    }
}
