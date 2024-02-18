package com.example.amigos.services;

import com.example.amigos.entities.Employe;
import com.example.amigos.entities.Quiz;
import com.example.amigos.entities.QuizStatus;
import com.example.amigos.repositories.EmployeRepository;
import com.example.amigos.repositories.QuizRepository;
import com.example.amigos.repositories.QuizStatusRepository;
import com.example.amigos.requests.EmployeResponse;
import com.example.amigos.responses.QuizResponse;
import com.example.amigos.responses.TestResult;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TestPersonalityService {
    @Autowired
    QuizRepository quizRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private final  EmployeRepository employeRepository;

    @Autowired
    QuizStatusRepository quizStatusRepository;

    public boolean isAuthenticated(String email) throws MessagingException, UnsupportedEncodingException {
        Optional<Employe> employe = employeRepository.findByEmail(email);
        if (employe.isPresent()){
            sendVerificationEmail(employe.get());
            return true;
        }else {
            return false;
        }

    }
    private void sendVerificationEmail(Employe employe)
            throws MessagingException, UnsupportedEncodingException {
        String toAddress = employe.getEmail();
        String fromAddress = "oncf3308@gmail.com";
        String senderName = "Oncf Team";
        String subject = "Personality Quiz";
        String content = "Dear [[name]],<br>"
                + "Please click the link below to start your quiz:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">Pass Quiz</a></h3>"
                + "Good luck,<br>"
                + "ONCF TEAM.";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);
        String fullName = employe.getFirstname() + " " + employe.getLastname();
        content = content.replace("[[name]]", fullName);
        String verifyURL = "http://localhost:4200/#/quiz-employe/" + employe.getEmail() ;

        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);

    }

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
        for (Quiz entity : quizResponses) {
            ModelMapper modelMapper = new ModelMapper();
            QuizResponse quizResponse = modelMapper.map(entity, QuizResponse.class);
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
            newQuizStatus.setStatus(false);
            quizStatusRepository.save(newQuizStatus);

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
        if (status) {
            quizStatus.get().setStatus(false);
            quizStatusRepository.save(quizStatus.get());
        } else {
            quizStatus.get().setStatus(true);
            quizStatusRepository.save(quizStatus.get());
        }
    }
}
