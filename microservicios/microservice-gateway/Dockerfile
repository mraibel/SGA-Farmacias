FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/microservice-gateway-0.0.1-SNAPSHOT.jar /app/msvc-gateway.jar
ENTRYPOINT ["java", "-jar", "/app/msvc-gateway.jar"]