
# Step 1: Build the Spring Boot application
FROM maven:3.8.2-openjdk-17-slim AS build

LABEL authors="yassi"

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

# Step 2: Run the Spring Boot application
FROM openjdk:17-jdk-slim

ENV SPRING_PROFILES_ACTIVE=prod

COPY --from=build /app/target/*.jar /app/OncfRestApi.jar

EXPOSE 8023

ENTRYPOINT ["java", "-jar", "/app/OncfRestApi.jar"]