// --- START OF FIREBASE CONFIGURATION ---
// PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
const firebaseConfig = {
  apiKey: "AIzaSyDSR4F_neduMfzsz4w-LUjuCuCBGIcX0b4",
  authDomain: "teste-de-ingles-e4285.firebaseapp.com",
  projectId: "teste-de-ingles-e4285",
  storageBucket: "teste-de-ingles-e4285.appspot.com",
  messagingSenderId: "866272890691",
  appId: "1:866272890691:web:8f1a54321d72efb8e569f6"
};
// --- END OF FIREBASE CONFIGURATION ---

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const startScreen = document.getElementById('start-screen');
const testScreen = document.getElementById('test-screen');
const resultScreen = document.getElementById('result-screen');
const userForm = document.getElementById('user-form');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const audioPlayerContainer = document.getElementById('audio-player-container');
const progressBarFull = document.getElementById('progress-bar-full');
const resultLevel = document.getElementById('result-level');
const userNameResult = document.getElementById('user-name-result');

// User Data
let user = {
    firstName: '',
    lastName: ''
};
let currentQuestionIndex = 0;
let score = 0;

// Test Questions [Source: EnglishProficiencyTest.docx and audio files]
const questions = [
    // Part 1 – Basic (A1–A2)
    { type: 'text', question: 'Complete the greeting: "Good morning, ______."', options: ['you fine?', 'how are you?', 'are good?', 'you okay?'], correct: 'how are you?' },
    { type: 'text', question: 'Choose the correct sentence:', options: ['He work in agribusiness.', 'He works in agribusiness.', 'He working in agribusiness.', 'He is work agribusiness.'], correct: 'He works in agribusiness.' },
    { type: 'text', question: 'Fill in the blank: "Brazil is famous ______ coffee."', options: ['in', 'for', 'on', 'at'], correct: 'for' },
    { type: 'text', question: 'Which word is the opposite of “import”?', options: ['buy', 'send', 'export', 'transport'], correct: 'export' },
    { type: 'text', question: 'Choose the correct question:', options: ['Where Mato Grosso do Sul is?', 'Where is Mato Grosso do Sul?', 'Mato Grosso do Sul is where?', 'Where Mato Grosso do Sul?'], correct: 'Where is Mato Grosso do Sul?' },
    // Part 2 – Pre-Intermediate (A2–B1)
    { type: 'text', question: 'Choose the correct sentence:', options: ['Farmers need much informations.', 'Farmers needs many information.', 'Farmers need a lot of information.', 'Farmers need informations.'], correct: 'Farmers need a lot of information.' },
    { type: 'text', question: 'Fill in the blank: "By 2050, the world population ______ almost 10 billion."', options: ['reach', 'will reach', 'reached', 'reaching'], correct: 'will reach' },
    { type: 'text', question: 'Which word is closest in meaning to “sustainable”?', options: ['temporary', 'renewable', 'expensive', 'traditional'], correct: 'renewable' },
    { type: 'text', question: 'Choose the correct option: "Networking is important because it helps professionals ______ new contacts."', options: ['to build', 'building', 'builded', 'builds'], correct: 'to build' },
    { type: 'text', question: 'Choose the correct answer: "Traceability means…"', options: ['knowing where products come from', 'selling more products', 'increasing prices', 'working with technology'], correct: 'knowing where products come from' },
    // Part 3 – Intermediate (B1–B2)
    { type: 'text', question: 'Choose the correct form: "If exports increase, farmers ______ more profit."', options: ['will make', 'makes', 'making', 'make'], correct: 'will make' },
    { type: 'text', question: 'Choose the sentence with correct word order:', options: ['Brazil exports soybeans to many countries.', 'Soybeans Brazil many to exports countries.', 'Brazil many exports soybeans countries.', 'Soybeans exports Brazil many to countries.'], correct: 'Brazil exports soybeans to many countries.' },
    { type: 'audio', audioSrc: 'ttsreader_13.mp3', question: 'Listen to the audio. From which platform will the train depart?', options: ['Platform 1', 'Platform 3', 'Platform 7', 'Platform 10'], correct: 'Platform 3' },
    { type: 'text', question: 'Which sentence is correct?', options: ['Mato Grosso do Sul is larger that São Paulo.', 'Mato Grosso do Sul is more large than São Paulo.', 'Mato Grosso do Sul is larger than São Paulo.', 'Mato Grosso do Sul is largest São Paulo.'], correct: 'Mato Grosso do Sul is larger than São Paulo.' },
    { type: 'text', question: 'Choose the correct connector: "Brazil exports beef, ______ it also exports coffee."', options: ['so', 'but', 'and', 'because'], correct: 'and' },
    { type: 'text', question: 'Which sentence uses the passive voice correctly?', options: ['Soybeans are exported to China.', 'China exports are soybeans.', 'Soybeans exporting to China.', 'Soybeans is export China.'], correct: 'Soybeans are exported to China.' },
    // --- QUESTION 17 CORRECTED AS REQUESTED ---
    { type: 'audio', audioSrc: 'ttsreader_17.mp3', question: 'Listen to the audio and choose the best answer.', options: ['The speaker is discussing environmental issues.', 'The speaker is telling a funy story.', 'The speaker is explaining a recipe.', 'The speaker is describing a sport.'], correct: 'The speaker is discussing environmental issues.' },
    // --- END OF CORRECTION ---
    // Part 4 – Upper-Intermediate (B2–C1)
    { type: 'text', question: 'Choose the correct word to complete the sentence: "Global demand for food is ______ rapidly."', options: ['increase', 'increases', 'increasing', 'increased'], correct: 'increasing' },
    { type: 'text', question: 'Which is the best summary of this idea? "Mato Grosso do Sul improves logistics to reduce export costs."', options: ['Logistics make food expensive.', 'Better logistics reduce costs.', 'Logistics are not important.', 'Mato Grosso do Sul stops exports.'], correct: 'Better logistics reduce costs.' },
    { type: 'text', question: 'Which option is the most formal?', options: ['We wanna sell more soybeans.', 'We would like to expand soybean exports.', 'We going to sell soybeans.', 'We sell soybeans fast.'], correct: 'We would like to expand soybean exports.' },
    { type: 'text', question: 'Complete the sentence with the best modal verb: "International companies ______ invest in sustainable projects."', options: ['must', 'can’t', 'doesn’t', 'is'], correct: 'must' },
    { type: 'text', question: 'Choose the best sentence:', options: ['Innovation is essential, however it creates opportunities for growth.', 'Innovation is essential; however, it creates opportunities for growth.', 'Innovation essential, however creates opportunities.', 'Innovation essential but growth.'], correct: 'Innovation is essential; however, it creates opportunities for growth.' },
    { type: 'audio', audioSrc: 'ttsreader_23.mp3', question: "Listen to the audio. What was said about the committee's decision?", options: ['It was expected.', 'It was unexpected.', 'It was ignored.', 'It was postponed.'], correct: 'It was unexpected.' }
];

// Event Listeners
userForm.addEventListener('submit', startTest);

function startTest(e) {
    e.preventDefault();
    user.firstName = document.getElementById('first-name').value;
    user.lastName = document.getElementById('last-name').value;
    if (user.firstName && user.lastName) {
        startScreen.classList.remove('active');
        testScreen.classList.add('active');
        displayQuestion();
    }
}

function displayQuestion() {
    // Clear previous question
    optionsContainer.innerHTML = '';
    audioPlayerContainer.innerHTML = '';

    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        questionText.innerText = `${currentQuestionIndex + 1}. ${question.question}`;

        // Update Progress Bar
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBarFull.style.width = `${progress}%`;

        // Handle audio questions
        if (question.type === 'audio') {
            const audioPlayer = document.createElement('audio');
            audioPlayer.controls = true;
            audioPlayer.src = question.audioSrc;
            audioPlayerContainer.appendChild(audioPlayer);
        }

        // Display options
        question.options.forEach(optionText => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.innerText = optionText;
            optionElement.addEventListener('click', () => selectAnswer(optionElement, optionText, question.correct));
            optionsContainer.appendChild(optionElement);
        });
    } else {
        // End of test
        showResults();
    }
}

function selectAnswer(optionElement, selectedAnswer, correctAnswer) {
    // Disable all options
    document.querySelectorAll('.option').forEach(opt => opt.classList.add('disabled'));

    if (selectedAnswer === correctAnswer) {
        score++;
        optionElement.classList.add('correct');
    } else {
        optionElement.classList.add('incorrect');
        // Highlight the correct answer
        document.querySelectorAll('.option').forEach(opt => {
            if (opt.innerText === correctAnswer) {
                opt.classList.add('correct');
            }
        });
    }

    // Go to the next question after a short delay
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 1500); // 1.5 second delay
}

function showResults() {
    testScreen.classList.remove('active');
    resultScreen.classList.add('active');

    const result = calculateCEFRLevel(score);
    userNameResult.innerText = `${user.firstName} ${user.lastName}`;
    resultLevel.innerText = result;
    
    saveResultsToFirebase(result);
}

function calculateCEFRLevel(finalScore) {
    const totalQuestions = questions.length;
    const percentage = (finalScore / totalQuestions) * 100;

    if (percentage <= 21) return 'A1'; // ~0-5 correct
    if (percentage <= 43) return 'A2'; // ~6-10 correct
    if (percentage <= 65) return 'B1'; // ~11-15 correct
    if (percentage <= 82) return 'B2'; // ~16-19 correct
    if (percentage <= 95) return 'C1'; // ~20-22 correct
    return 'C2'; // 23 correct
}

function saveResultsToFirebase(result) {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0]; // Format: HH:MM:SS

    db.collection("testResults").add({
        FirstName: user.firstName,
        LastName: user.lastName,
        Result: result,
        Date: date,
        Time: time,
        Score: score,
        Timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}
