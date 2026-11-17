# Stage 1: build
FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /home/app

# Used by sentry-maven-plugin to upload the source bundle during package
ARG SENTRY_AUTH_TOKEN

# Dependency layer: cached until pom.xml changes
COPY pom.xml .
RUN mvn -B -q dependency:go-offline || true

COPY src ./src
RUN mvn -B clean package -DskipTests

# Stage 2: run
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /home/app/target/*.jar app.jar

ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError"
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "app.jar"]
