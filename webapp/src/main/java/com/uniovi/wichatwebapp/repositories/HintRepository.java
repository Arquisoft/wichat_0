package com.uniovi.wichatwebapp.repositories;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;

@Repository
public class HintRepository {
    private WebClient.Builder webClientBuilder;

    @Value("${hintservice.url}")
    private String baseUrl;

    public HintRepository(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    /*
    public String ask(String question, String answer) {
        return webClientBuilder
                .baseUrl(baseUrl) // Set base URL here or in config
                .build()
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/askHint")
                        .queryParam("question", question)
                        .queryParam("answerQuestion", answer)
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String askWithInstructions(String instructions, String question, String answer) {
        return webClientBuilder
                .baseUrl(baseUrl) // Set base URL here or in config
                .build()
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/askHintWithInstructions")
                        .queryParam("instructions", instructions)
                        .queryParam("question", question)
                        .queryParam("answerQuestion", answer)
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
    */

    public String askWithInstructions(String instructions, String question, String answer, String alreadySaidHints) {
        return webClientBuilder
                .baseUrl(baseUrl) // Set base URL here or in config
                .build()
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/askHintWithInstructions")
                        .queryParam("instructions", instructions)
                        .queryParam("question", question)
                        .queryParam("answerQuestion", answer)
                        .queryParam("hints", alreadySaidHints)
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
