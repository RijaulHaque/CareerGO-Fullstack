// D:\7th Sem\JAVA\Mini Project\CareerGO\Spring\CareerGO\src\main\java\com\example\CareerGO\service\PdfService.java

package com.example.CareerGO.service;

import com.lowagie.text.DocumentException;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.xhtmlrenderer.pdf.ITextRenderer;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfService {

    public byte[] generatePdf(String htmlContent) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            
            // 1. Parse the HTML string into a W3C Document (required by Flying Saucer)
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new ByteArrayInputStream(htmlContent.getBytes()));

            // 2. Use ITextRenderer (from Flying Saucer/OpenPDF) to render the HTML
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocument(doc, null);
            renderer.layout();
            
            // 3. Write the rendered content to the output stream
            renderer.createPDF(outputStream);
            
            return outputStream.toByteArray();
        } catch (DocumentException | IOException e) {
            e.printStackTrace();
            return null;
        } catch (Exception e) {
            // Catches XML/Document parsing errors
            e.printStackTrace();
            return null;
        }
    }
}