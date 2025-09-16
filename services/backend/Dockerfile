# Stage 1: Build the application
FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /home/app
COPY . /home/app
RUN mvn -f /home/app/pom.xml clean package -DskipTests

# Stage 2: Run the application
FROM openjdk:21
COPY --from=build /home/app/target/*.jar /usr/local/lib/app.jar
EXPOSE 8000
ENTRYPOINT ["java","-jar","/usr/local/lib/app.jar"]