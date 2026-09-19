# RedThread Project Explained

## What is RedThread?

RedThread is a hackathon project idea to protect people from scams, especially scams where someone is pressured to send money quickly.

The main problem is that a scammer may pretend to be a bank, police officer, CBI officer, courier company, or cybercrime officer. They create fear and urgency. They may say that an account will be frozen, a person will be arrested, or money must be sent immediately.

RedThread tries to give the victim time to stop, think, and ask for help before money is lost.

## The main idea in one sentence

When RedThread notices a possible scam pattern, it pauses a risky payment, warns the user, alerts trusted family or friends, and helps the user report the fraud.

## What has been built so far

We created a browser prototype. It is not a real banking or Android app yet. It is a working visual demo for the hackathon.

The prototype shows a fake bank scam:

1. The user receives suspicious messages.
2. RedThread connects the messages and finds danger signals.
3. It gives a high risk score.
4. A UPI payment is placed in a SafePause countdown.
5. The user can open a full-screen warning.
6. Trusted people are shown as being alerted.
7. The user can prepare evidence and use emergency reporting actions.

## Important features in the demo

### 1. Scam pattern detection

The demo finds scam signs such as a fake bank identity, urgency, a suspicious website link, a request for payment, secrecy, and possible OTP theft.

In a real app, an AI or LLM would analyze messages, screenshots, and user-approved call information. In this prototype, the analysis result is already prepared so that it can be demonstrated quickly.

### 2. Scam DNA and risk score

Scam DNA means the reasons why RedThread thinks something is dangerous. Instead of only saying "this is a scam," it explains the clues.

The demo score is 91 out of 100 because it finds bank impersonation, urgency, a look-alike link, and a payment demand.

### 3. SafePause payment protection

SafePause is the most important feature. A suspicious UPI payment is temporarily held for 30 seconds. The user can cancel the payment safely or ask for more time.

In a real product, this would need permission and technical partnerships with banks or UPI/payment providers. The demo only simulates this protection.

### 4. Critical warning

The user can press the red button to open a large warning. It says not to send money or share an OTP. This makes a serious warning difficult to ignore during a stressful scam situation.

### 5. Trusted Circle

Trusted Circle means family members or friends chosen by the user. When there is high risk, RedThread can alert them so they can call the user and help them avoid acting under pressure.

### 6. Evidence timeline and complaint pack

The demo connects email, SMS, WhatsApp, payment, and screenshot evidence into one timeline. It can simulate adding a screenshot and preparing a complaint package.

In the future, this package could help a victim report fraud to their bank, the cybercrime portal, or the 1930 cybercrime helpline.

### 7. Grandparent Mode

Grandparent Mode is for people who may not be comfortable with technical apps. The design idea includes bigger warnings, simpler words, one-tap help, local-language support, and easy family contact.

## Files in this folder

| File | Simple explanation |
|---|---|
| `code.html` | The working browser demo. Open this file to see the RedThread screen. |
| `style.css` | The design file. It controls colors, cards, buttons, spacing, alerts, and mobile appearance. The design is inspired by the clean style of HeroUI. |
| `DEVELOPMENT_GUIDE.md` | A beginner guide focused on how to open and test the demo. |
| `understanding.md` | The original product ideas and early planning notes. |
| `PROJECT_EXPLAINED.md` | This file. It explains the whole project in simple language. |

## How to run the prototype

1. Open this project folder.
2. Double-click `code.html`.
3. It will open in Chrome, Edge, Firefox, or another modern browser.
4. No installation, login, internet connection, or coding knowledge is needed.

## What to show during the hackathon demo

Use this story:

1. A scammer sends a fake message claiming that the victim's bank account will be frozen.
2. The scammer asks for a UPI payment and tells the victim not to tell anyone.
3. RedThread recognizes the pattern and shows a critical risk score.
4. The payment is paused through SafePause.
5. RedThread tells the victim why it is risky.
6. A trusted family member is alerted.
7. The victim can cancel the payment, call 1930, contact the bank, and make an evidence report.

## What is real and what is simulated?

The website interface, buttons, countdown, warning window, timeline, and notifications are real and work in the browser.

The following are simulated for the hackathon prototype:

- AI/LLM analysis of actual incoming messages and calls
- Automatic UPI payment pause
- Real card or bank account freeze
- Real call to 1930
- Sending real alerts to family or friends
- Submitting a real cybercrime complaint

For a production app, these features would require user consent, Android permissions, security checks, and official partnerships with banks, UPI providers, and reporting systems.

## GitHub

The project is connected to this GitHub repository:

https://github.com/Aditi-Tripathiii/Red-Thread

The product brief in `understanding.md` has already been pushed there. The newer prototype files need to be committed and pushed when you are ready to share them with teammates.

## Next steps

1. Open `code.html` and make sure you like the design.
2. Tell us any text, colors, features, or screens you want changed.
3. Add the prototype files to GitHub so your teammates can see them.
4. Prepare a short presentation using the demo story above.
5. Later, turn the demo into an Android app and connect real services safely.
