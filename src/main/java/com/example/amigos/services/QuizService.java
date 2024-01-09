package com.example.amigos.services;

import com.example.amigos.entities.Quiz;
import com.example.amigos.entities.QuizStatus;
import com.example.amigos.repositories.QuizRepository;
import com.example.amigos.repositories.QuizStatusRepository;
import com.example.amigos.requests.QuizRequest;
import com.example.amigos.responses.QuizResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuizService {

    @Autowired
    QuizRepository quizRepository;

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

    public QuizResponse addQuiz(QuizRequest quizRequest) {

        ModelMapper modelMapper = new ModelMapper();
        Quiz newQuiz = modelMapper.map(quizRequest,Quiz.class);
        Quiz quiz = quizRepository.save(newQuiz);

        return modelMapper.map(quiz,QuizResponse.class);
    }

    public QuizResponse editQuiz(QuizRequest quizRequest, Long id) {
        Optional<Quiz> quizOptional = quizRepository.findById(id);
        if (quizOptional.isEmpty()) throw new EntityNotFoundException("Quiz with ID " + id + " not found");
        Quiz quiz = quizOptional.get();
        quiz.setQuestion(quizRequest.getQuestion());
        quiz.setOption1(quizRequest.getOption1());
        quiz.setOption2(quizRequest.getOption2());
        quiz.setOption3(quizRequest.getOption3());
        quiz.setOption4(quizRequest.getOption4());
        Quiz updatedQuiz = quizRepository.save(quiz);
        ModelMapper modelMapper = new ModelMapper();
        return modelMapper.map(updatedQuiz,QuizResponse.class);
    }

    public void deleteQuiz(Long id) {
        Optional<Quiz> quizOptional = quizRepository.findById(id);
        if (quizOptional.isPresent()){
            quizRepository.deleteById(id);
        }else { throw new RuntimeException("this quiz does not exist"); }
    }

    public void deleteAllQuiz() {
    quizRepository.deleteAll();
    }

    public QuizResponse getQuizById(Long id) {
        Optional<Quiz> quizOptional = quizRepository.findById(id);
        if (quizOptional.isEmpty()) throw new RuntimeException("this quiz does not exist");
        Quiz quiz = quizOptional.get();
        ModelMapper modelMapper = new ModelMapper();
        return modelMapper.map(quiz,QuizResponse.class);
    }

}
