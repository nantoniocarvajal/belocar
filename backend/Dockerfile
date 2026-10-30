FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml ./
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S belocar && adduser -S belocar -G belocar
COPY --from=build /app/target/*.jar app.jar
RUN mkdir -p /app/uploads && chown -R belocar:belocar /app
USER belocar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
