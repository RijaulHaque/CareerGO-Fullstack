// filepath: d:\7th Sem\JAVA\Mini Project\CareerGO\Spring\CareerGO\src\main\java\com\example\CareerGO\controller\CareerController.java

package com.example.CareerGO.controller;

import com.example.CareerGO.model.CareerRequest;
import com.example.CareerGO.service.CareerService;
import com.example.CareerGO.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/career")
@CrossOrigin(origins = "http://localhost:5173") 
public class CareerController {

    @Autowired
    private CareerService careerService;
    
    @Autowired
    private PdfService pdfService;

    @PostMapping("/recommend")
    // Returns HTML for UI display (non-blocking)
    public Mono<String> getRecommendation(@RequestBody CareerRequest request) {
        return careerService.recommendCareer(request);
    }

    /**
     * Accepts the RAW Markdown/HTML string from the frontend state and generates a professionally styled PDF.
     * This avoids a redundant second API call to the LLM (Single-Call Architecture).
     */
    @PostMapping("/download-pdf")
    public ResponseEntity<byte[]> downloadPdf(@RequestBody String rawRecommendationText) {
        
        // 🌟 CHANGE: Call the NEW service method that generates the full HTML template 🌟
        // This stylized HTML (with embedded CSS) is what the PdfService needs.
        String styledPdfHtml = careerService.generatePdfHtml(rawRecommendationText);
        
        // Pass the fully styled HTML document to the PdfService
        byte[] pdfBytes = pdfService.generatePdf(styledPdfHtml);

        // Check for potential failure (null bytes from PdfService)
        if (pdfBytes == null) {
            // Check if the service returned a failure message based on empty content
            if (styledPdfHtml.contains("No recommendation content available.")) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST); 
            }
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "CareerGO_Recommendation.pdf"); 
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}