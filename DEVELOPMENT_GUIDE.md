# RedThread Prototype Guide

## What this is

This is a small browser demo for RedThread. RedThread is a safety app idea that helps people notice scams before they lose money, share an OTP, or give away private information.

The demo shows one fake bank scam. The scammer sends an urgent message, asks for a UPI payment, and may later ask for an OTP. RedThread connects these clues and shows a clear warning.

## How to run it

1. Open the project folder.
2. Double-click `code.html`.
3. It opens in Chrome, Edge, Firefox, or another modern browser.
4. No installation, internet connection, account, or command is needed.

## Files

- `code.html` is the complete working prototype. It contains the page design and the demo behaviour.
- `DEVELOPMENT_GUIDE.md` is this simple guide.
- `understanding.md` contains the early product notes for the RedThread idea.

## Things to try in the demo

### Incoming scam and risk score

The first card shows two suspicious messages. It gives the case a risk score of 91 out of 100. The colored labels explain that the scam is asking for payment and may try to steal an OTP.

### Scam DNA

The Scam DNA card shows the reasons for the score. It finds a fake bank identity, urgency, a suspicious link, and a payment request. It also shows a possible next scammer move. This wording says it is a prediction because it cannot be fully certain.

### SafePause payment countdown

The UPI payment is held for 30 seconds. Press **Cancel payment safely** to stop the demo payment. Press **I need more time** to keep it paused.

### Full-screen warning

Press **Open critical warning**. A large warning appears with simple choices: cancel the payment, call the cybercrime helpline, or close the warning.

### Trusted Circle

The demo shows family members who have received an alert. Aditi has replied that the person should not pay. Press **Send alert again** to simulate another alert.

### Grandparent Mode

Grandparent Mode is shown as active. Its purpose is to use clearer language, large warnings, and simple help buttons. This demo displays the status but does not change the full page size when it is switched.

### Emergency help

The buttons show three important actions: call India’s 1930 cybercrime helpline, contact an official bank channel, and block the sender.

### Evidence and complaint timeline

The timeline connects email, SMS, WhatsApp, and the safety action. Press **Add screenshot evidence** to add a sample screenshot event. Press **Prepare complaint** to simulate making a report package.

### Safety activity

At the bottom, the activity record adds a line whenever you use a major button. This makes it easy to see what happened in the case.

## What is simulated

Everything in this prototype is a safe simulation. It does not read real SMS, email, calls, screenshots, links, UPI payments, contacts, or bank accounts. It does not send alerts, make phone calls, block real senders, contact a bank, or report a crime.

The risk score, Scam DNA, AI analysis, scammer prediction, countdown, family response, and evidence are all prewritten example data. They are included to demonstrate the product flow.

## What a real app would need

A real Android app would need clear user permission before reading or receiving any phone data. It would need Android integrations for SMS, notifications, share sheets, calls where allowed, and accessibility features. It would need secure sign-in, encrypted storage, a backend service, and strict privacy rules.

Real payment pausing would require an approved partnership and secure integration with a bank, payment provider, or UPI system. Calling 1930 would use the phone dialer. Bank support would open the official bank contact path. Trusted Circle alerts would need real contacts and a secure notification service.

The real scam detector would need carefully tested rules and possibly AI models. It should explain each warning, allow people to verify a warning, and avoid claiming that a prediction is certain.
