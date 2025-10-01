package com.example.CareerGO.service;

import com.example.CareerGO.model.CareerRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono; 
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CareerService {

    @Value("${perplexity.api.key}") 
    private String perplexityApiKey; 

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final Parser markdownParser = Parser.builder().build();
    private final HtmlRenderer htmlRenderer = HtmlRenderer.builder().build();

    public CareerService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.webClient = webClientBuilder
                .baseUrl("https://api.perplexity.ai/chat/completions")
                .build();
    }

    /**
     * Returns career recommendations as HTML (for direct rendering in UI) as a non-blocking Mono.
     */
    public Mono<String> recommendCareer(CareerRequest request) {
        return getLlmRecommendationMono(request)
                .map(this::convertMarkdownToHtml)
                .onErrorResume(e -> Mono.just("Failed to get recommendation: " + e.getMessage()));
    }
    
    // ❌ NOTE: getRawRecommendation is intentionally omitted for the single-API-call architecture.

    private String buildPrompt(CareerRequest request) {
        return "You are an expert career counselor from CareerGO. Based on the following user details, provide a detailed and thoughtful career recommendation. " +
               "User Name: " + request.getName() + "\n" +
               "Skills: " + request.getSkills() + "\n" +
               "Interests: " + request.getInterests() + "\n" +
               "Goal: " + request.getGoal() + "\n\n" +
               "Provide specific job titles, a brief justification for each, and actionable steps the user can take to pursue this career path. Provide the recommendation in a clear, well-structured text format. Conclude your response with the phrase 'Good Luck!' and attribute it to 'Your CareerGO Counselor.' Finally, include any relevant footnote references or sources used in generating the recommendation.";
    }

    private Mono<String> getLlmRecommendationMono(CareerRequest request) {
        String prompt = buildPrompt(request);
        try {
            ObjectNode rootNode = objectMapper.createObjectNode();
            rootNode.put("model", "sonar-pro"); 
            ArrayNode messagesNode = rootNode.putArray("messages");
            ObjectNode userMessage = messagesNode.addObject();
            userMessage.put("role", "user");
            userMessage.put("content", prompt);
            ObjectNode parametersNode = rootNode.putObject("parameters");
            parametersNode.put("max_new_tokens", 500);
            parametersNode.put("temperature", 0.7);
            String requestBody = rootNode.toString();

            return webClient.post()
                    .header("Authorization", "Bearer " + perplexityApiKey) 
                    .header("Content-Type", "application/json")
                    .body(BodyInserters.fromValue(requestBody))
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(110)) 
                    .map(this::extractRecommendation)
                    .doOnError(e -> System.err.println("LLM API Call Error: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("LLM Request Setup Error: " + e.getMessage());
            return Mono.error(new RuntimeException("Failed to setup LLM request."));
        }
    }
    
    private String extractRecommendation(String llmResponse) {
        try {
            JsonNode rootNode = objectMapper.readTree(llmResponse);
            if (rootNode.has("error")) {
                JsonNode errorNode = rootNode.get("error");
                String errorMessage = errorNode.has("message") ? errorNode.get("message").asText() : "Unknown LLM error";
                return "LLM API Error: " + errorMessage;
            }
            JsonNode choices = rootNode.get("choices");
            if (choices != null && choices.isArray() && choices.size() > 0) {
                JsonNode firstChoice = choices.get(0);
                JsonNode message = firstChoice.get("message");
                if (message != null && message.has("content")) {
                    return message.get("content").asText();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Could not parse the LLM response.";
    }

    private String convertMarkdownToHtml(String markdown) {
        Node document = markdownParser.parse(markdown);
        return htmlRenderer.render(document);
    }
    
    /**
     * Generates a fully styled HTML document using custom CSS and the raw Markdown content.
     * This output is sent to the PdfService for high-quality PDF rendering.
     * The input is the raw Markdown text from the frontend.
     */
    public String generatePdfHtml(String rawMarkdown) {
        if (rawMarkdown == null || rawMarkdown.isEmpty()) {
            return "No recommendation content available.";
        }
        
        // 1. Convert the raw markdown to standard HTML content blocks
        Node document = markdownParser.parse(rawMarkdown);
        String contentHtml = htmlRenderer.render(document);

        // 2. Wrap the content in a full HTML template with professional CSS styling
        String htmlTemplate = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Times New Roman', serif; margin: 50px; color: #333; }
                    h1, h2, h3 { color: #1e40af; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 25px; }
                    p { font-size: 11pt; line-height: 1.6; margin-bottom: 15px; }
                    ul, ol { margin-top: 10px; margin-bottom: 20px; padding-left: 20px; }
                    li { margin-bottom: 5px; }
                    strong { font-weight: bold; }
                    em { font-style: italic; }
                    blockquote { border-left: 4px solid #9333ea; padding: 10px 15px; background: #f9f6ff; margin: 15px 0; }
                    table { width: 100%%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background-color: #f0f4ff; }
                </style>
            </head>
            <body>
                <h1>CareerGO Personalized Recommendation Report</h1>
                <p style="font-size: 10pt; color: #666;">Generated on: %s</p>
                <hr /> %s
                <div style="margin-top: 50px; font-size: 10pt; text-align: right; color: #888;">
                    --- End of Report ---
                </div>
            </body>
            </html>
            """, java.time.LocalDateTime.now(), contentHtml);

        return htmlTemplate;
    }
}