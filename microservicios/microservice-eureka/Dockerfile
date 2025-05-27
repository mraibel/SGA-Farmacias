FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/microservice-eureka-0.0.1-SNAPSHOT.jar /app/msvc-eureka.jar
ENTRYPOINT ["java", "-jar", "/app/msvc-eureka.jar"]