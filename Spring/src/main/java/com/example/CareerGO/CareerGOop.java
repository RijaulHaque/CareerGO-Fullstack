package com.example.CareerGO;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class CareerGOop extends JFrame implements ActionListener {
    private JTextField nameField, skillField, interestField, goalField;
    private JTextArea outputArea;
    private JButton submitBtn, clearBtn;

    public CareerGOop(){
        setTitle("CareerGO: An AI-Powered Career Counseling");
        setSize(500, 400);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        JPanel inputPanel = new JPanel(new GridLayout(5, 2, 5, 5));
        inputPanel.add(new JLabel("Name:"));
        nameField = new JTextField();
        inputPanel.add(nameField);

        inputPanel.add(new JLabel("Skills:"));
        skillField = new JTextField();
        inputPanel.add(skillField);

        inputPanel.add(new JLabel("Interests:"));
        interestField = new JTextField();
        inputPanel.add(interestField);

        inputPanel.add(new JLabel("Career Goal:"));
        goalField = new JTextField();
        inputPanel.add(goalField);

        submitBtn = new JButton("Get Recommendation");
        clearBtn = new JButton("Clear");
        inputPanel.add(submitBtn);
        inputPanel.add(clearBtn);

        add(inputPanel, BorderLayout.NORTH);

        outputArea = new JTextArea();
        outputArea.setEditable(false);
        add(new JScrollPane(outputArea), BorderLayout.CENTER);

        submitBtn.addActionListener(this);
        clearBtn.addActionListener(e -> {
            nameField.setText("");
            skillField.setText("");
            interestField.setText("");
            goalField.setText("");
            outputArea.setText("");
        });
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        String name = nameField.getText().trim();
        String skills = skillField.getText().toLowerCase();
        String interests = interestField.getText().toLowerCase();
        String goal = goalField.getText().toLowerCase();

        StringBuilder recommendation = new StringBuilder();
        recommendation.append("Hello, ").append(name).append("!\n");
        recommendation.append("Based on your profile, we recommend:\n\n");

        if (skills.contains("programming") || interests.contains("technology")) {
            recommendation.append("- Software Developer\n");
            recommendation.append("- Data Scientist\n");
        }
        if (skills.contains("communication") || interests.contains("writing")) {
            recommendation.append("- Journalist\n");
            recommendation.append("- Content Creator\n");
        }
        if (skills.contains("biology") || interests.contains("health")) {
            recommendation.append("- Doctor\n");
            recommendation.append("- Biotechnologist\n");
        }
        if (skills.contains("math") || interests.contains("finance")) {
            recommendation.append("- Accountant\n");
            recommendation.append("- Financial Analyst\n");
        }
        if (skills.contains("art") || interests.contains("design")) {
            recommendation.append("- Graphic Designer\n");
            recommendation.append("- Animator\n");
        }

        if (recommendation.toString().endsWith("recommend:\n\n")) {
            recommendation.append("No specific recommendation found. Try entering broader skills or interests.");
        }

        outputArea.setText(recommendation.toString());
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            CareerGOop app = new CareerGOop();
            app.setVisible(true);
        });
    }
}